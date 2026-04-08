import {injectService, Service} from "@pollux/service"
import {DiscordEventService, DiscordService} from "@pollux/discord"
import {SettingsService} from "@pollux/settings"
import {PoExchangeSettingsKeys} from "../PoExchangeDeclaration"
import {DISCORD_MENTION_PATTERN} from "../PoExchangeConstants"
import {Events, Message, TextChannel} from "discord.js"
import {ControllerContext, useContext} from "@pollux/core"
import {LogLevel} from "@pollux/logging"
import {translate} from "@pollux/i18n"
import {PoExchangeApiService} from "./PoExchangeApiService"
import {VouchRoleService} from "./VouchRoleService"
import {formatVouchCountEmbed, formatVouchError, formatVouchSaved, formatCountError} from "../formatters/formatVouch"
import {VouchCountRequest, VouchRequest} from "../types/VouchTypes"

const MENTION_PATTERN = /^<@!?\d+>\s+.+$/s
const VOUCH_COUNT_PATTERN = /^\?v\s+(.+)$/

export class MessageVouchService extends Service {
    @injectService
    private discordEventService!: DiscordEventService

    @injectService
    private discordService!: DiscordService

    @injectService
    private poExchangeApiService!: PoExchangeApiService

    @injectService
    private settingsService!: SettingsService

    @injectService
    private vouchRoleService!: VouchRoleService

    public async init(): Promise<void> {
        DiscordService.onClientReady.addListener(async () => {
            this.discordEventService.subscribe(Events.MessageCreate, this.onMessage)
        })
    }

    private onMessage = async (message: Message): Promise<void> => {
        if (message.author.bot) return
        if (!message.guildId) return

        const vouchChannelId = this.settingsService.get(PoExchangeSettingsKeys.VouchChannel, message.guildId)
        if (!vouchChannelId || message.channelId !== vouchChannelId) return

        const countMatch = message.content.match(VOUCH_COUNT_PATTERN)
        if (countMatch) {
            await this.handleVouchCount(message, countMatch[1])
            return
        }

        if (message.content.match(MENTION_PATTERN)) {
            const target = message.mentions.users.first()
            if (target) {
                if (target.id === message.author.id) {
                    await message.reply(translate("poex.vouch.selfVouch"))
                    return
                }
                await this.handleVouch(message, target.id)
            }
            return
        }
    }

    private async handleVouch(message: Message, targetId: string): Promise<void> {
        const {loggingController} = useContext(ControllerContext)

        const request: VouchRequest = {
            type: "message",
            voucherId: message.author.id,
            voucherUsername: message.author.username,
            channelId: message.channelId,
            channelName: (message.channel as TextChannel)?.name ?? "unknown",
            messageContent: message.content,
            targetId
        }

        try {
            const data = await this.poExchangeApiService.sendVouch(request)

            if ("error" in data) {
                if (data.error === "vouch_saved") {
                    await message.reply(formatVouchSaved(data.totalVouches))
                } else {
                    await message.reply(formatVouchError())
                }
                return
            }

            await message.react("✅")
            if (message.guildId) await this.vouchRoleService.checkAndAssignRoles(message.guildId, data)
        } catch (error) {
            loggingController.log("PoExchange", LogLevel.Error, `Message vouch request failed: ${error}`)
            await message.reply(translate("poex.vouch.failed"))
        }
    }

    private async handleVouchCount(message: Message, target: string): Promise<void> {
        const {loggingController} = useContext(ControllerContext)

        try {
            const mentionMatch = target.trim().match(DISCORD_MENTION_PATTERN)
            const request: VouchCountRequest = mentionMatch
                ? {discordId: mentionMatch[1]}
                : {username: target.trim()}

            loggingController.log("PoExchange", LogLevel.Debug, `Vouch count request: target="${target.trim()}" mentionMatch=${!!mentionMatch} request=${JSON.stringify(request)}`)

            const data = await this.poExchangeApiService.getVouchCount(request)

            loggingController.log("PoExchange", LogLevel.Debug, `Vouch count response: ${JSON.stringify(data)}`)

            if ("error" in data) {
                if (data.error === "no_user") {
                    await message.reply(formatCountError())
                } else {
                    await message.reply(translate("poex.vouch.countFailed"))
                }
                return
            }

            const discordId = data.discordId ?? mentionMatch?.[1]
            const client = this.discordService.getClient()
            const user = discordId ? await client.users.fetch(discordId).catch(() => undefined) : undefined
            const member = discordId ? message.guild?.members.cache.get(discordId) ?? await message.guild?.members.fetch(discordId).catch(() => null) : null
            await message.reply({embeds: [formatVouchCountEmbed(data, user, member)]})
            if (message.guildId) await this.vouchRoleService.checkAndAssignRoles(message.guildId, data)
        } catch (error) {
            loggingController.log("PoExchange", LogLevel.Error, `Vouch count request failed: ${error}`)
            await message.reply(translate("poex.vouch.countFailed"))
        }
    }
}

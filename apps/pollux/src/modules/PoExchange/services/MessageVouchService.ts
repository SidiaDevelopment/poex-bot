import {injectService, Service} from "@pollux/service"
import {DiscordEventService, DiscordService} from "@pollux/discord"
import {SettingsService} from "@pollux/settings"
import {Events, Message, TextChannel} from "discord.js"
import {ControllerContext, useContext} from "@pollux/core"
import {LogLevel} from "@pollux/logging"
import {translate} from "@pollux/i18n"
import {PoExchangeApiService} from "./PoExchangeApiService"
import {formatVouchCount, formatVouchError} from "../formatters/formatVouch"
import {VouchRequest} from "../types/VouchTypes"

const MENTION_PATTERN = /^<@!?(\d+)>\s+(.+)$/s
const VOUCH_COUNT_PATTERN = /^\?v\s+<@!?(\d+)>$/

export class MessageVouchService extends Service {
    @injectService
    private discordEventService!: DiscordEventService

    @injectService
    private discordService!: DiscordService

    @injectService
    private poExchangeApiService!: PoExchangeApiService

    @injectService
    private settingsService!: SettingsService

    public async init(): Promise<void> {
        DiscordService.onClientReady.addListener(async () => {
            this.discordEventService.subscribe(Events.MessageCreate, this.onMessage)
        })
    }

    private onMessage = async (message: Message): Promise<void> => {
        if (message.author.bot) return
        if (!message.guildId) return

        const vouchChannelId = this.settingsService.get("poex.vouchChannel", message.guildId)
        if (!vouchChannelId || message.channelId !== vouchChannelId) return

        const countMatch = message.content.match(VOUCH_COUNT_PATTERN)
        if (countMatch) {
            await this.handleVouchCount(message, countMatch[1])
            return
        }

        const match = message.content.match(MENTION_PATTERN)
        if (match) {
            await this.handleVouch(message)
            return
        }
    }

    private async handleVouch(message: Message): Promise<void> {
        const {loggingController} = useContext(ControllerContext)

        const request: VouchRequest = {
            type: "message",
            voucherId: message.author.id,
            channelId: message.channelId,
            channelName: (message.channel as TextChannel)?.name ?? "unknown",
            messageContent: message.content
        }

        try {
            const data = await this.poExchangeApiService.sendVouch(request)

            if ("error" in data) {
                await message.reply(formatVouchError(data.connectUrl))
                return
            }

            await message.react("✅")
        } catch (error) {
            loggingController.log("PoExchange", LogLevel.Error, `Message vouch request failed: ${error}`)
            await message.reply(translate("poex.vouch.failed"))
        }
    }

    private async handleVouchCount(message: Message, discordId: string): Promise<void> {
        const {loggingController} = useContext(ControllerContext)

        try {
            const data = await this.poExchangeApiService.getVouchCount({discordId})

            if ("error" in data) {
                await message.reply(formatVouchError(data.connectUrl))
                return
            }

            await message.reply(formatVouchCount(data))
        } catch (error) {
            loggingController.log("PoExchange", LogLevel.Error, `Vouch count request failed: ${error}`)
            await message.reply(translate("poex.vouch.failed"))
        }
    }
}

import {injectService, Service} from "@pollux/service"
import {DiscordEventService, DiscordService} from "@pollux/discord"
import {SettingsService} from "@pollux/settings"
import {PoExchangeSettingsKeys} from "../PoExchangeDeclaration"
import {ButtonInteraction, Events, Interaction, MessageFlags, TextChannel} from "discord.js"
import {ControllerContext, useContext} from "@pollux/core"
import {LogLevel} from "@pollux/logging"
import {translate} from "@pollux/i18n"
import {PoExchangeApiService} from "./PoExchangeApiService"
import {formatButtonVouchMessage, formatVouchError, formatVouchSaved} from "../formatters/formatVouch"
import {VouchRoleService} from "./VouchRoleService"
import {VouchRequest, VouchResponse} from "../types/VouchTypes"

export class VouchService extends Service {
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
            this.discordEventService.subscribe(Events.InteractionCreate, this.onInteraction)
        })
    }

    private onInteraction = async (interaction: Interaction): Promise<void> => {
        if (!interaction.isButton()) return
        if (interaction.customId !== "poex_vouch") return

        await this.handleVouch(interaction)
    }

    private async handleVouch(interaction: ButtonInteraction): Promise<void> {
        const {loggingController} = useContext(ControllerContext)

        await interaction.deferReply({flags: [MessageFlags.Ephemeral]})

        const request: VouchRequest = {
            type: "button",
            voucherId: interaction.user.id,
            voucherUsername: interaction.user.username,
            channelId: interaction.channelId,
            channelName: (interaction.channel as TextChannel)?.name ?? "unknown",
            messageId: interaction.message.id
        }

        try {
            const data = await this.poExchangeApiService.sendVouch(request)

            if ("error" in data) {
                if (data.error === "vouch_saved") {
                    await interaction.editReply({content: formatVouchSaved(data.totalVouches)})
                } else {
                    await interaction.editReply({content: formatVouchError()})
                }
                return
            }

            const mention = data.discordId ? `<@${data.discordId}>` : data.username
            await interaction.editReply({content: `${translate("poex.vouch.success")} **${data.username}** (${mention}) — ${data.uniqueVouches} ${translate("poex.vouch.uniqueVouches")} (${data.totalVouches} ${translate("poex.vouch.totalVouches")})`})

            await this.sendVouchChannelMessage(interaction, data)
            if (interaction.guildId) await this.vouchRoleService.checkAndAssignRoles(interaction.guildId, data)
        } catch (error) {
            loggingController.log("PoExchange", LogLevel.Error, `Vouch request failed: ${error}`)
            await interaction.editReply({content: translate("poex.vouch.failed")})
        }
    }

    private async sendVouchChannelMessage(interaction: ButtonInteraction, data: VouchResponse): Promise<void> {
        const guildId = interaction.guildId
        if (!guildId) return

        const vouchChannelId = this.settingsService.get(PoExchangeSettingsKeys.VouchChannel, guildId)
        if (!vouchChannelId) return

        const client = this.discordService.getClient()
        const channel = await client.channels.fetch(vouchChannelId)
        if (!channel || !(channel instanceof TextChannel)) return

        const messageUrl = interaction.message.url
        await channel.send(formatButtonVouchMessage(interaction.user.id, data, messageUrl))
    }
}

import {button, DiscordButton, IDiscordButton} from "@pollux/discord-command"
import {ButtonInteraction, MessageFlags, TextChannel} from "discord.js"
import {injectService} from "@pollux/service"
import {DiscordService} from "@pollux/discord"
import {SettingsService} from "@pollux/settings"
import {ControllerContext, useContext} from "@pollux/core"
import {LogLevel} from "@pollux/logging"
import {translate} from "@pollux/i18n"
import {PoExchangeSettingsKeys} from "../PoExchangeDeclaration"
import {PoExchangeApiService} from "../services/PoExchangeApiService"
import {VouchRoleService} from "../services/VouchRoleService"
import {formatButtonVouchMessage, formatVouchError, formatVouchSaved} from "../formatters/formatVouch"
import {VouchRequest, VouchResponse} from "../types/VouchTypes"

const buttonConfig: IDiscordButton = {
    customId: "poex_vouch"
}

@button(buttonConfig)
export class VouchButton extends DiscordButton {
    @injectService
    private discordService!: DiscordService

    @injectService
    private poExchangeApiService!: PoExchangeApiService

    @injectService
    private settingsService!: SettingsService

    @injectService
    private vouchRoleService!: VouchRoleService

    public async handle(interaction: ButtonInteraction): Promise<void> {
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

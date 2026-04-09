import {contextMenuCommand, DiscordContextMenuCommand, DiscordMessageService, IDiscordContextMenuCommand} from "@pollux/discord-command"
import {ApplicationCommandType, MessageFlags, TextChannel, UserContextMenuCommandInteraction} from "discord.js"
import {injectService} from "@pollux/service"
import {SettingsService} from "@pollux/settings"
import {DiscordService} from "@pollux/discord"
import {translate} from "@pollux/i18n"
import {PoExchangeSettingsKeys} from "../../PoExchangeDeclaration"
import {PoExchangeApiService} from "../../services/PoExchangeApiService"
import {VouchRoleService} from "../../services/VouchRoleService"
import {formatVouchCountEmbed, formatUserNotFoundError} from "../../formatters/formatVouch"

const commandConfig: IDiscordContextMenuCommand = {
    name: "Vouch Info",
    type: ApplicationCommandType.User
}

@contextMenuCommand(commandConfig)
export class VouchInfoContextMenu extends DiscordContextMenuCommand {
    @injectService
    private poExchangeApiService!: PoExchangeApiService

    @injectService
    private discordService!: DiscordService

    @injectService
    private settingsService!: SettingsService

    @injectService
    private vouchRoleService!: VouchRoleService

    @injectService
    private discordMessageService!: DiscordMessageService

    public handle = async (interaction: UserContextMenuCommandInteraction): Promise<void> => {
        await interaction.deferReply({flags: [MessageFlags.Ephemeral]})

        const target = interaction.targetUser

        try {
            const data = await this.poExchangeApiService.getVouchCount({discordId: target.id})

            if ("error" in data) {
                await interaction.editReply({content: formatUserNotFoundError()})
                return
            }

            const member = interaction.guild?.members.cache.get(target.id) ?? await interaction.guild?.members.fetch(target.id).catch(() => null)
            const embed = formatVouchCountEmbed(data, target, member)

            const guildId = interaction.guildId
            if (guildId) {
                const vouchChannelId = this.settingsService.get(PoExchangeSettingsKeys.VouchChannel, guildId)
                if (vouchChannelId) {
                    const channel = await this.discordService.getClient().channels.fetch(vouchChannelId)
                    if (channel instanceof TextChannel) {
                        await this.discordMessageService.respond(channel, {content: `<@${interaction.user.id}> ${translate("poex.vouch.infoRequested")}`, embeds: [embed]})
                    }
                }
            }

            await interaction.editReply({content: translate("poex.vouch.infoSent")})
            if (interaction.guildId) await this.vouchRoleService.checkAndAssignRoles(interaction.guildId, data)
        } catch {
            await interaction.editReply({content: translate("poex.vouch.failed")})
        }
    }
}

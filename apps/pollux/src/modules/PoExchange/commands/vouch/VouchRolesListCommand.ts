import {command, DiscordCommand, EmbedService, IDiscordCommand, IDiscordCommandData} from "@pollux/discord-command"
import {Colors, PermissionFlagsBits} from "discord.js"
import {injectService} from "@pollux/service"
import {translate} from "@pollux/i18n"
import {VouchRoleService} from "../../services/VouchRoleService"

const commandConfig: IDiscordCommand<IDiscordCommandData> = {
    command: "vouch",
    subCommandGroup: "roles",
    subCommand: "list",
    description: "poex.commands.vouch.roles.list.description",
    defaultMemberPermissions: PermissionFlagsBits.ManageGuild
}

@command(commandConfig)
export class VouchRolesListCommand extends DiscordCommand<IDiscordCommandData> {
    @injectService
    private vouchRoleService!: VouchRoleService

    @injectService
    private embedService!: EmbedService

    public handle = async ({interaction}: IDiscordCommandData): Promise<void> => {
        const roles = this.vouchRoleService.getRoles(interaction.guildId ?? "")

        const embed = this.embedService.getDefaultBuilder(Colors.Blue)
        embed.setTitle(translate("poex.commands.vouch.roles.list.reply.title", interaction.locale))

        if (roles.length === 0) {
            embed.setDescription(translate("poex.commands.vouch.roles.list.reply.empty", interaction.locale))
        } else {
            const lines = roles.map(r => `<@&${r.roleId}> — ${r.threshold} ${translate("poex.vouch.uniqueVouches", interaction.locale)}`)
            embed.setDescription(lines.join("\n"))
        }

        await interaction.reply({embeds: [embed]})
    }
}

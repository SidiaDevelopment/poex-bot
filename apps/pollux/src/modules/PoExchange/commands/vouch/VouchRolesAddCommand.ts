import {command, DiscordCommand, EmbedService, IDiscordCommand, IDiscordCommandData} from "@pollux/discord-command"
import {ApplicationCommandOptionType} from "discord-api-types/v10"
import {Colors, PermissionFlagsBits, Role} from "discord.js"
import {injectService} from "@pollux/service"
import {translate} from "@pollux/i18n"
import {VouchRoleService} from "../../services/VouchRoleService"

export interface IVouchRolesAddCommandData extends IDiscordCommandData {
    role: Role
    count: number
}

const commandConfig: IDiscordCommand<IVouchRolesAddCommandData> = {
    command: "vouch",
    subCommandGroup: "roles",
    subCommand: "add",
    description: "poex.commands.vouch.roles.add.description",
    defaultMemberPermissions: PermissionFlagsBits.ManageGuild,
    options: [
        {
            name: "role",
            type: ApplicationCommandOptionType.Role,
            description: "poex.commands.vouch.roles.add.roleOption",
            required: true
        },
        {
            name: "count",
            type: ApplicationCommandOptionType.Integer,
            description: "poex.commands.vouch.roles.add.countOption",
            required: true
        }
    ]
}

@command(commandConfig)
export class VouchRolesAddCommand extends DiscordCommand<IVouchRolesAddCommandData> {
    @injectService
    private vouchRoleService!: VouchRoleService

    @injectService
    private embedService!: EmbedService

    public handle = async ({interaction, role, count}: IVouchRolesAddCommandData): Promise<void> => {
        await this.vouchRoleService.addRole(interaction.guildId ?? "", role.id, count)

        const embed = this.embedService.getDefaultBuilder(Colors.Green)
        embed.setTitle(translate("poex.commands.vouch.roles.add.reply.title", interaction.locale))
        embed.setDescription(`${translate("poex.commands.vouch.roles.add.reply.success", interaction.locale)}: <@&${role.id}> → ${count} ${translate("poex.vouch.uniqueVouches", interaction.locale)}`)
        await interaction.reply({embeds: [embed]})
    }
}

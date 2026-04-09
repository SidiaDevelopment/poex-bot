import {command, DiscordCommand, DiscordMessageService, EmbedService, IDiscordCommand, IDiscordCommandData} from "@pollux/discord-command"
import {ApplicationCommandOptionType} from "discord-api-types/v10"
import {Colors, PermissionFlagsBits, Role} from "discord.js"
import {injectService} from "@pollux/service"
import {translate} from "@pollux/i18n"
import {VouchRoleService} from "../../services/VouchRoleService"

export interface IVouchRolesRemoveCommandData extends IDiscordCommandData {
    role: Role
}

const commandConfig: IDiscordCommand<IVouchRolesRemoveCommandData> = {
    command: "vouch",
    subCommandGroup: "roles",
    subCommand: "remove",
    description: "poex.commands.vouch.roles.remove.description",
    defaultMemberPermissions: PermissionFlagsBits.ManageGuild,
    options: [
        {
            name: "role",
            type: ApplicationCommandOptionType.Role,
            description: "poex.commands.vouch.roles.remove.roleOption",
            required: true
        }
    ]
}

@command(commandConfig)
export class VouchRolesRemoveCommand extends DiscordCommand<IVouchRolesRemoveCommandData> {
    @injectService
    private vouchRoleService!: VouchRoleService

    @injectService
    private embedService!: EmbedService

    @injectService
    private discordMessageService!: DiscordMessageService

    public handle = async ({interaction, role}: IVouchRolesRemoveCommandData): Promise<void> => {
        const removed = await this.vouchRoleService.removeRole(interaction.guildId ?? "", role.id)

        const embed = this.embedService.getDefaultBuilder(removed ? Colors.Green : Colors.Red)
        embed.setTitle(translate("poex.commands.vouch.roles.remove.reply.title", interaction.locale))
        embed.setDescription(translate(removed ? "poex.commands.vouch.roles.remove.reply.success" : "poex.commands.vouch.roles.remove.reply.notFound", interaction.locale))
        await this.discordMessageService.respond(interaction, {embeds: [embed]})
    }
}

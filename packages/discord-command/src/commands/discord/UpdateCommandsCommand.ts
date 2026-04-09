import {Colors, PermissionFlagsBits} from "discord.js"
import {translate} from "@pollux/i18n"
import {IDiscordCommandData} from "../../IDiscordCommandData"
import {command} from "../../decorators/command"
import {DiscordCommand} from "../../DiscordCommand"
import {IDiscordCommand} from "../../IDiscordCommandConfig"
import {injectService} from "@pollux/service"
import {DiscordUpdateCommandsService} from "../../services/DiscordUpdateCommandsService"
import {EmbedService} from "../../services/EmbedService"
import {DiscordMessageService} from "../../services/DiscordMessageService"

const commandConfig: IDiscordCommand<IDiscordCommandData> = {
    command: "commands",
    subCommand: "update",
    description: "discordCommands.commands.update.description",
    adminOnly: true,
    defaultMemberPermissions: PermissionFlagsBits.ManageGuild
}

@command(commandConfig)
export class UpdateCommandsCommand extends DiscordCommand<IDiscordCommandData> {
    @injectService
    private discordUpdateCommandsService!: DiscordUpdateCommandsService

    @injectService
    private embedService!: EmbedService

    @injectService
    private discordMessageService!: DiscordMessageService

    public handle = async ({interaction}: IDiscordCommandData): Promise<void> => {
        const embed = this.embedService.getDefaultBuilder(Colors.Green)
        embed.setTitle(translate("discordCommands.commands.update.reply.title", interaction.locale))
        embed.setDescription(translate("discordCommands.commands.update.reply.contentUpdating", interaction.locale))
        const reply = await this.discordMessageService.respond(interaction, {embeds: [embed]})
        embed.setDescription(translate("discordCommands.commands.update.reply.content", interaction.locale))

        await this.discordUpdateCommandsService.updateCommands()
        await this.discordMessageService.edit(reply, {embeds: [embed]})
    }
}

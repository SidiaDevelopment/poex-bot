import {Colors, PermissionFlagsBits} from "discord.js"
import {translate} from "@pollux/i18n"
import {ApplicationCommandOptionType} from "discord-api-types/v10"
import {IDiscordCommandData} from "../../IDiscordCommandData"
import {command} from "../../decorators/command"
import {DiscordCommand} from "../../DiscordCommand"
import {IDiscordCommand} from "../../IDiscordCommandConfig"
import {injectService} from "@pollux/service"
import {DiscordUpdateCommandsService} from "../../services/DiscordUpdateCommandsService"
import {EmbedService} from "../../services/EmbedService"

export interface ICommandData extends IDiscordCommandData {
    text: string
}

const commandConfig: IDiscordCommand<ICommandData> = {
    command: "commands",
    subCommand: "update",
    description: "discordCommands.commands.update.description",
    adminOnly: true,
    defaultMemberPermissions: PermissionFlagsBits.ManageGuild,
    options: [
        {
            name: "text",
            type: ApplicationCommandOptionType.String,
            description: "discordCommands.commands.update.description"
        }
    ]
}

@command(commandConfig)
export class UpdateCommandsCommand extends DiscordCommand<ICommandData> {
    @injectService
    private discordUpdateCommandsService!: DiscordUpdateCommandsService

    @injectService
    private embedService!: EmbedService

    public handle = async ({interaction}: ICommandData): Promise<void> => {
        const embed = this.embedService.getDefaultBuilder(Colors.Green)
        embed.setTitle(translate("discordCommands.commands.update.reply.title", interaction.locale))
        embed.setDescription(translate("discordCommands.commands.update.reply.contentUpdating", interaction.locale))
        const response = await interaction.reply({embeds: [embed], withResponse: true})
        const reply = response.resource!.message!
        embed.setDescription(translate("discordCommands.commands.update.reply.content", interaction.locale))

        await this.discordUpdateCommandsService.updateCommands()
        await reply.edit({embeds: [embed]})
    }
}

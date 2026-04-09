import {command, DiscordCommand, DiscordMessageService, EmbedService, IDiscordCommand, IDiscordCommandData} from "@pollux/discord-command"
import {ApplicationCommandOptionType} from "discord-api-types/v10"
import {Colors, PermissionFlagsBits} from "discord.js"
import {injectService} from "@pollux/service"
import {translate} from "@pollux/i18n"
import {PoExchangeService} from "../../services/PoExchangeService"
import {PoExchangeCategories} from "../../PoExchangeCategories"

export interface IRemoveCommandData extends IDiscordCommandData {
    mapping: string
}

const commandConfig: IDiscordCommand<IRemoveCommandData> = {
    command: "poex",
    subCommandGroup: "channel",
    subCommand: "remove",
    description: "poex.commands.remove.description",
    defaultMemberPermissions: PermissionFlagsBits.ManageGuild,
    options: [
        {
            name: "mapping",
            type: ApplicationCommandOptionType.String,
            description: "poex.commands.remove.mappingOption",
            required: true,
            choices: PoExchangeCategories
        }
    ]
}

@command(commandConfig)
export class RemoveCommand extends DiscordCommand<IRemoveCommandData> {
    @injectService
    private poExchangeService!: PoExchangeService

    @injectService
    private embedService!: EmbedService

    @injectService
    private discordMessageService!: DiscordMessageService

    public handle = async ({interaction, mapping}: IRemoveCommandData): Promise<void> => {
        const success = await this.poExchangeService.removeChannel(mapping, interaction.guildId ?? "")

        if (!success) {
            const embed = this.embedService.getDefaultBuilder(Colors.Red)
            embed.setTitle(translate("poex.commands.remove.reply.title", interaction.locale))
            embed.setDescription(translate("poex.commands.remove.reply.notFound", interaction.locale))
            await this.discordMessageService.respond(interaction, {embeds: [embed]})
            return
        }

        const embed = this.embedService.getDefaultBuilder(Colors.Green)
        embed.setTitle(translate("poex.commands.remove.reply.title", interaction.locale))
        embed.setDescription(`${translate("poex.commands.remove.reply.success", interaction.locale)}: \`${mapping}\``)
        await this.discordMessageService.respond(interaction, {embeds: [embed]})
    }
}

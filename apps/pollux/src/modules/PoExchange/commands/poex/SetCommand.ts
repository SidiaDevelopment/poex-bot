import {command, DiscordCommand, DiscordMessageService, EmbedService, IDiscordCommand, IDiscordCommandData} from "@pollux/discord-command"
import {ApplicationCommandOptionType} from "discord-api-types/v10"
import {Colors, GuildBasedChannel, PermissionFlagsBits} from "discord.js"
import {injectService} from "@pollux/service"
import {translate} from "@pollux/i18n"
import {PoExchangeService} from "../../services/PoExchangeService"
import {PoExchangeCategories} from "../../PoExchangeCategories"

export interface ISetCommandData extends IDiscordCommandData {
    mapping: string
    target: GuildBasedChannel
}

const commandConfig: IDiscordCommand<ISetCommandData> = {
    command: "poex",
    subCommandGroup: "channel",
    subCommand: "set",
    description: "poex.commands.set.description",
    defaultMemberPermissions: PermissionFlagsBits.ManageGuild,
    options: [
        {
            name: "mapping",
            type: ApplicationCommandOptionType.String,
            description: "poex.commands.set.mappingOption",
            required: true,
            choices: PoExchangeCategories
        },
        {
            name: "target",
            type: ApplicationCommandOptionType.Channel,
            description: "poex.commands.set.channelOption",
            required: true
        }
    ]
}

@command(commandConfig)
export class SetCommand extends DiscordCommand<ISetCommandData> {
    @injectService
    private poExchangeService!: PoExchangeService

    @injectService
    private embedService!: EmbedService

    @injectService
    private discordMessageService!: DiscordMessageService

    public handle = async ({interaction, mapping, target}: ISetCommandData): Promise<void> => {
        await this.poExchangeService.setChannel(mapping, interaction.guildId ?? "", target.id)

        const embed = this.embedService.getDefaultBuilder(Colors.Green)
        embed.setTitle(translate("poex.commands.set.reply.title", interaction.locale))
        embed.setDescription(`${translate("poex.commands.set.reply.success", interaction.locale)}: \`${mapping}\` → <#${target.id}>`)
        await this.discordMessageService.respond(interaction, {embeds: [embed]})
    }
}

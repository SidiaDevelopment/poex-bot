import {command, DiscordCommand, EmbedService, IDiscordCommand, IDiscordCommandData} from "@pollux/discord-command"
import {ApplicationCommandOptionType} from "discord-api-types/v10"
import {Colors, PermissionFlagsBits} from "discord.js"
import {injectService} from "@pollux/service"
import {translate} from "@pollux/i18n"
import {PoExchangeService} from "../../services/PoExchangeService"
import {PoExchangeChannelId} from "../../PoExchangeDeclaration"

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
            choices: [
                {name: "Boss Killing", value: PoExchangeChannelId.POE1_BOSS_KILLING},
                {name: "Nightmare Maps", value: PoExchangeChannelId.POE1_NIGHTMARE_MAPS},
                {name: "Invitations", value: PoExchangeChannelId.POE1_INVITATIONS},
                {name: "Bloodlines", value: PoExchangeChannelId.POE1_BLOODLINES},
                {name: "Labyrinth", value: PoExchangeChannelId.POE1_LABYRINTH},
                {name: "5-Way", value: PoExchangeChannelId.POE1_5_WAY},
                {name: "Campaign Skip", value: PoExchangeChannelId.POE1_CAMPAIGN_SKIP},
                {name: "Gold Rotation", value: PoExchangeChannelId.POE1_GOLD_ROTATION},
                {name: "Temple Host", value: PoExchangeChannelId.POE1_TEMPLE_HOST},
                {name: "Challenge Completion", value: PoExchangeChannelId.POE1_CHALLENGE_COMPLETION},
                {name: "Bench Craft", value: PoExchangeChannelId.POE1_BENCH_CRAFT},
                {name: "Std Boss Killing", value: PoExchangeChannelId.POE1_STANDARD_BOSS_KILLING},
                {name: "Std Nightmare Maps", value: PoExchangeChannelId.POE1_STANDARD_NIGHTMARE_MAPS},
                {name: "Std Invitations", value: PoExchangeChannelId.POE1_STANDARD_INVITATIONS},
                {name: "Std Bloodlines", value: PoExchangeChannelId.POE1_STANDARD_BLOODLINES},
                {name: "Std Labyrinth", value: PoExchangeChannelId.POE1_STANDARD_LABYRINTH},
                {name: "Std 5-Way", value: PoExchangeChannelId.POE1_STANDARD_5_WAY},
                {name: "Std Campaign Skip", value: PoExchangeChannelId.POE1_STANDARD_CAMPAIGN_SKIP},
                {name: "Std Gold Rotation", value: PoExchangeChannelId.POE1_STANDARD_GOLD_ROTATION},
                {name: "Std Temple Host", value: PoExchangeChannelId.POE1_STANDARD_TEMPLE_HOST},
                {name: "Std Challenge Completion", value: PoExchangeChannelId.POE1_STANDARD_CHALLENGE_COMPLETION},
                {name: "Std Bench Craft", value: PoExchangeChannelId.POE1_STANDARD_BENCH_CRAFT}
            ]
        }
    ]
}

@command(commandConfig)
export class RemoveCommand extends DiscordCommand<IRemoveCommandData> {
    @injectService
    private poExchangeService!: PoExchangeService

    @injectService
    private embedService!: EmbedService

    public handle = async ({interaction, mapping}: IRemoveCommandData): Promise<void> => {
        const success = await this.poExchangeService.removeChannel(mapping, interaction.guildId ?? "")

        if (!success) {
            const embed = this.embedService.getDefaultBuilder(Colors.Red)
            embed.setTitle(translate("poex.commands.remove.reply.title", interaction.locale))
            embed.setDescription(translate("poex.commands.remove.reply.notFound", interaction.locale))
            await interaction.reply({embeds: [embed]})
            return
        }

        const embed = this.embedService.getDefaultBuilder(Colors.Green)
        embed.setTitle(translate("poex.commands.remove.reply.title", interaction.locale))
        embed.setDescription(`${translate("poex.commands.remove.reply.success", interaction.locale)}: \`${mapping}\``)
        await interaction.reply({embeds: [embed]})
    }
}

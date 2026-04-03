import {command, DiscordCommand, EmbedService, IDiscordCommand, IDiscordCommandData} from "@pollux/discord-command"
import {ApplicationCommandOptionType} from "discord-api-types/v10"
import {Colors, PermissionFlagsBits} from "discord.js"
import {injectService} from "@pollux/service"
import {translate} from "@pollux/i18n"
import {ControllerContext, useContext} from "@pollux/core"
import {SettingsService} from "../../services/SettingsService"
import {SettingsAutocompleteService} from "../../services/SettingsAutocompleteService"
import {SettingsKeys} from "../../SettingsDeclaration"

const keyAutocomplete = async (value: string) => {
    const {serviceController} = useContext(ControllerContext)
    return serviceController.get<SettingsAutocompleteService>(SettingsAutocompleteService)?.keyAutocomplete(value) ?? []
}

export interface IGetCommandData extends IDiscordCommandData {
    key: string
}

const commandConfig: IDiscordCommand<IGetCommandData> = {
    command: "settings",
    subCommand: "get",
    description: "settings.commands.get.description",
    defaultMemberPermissions: PermissionFlagsBits.ManageGuild,
    options: [
        {
            name: "key",
            type: ApplicationCommandOptionType.String,
            description: "settings.commands.get.keyOption",
            required: true,
            autocompleteCallback: keyAutocomplete
        }
    ]
}

@command(commandConfig)
export class GetCommand extends DiscordCommand<IGetCommandData> {
    @injectService
    private settingsService!: SettingsService

    @injectService
    private embedService!: EmbedService

    public handle = async ({interaction, key}: IGetCommandData): Promise<void> => {
        const {settingsController} = useContext(ControllerContext)

        if (!settingsController.isKnown(key)) {
            const embed = this.embedService.getDefaultBuilder(Colors.Red)
            embed.setTitle(translate("settings.commands.get.reply.title", interaction.locale))
            embed.setDescription(`${translate("settings.commands.get.reply.unknownKey", interaction.locale)}: \`${key}\``)
            await interaction.reply({embeds: [embed]})
            return
        }

        const entry = settingsController.getEntry(key)!

        if (entry.hidden) {
            const adminServer = this.settingsService.get(SettingsKeys.AdminServer, "")
            const adminUser = this.settingsService.get(SettingsKeys.AdminUser, "")
            if (interaction.guildId !== adminServer && interaction.user.id !== adminUser) {
                const embed = this.embedService.getDefaultBuilder(Colors.Red)
                embed.setTitle(translate("settings.commands.get.reply.title", interaction.locale))
                embed.setDescription(translate("settings.commands.get.reply.unauthorized", interaction.locale))
                await interaction.reply({embeds: [embed]})
                return
            }
        }

        const value = this.settingsService.get(key, interaction.guildId ?? "")

        const embed = this.embedService.getDefaultBuilder(Colors.Blue)
        embed.setTitle(translate("settings.commands.get.reply.title", interaction.locale))
        embed.addFields(
            {name: "Key", value: `\`${key}\``, inline: true},
            {name: "Value", value: `\`${value}\``, inline: true},
            {name: "Default", value: `\`${entry.defaultValue}\``, inline: true}
        )
        await interaction.reply({embeds: [embed]})
    }
}

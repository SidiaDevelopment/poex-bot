import {command, DiscordCommand, DiscordMessageService, EmbedService, IDiscordCommand, IDiscordCommandData} from "@pollux/discord-command"
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

export interface ISetCommandData extends IDiscordCommandData {
    key: string
    value: string
}

const commandConfig: IDiscordCommand<ISetCommandData> = {
    command: "settings",
    subCommand: "set",
    description: "settings.commands.set.description",
    defaultMemberPermissions: PermissionFlagsBits.ManageGuild,
    options: [
        {
            name: "key",
            type: ApplicationCommandOptionType.String,
            description: "settings.commands.set.keyOption",
            required: true,
            autocompleteCallback: keyAutocomplete
        },
        {
            name: "value",
            type: ApplicationCommandOptionType.String,
            description: "settings.commands.set.valueOption",
            required: true
        }
    ]
}

@command(commandConfig)
export class SetCommand extends DiscordCommand<ISetCommandData> {
    @injectService
    private settingsService!: SettingsService

    @injectService
    private embedService!: EmbedService

    @injectService
    private discordMessageService!: DiscordMessageService

    public handle = async ({interaction, key, value}: ISetCommandData): Promise<void> => {
        const {settingsController} = useContext(ControllerContext)

        if (!settingsController.isKnown(key)) {
            const embed = this.embedService.getDefaultBuilder(Colors.Red)
            embed.setTitle(translate("settings.commands.set.reply.title", interaction.locale))
            embed.setDescription(`${translate("settings.commands.set.reply.unknownKey", interaction.locale)}: \`${key}\``)
            await this.discordMessageService.respond(interaction, {embeds: [embed]})
            return
        }

        const entry = settingsController.getEntry(key)!
        if (entry.global) {
            const adminServer = this.settingsService.get(SettingsKeys.AdminServer, "")
            const adminUser = this.settingsService.get(SettingsKeys.AdminUser, "")
            if (interaction.guildId !== adminServer && interaction.user.id !== adminUser) {
                const embed = this.embedService.getDefaultBuilder(Colors.Red)
                embed.setTitle(translate("settings.commands.set.reply.title", interaction.locale))
                embed.setDescription(translate("settings.commands.set.reply.unauthorized", interaction.locale))
                await this.discordMessageService.respond(interaction, {embeds: [embed]})
                return
            }
        }

        await this.settingsService.set(key, value, interaction.guildId ?? "")

        const embed = this.embedService.getDefaultBuilder(Colors.Green)
        embed.setTitle(translate("settings.commands.set.reply.title", interaction.locale))
        embed.setDescription(`\`${key}\` → \`${value}\``)
        await this.discordMessageService.respond(interaction, {embeds: [embed]})
    }
}

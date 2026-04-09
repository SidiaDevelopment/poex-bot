import {command, DiscordCommand, DiscordMessageService, EmbedService, IDiscordCommand, IDiscordCommandData} from "@pollux/discord-command"
import {ApplicationCommandOptionType} from "discord-api-types/v10"
import {Colors, PermissionFlagsBits} from "discord.js"
import {injectService} from "@pollux/service"
import {translate} from "@pollux/i18n"
import {ControllerContext, useContext} from "@pollux/core"
import {SettingsService} from "../../services/SettingsService"

const moduleChoices = async () => {
    const {settingsController} = useContext(ControllerContext)
    const moduleNames = [...new Set(Object.values(settingsController.getAll()).map(e => e.moduleName))]
    return moduleNames.map(name => ({name, value: name}))
}

export interface IListCommandData extends IDiscordCommandData {
    module: string
}

const commandConfig: IDiscordCommand<IListCommandData> = {
    command: "settings",
    subCommand: "list",
    description: "settings.commands.list.description",
    defaultMemberPermissions: PermissionFlagsBits.ManageGuild,
    options: [
        {
            name: "module",
            type: ApplicationCommandOptionType.String,
            description: "settings.commands.list.moduleOption",
            required: true,
            choicesCallback: moduleChoices
        }
    ]
}

@command(commandConfig)
export class ListCommand extends DiscordCommand<IListCommandData> {
    @injectService
    private settingsService!: SettingsService

    @injectService
    private embedService!: EmbedService

    @injectService
    private discordMessageService!: DiscordMessageService

    public handle = async ({interaction, module}: IListCommandData): Promise<void> => {
        const {settingsController} = useContext(ControllerContext)

        const entries = settingsController.getAllByModule(module)

        if (Object.keys(entries).length === 0) {
            const embed = this.embedService.getDefaultBuilder(Colors.Red)
            embed.setTitle(`${translate("settings.commands.list.reply.title", interaction.locale)}: ${module}`)
            embed.setDescription(translate("settings.commands.list.reply.noSettings", interaction.locale))
            await this.discordMessageService.respond(interaction, {embeds: [embed]})
            return
        }

        const embed = this.embedService.getDefaultBuilder(Colors.Blue)
        embed.setTitle(`${translate("settings.commands.list.reply.title", interaction.locale)}: ${module}`)

        const defaultLabel = translate("settings.commands.list.reply.default", interaction.locale)

        for (const [key, entry] of Object.entries(entries)) {
            const value = this.settingsService.get(key, interaction.guildId ?? "")!
            const isDefault = value === entry.defaultValue
            embed.addFields({
                name: key,
                value: `\`${value}\`${isDefault ? ` *(${defaultLabel})*` : ""}`,
                inline: false
            })
        }

        await this.discordMessageService.respond(interaction, {embeds: [embed]})
    }
}

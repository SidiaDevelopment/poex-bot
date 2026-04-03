import {IDiscordCommandData} from "./IDiscordCommandData"
import {APIApplicationCommandOptionChoice, ApplicationCommandOptionType} from "discord.js"
import {LocalizationTag} from "@pollux/i18n"

export interface IDiscordCommandOption<T extends IDiscordCommandData> {
    name: keyof Omit<T, keyof IDiscordCommandData>
    type: Exclude<ApplicationCommandOptionType, ApplicationCommandOptionType.Subcommand | ApplicationCommandOptionType.SubcommandGroup>
    description: LocalizationTag
    autocomplete?: string
    autocompleteCallback?: (value: string) => Promise<APIApplicationCommandOptionChoice[]>
    required?: true
    catchall?: true
    choices?: APIApplicationCommandOptionChoice[]
    choicesCallback?: () => Promise<APIApplicationCommandOptionChoice[]>
}

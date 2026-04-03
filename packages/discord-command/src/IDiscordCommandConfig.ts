import {IDiscordCommandData} from "./IDiscordCommandData"
import {IDiscordCommandOption} from "./IDiscordCommandOption"
import {LocalizationTag} from "@pollux/i18n"

export interface IDiscordCommand<T extends IDiscordCommandData> {
    command: string
    subCommand?: string
    subCommandGroup?: string
    description: LocalizationTag
    options?: IDiscordCommandOption<T>[]
    defaultMemberPermissions?: bigint
    adminOnly?: boolean
}

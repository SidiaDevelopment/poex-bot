import {DiscordCommand} from "./DiscordCommand"
import {IDiscordCommandData} from "./IDiscordCommandData"

export interface IDiscordCommandControllerData {
    command: string
    subCommandGroup: string | null
    subCommand: string | null
    instance: DiscordCommand<IDiscordCommandData>
}

import {Config, defaultConfig} from "@pollux/config"
import {IDiscordCommandModuleConfig} from "./IDiscordCommandConfig"
import {PartialRecursive} from "@pollux/utils"

@defaultConfig
export class DiscordCommandConfig extends Config<IDiscordCommandModuleConfig> {
    data: PartialRecursive<IDiscordCommandModuleConfig> = {
        discordCommands: {
            updateCommandsOnStart: true
        }
    }
}

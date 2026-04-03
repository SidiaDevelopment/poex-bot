import { IModule } from "@pollux/core/types"
import {PingLocalizations} from "./PingDeclaration"
import {IModuleDiscordConfig} from "@pollux/discord-command"
import {PingCommand} from "./commands/PingCommand"

export class PingModule implements IModule {
    public name = "Ping"
    public localizations = PingLocalizations
    public discord: IModuleDiscordConfig = {
        tag: "ping",
        discordCommands: [PingCommand]
    }
}

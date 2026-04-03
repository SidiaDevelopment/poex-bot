import {IModule} from "@pollux/core/types"
import {IModuleDiscordConfig} from "@pollux/discord-command"
import {IModuleApiConfig} from "@pollux/api"
import {PoExchangeLocalizations} from "./PoExchangeDeclaration"
import {PoExchangeService} from "./services/PoExchangeService"
import {SetCommand} from "./commands/poex/SetCommand"
import {RemoveCommand} from "./commands/poex/RemoveCommand"
import {PoExchangePostRoute} from "./routes/PoExchangePostRoute"

export class PoExchangeModule implements IModule {
    public name = "PoExchange"
    public services = [PoExchangeService]
    public localizations = PoExchangeLocalizations
    public discord: IModuleDiscordConfig = {
        tag: "PoExchange",
        discordCommands: [SetCommand, RemoveCommand]
    }
    public api: IModuleApiConfig = {
        tag: "PoExchange",
        apiRoutes: [PoExchangePostRoute]
    }
}

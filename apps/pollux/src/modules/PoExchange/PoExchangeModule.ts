import {IModule} from "@pollux/core/types"
import {IModuleDiscordConfig} from "@pollux/discord-command"
import {IModuleApiConfig} from "@pollux/api"
import {IModuleSetting} from "@pollux/settings"
import {PoExchangeLocalizations} from "./PoExchangeDeclaration"
import {PoExchangeService} from "./services/PoExchangeService"
import {PoExchangeApiService} from "./services/PoExchangeApiService"
import {VouchService} from "./services/VouchService"
import {MessageVouchService} from "./services/MessageVouchService"
import {SetCommand} from "./commands/poex/SetCommand"
import {RemoveCommand} from "./commands/poex/RemoveCommand"
import {VouchCommand} from "./commands/vouch/VouchCommand"
import {VouchCountCommand} from "./commands/vouch/VouchCountCommand"
import {PoExchangePostRoute} from "./routes/PoExchangePostRoute"

export class PoExchangeModule implements IModule {
    public name = "PoExchange"
    public services = [PoExchangeService, PoExchangeApiService, VouchService, MessageVouchService]
    public localizations = PoExchangeLocalizations
    public discord: IModuleDiscordConfig = {
        tag: "PoExchange",
        discordCommands: [SetCommand, RemoveCommand, VouchCommand, VouchCountCommand]
    }
    public api: IModuleApiConfig = {
        tag: "PoExchange",
        apiRoutes: [PoExchangePostRoute]
    }
    public settings: IModuleSetting[] = [
        {
            key: "poex.vouchEnabled",
            defaultValue: "false",
            description: "poex.settings.vouchEnabled"
        },
        {
            key: "poex.vouchChannel",
            defaultValue: "",
            description: "poex.settings.vouchChannel"
        }
    ]
}

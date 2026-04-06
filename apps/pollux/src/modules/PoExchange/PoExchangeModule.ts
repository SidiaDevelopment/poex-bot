import {IModule} from "@pollux/core/types"
import {IModuleDiscordConfig} from "@pollux/discord-command"
import {IModuleApiConfig} from "@pollux/api"
import {IModuleSetting} from "@pollux/settings"
import {IManagementPage, ManagementEntityHandler} from "@pollux/management"
import {Ctor} from "@pollux/utils"
import {PoExchangeLocalizations, PoExchangeChannelId} from "./PoExchangeDeclaration"
import {PoExchangeCategories} from "./PoExchangeCategories"
import {PoExchangeService} from "./services/PoExchangeService"
import {PoExchangeApiService} from "./services/PoExchangeApiService"
import {VouchService} from "./services/VouchService"
import {MessageVouchService} from "./services/MessageVouchService"
import {SetCommand} from "./commands/poex/SetCommand"
import {RemoveCommand} from "./commands/poex/RemoveCommand"
import {VouchCommand} from "./commands/vouch/VouchCommand"
import {VouchCountCommand} from "./commands/vouch/VouchCountCommand"
import {VouchRolesAddCommand} from "./commands/vouch/VouchRolesAddCommand"
import {VouchRolesRemoveCommand} from "./commands/vouch/VouchRolesRemoveCommand"
import {VouchRolesListCommand} from "./commands/vouch/VouchRolesListCommand"
import {VouchInfoContextMenu} from "./commands/vouch/VouchInfoContextMenu"
import {VouchRoleService} from "./services/VouchRoleService"
import {PoExchangePostRoute} from "./routes/PoExchangePostRoute"
import {PoExchangeVouchRoute} from "./routes/PoExchangeVouchRoute"
import {PoExchangeChannelEntityHandler} from "./management/PoExchangeChannelEntityHandler"
import {VouchRoleEntityHandler} from "./management/VouchRoleEntityHandler"

export class PoExchangeModule implements IModule {
    public name = "PoExchange"
    public services = [PoExchangeService, PoExchangeApiService, VouchService, MessageVouchService, VouchRoleService]
    public localizations = PoExchangeLocalizations
    public discord: IModuleDiscordConfig = {
        tag: "PoExchange",
        discordCommands: [SetCommand, RemoveCommand, VouchCommand, VouchCountCommand, VouchRolesAddCommand, VouchRolesRemoveCommand, VouchRolesListCommand],
        discordContextMenuCommands: [VouchInfoContextMenu]
    }
    public api: IModuleApiConfig = {
        tag: "PoExchange",
        apiRoutes: [PoExchangePostRoute, PoExchangeVouchRoute]
    }
    public management: IManagementPage = {
        tables: [{
            title: "poex.management.channelMappings",
            entity: "poex-channels",
            columns: [
                {key: "channelKey", type: "string", label: "poex.management.channelKey", choices: PoExchangeCategories, unique: true},
                {key: "discordChannelId", type: "channel", label: "poex.management.channel"}
            ]
        }, {
            title: "poex.management.vouchRoles",
            entity: "vouch-roles",
            columns: [
                {key: "roleId", type: "role", label: "poex.management.role", unique: true},
                {key: "threshold", type: "number", label: "poex.management.threshold"}
            ]
        }]
    }
    public managementEntities: Ctor<ManagementEntityHandler>[] = [PoExchangeChannelEntityHandler, VouchRoleEntityHandler]
    public settings: IModuleSetting[] = [
        {
            key: "poex.vouchEnabled",
            defaultValue: "false",
            description: "poex.settings.vouchEnabled"
        },
        {
            key: "poex.vouchChannel",
            defaultValue: "",
            description: "poex.settings.vouchChannel",
            type: "channel"
        }
    ]
}

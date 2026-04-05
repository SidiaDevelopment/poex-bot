import {IModule} from "@pollux/core/types"
import {IModuleApiConfig} from "@pollux/api"
import {ManagementAuthService} from "./services/ManagementAuthService"
import {ModulesRoute} from "./routes/ModulesRoute"
import {GuildsRoute} from "./routes/GuildsRoute"
import {GuildSettingsGetRoute, GuildSettingsPostRoute} from "./routes/GuildSettingsRoute"
import {GuildEntitiesGetRoute, GuildEntitiesPostRoute, GuildEntitiesDeleteRoute} from "./routes/GuildEntitiesRoute"
import {GlobalSettingsGetRoute, GlobalSettingsPostRoute} from "./routes/GlobalSettingsRoute"
import {GuildDiscordDataRoute} from "./routes/GuildDiscordDataRoute"

export class ManagementModule implements IModule {
    public name = "Management"
    public services = [ManagementAuthService]
    public api: IModuleApiConfig = {
        tag: "Management",
        apiRoutes: [
            ModulesRoute,
            GuildsRoute,
            GuildSettingsGetRoute,
            GuildSettingsPostRoute,
            GuildEntitiesGetRoute,
            GuildEntitiesPostRoute,
            GuildEntitiesDeleteRoute,
            GlobalSettingsGetRoute,
            GlobalSettingsPostRoute,
            GuildDiscordDataRoute
        ]
    }
}

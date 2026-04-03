import { IModule } from "@pollux/core/types"
import {DiscordService} from "./services/DiscordService"
import {DiscordEventService} from "./services/DiscordEventService"
import {DiscordGuildService} from "./services/DiscordGuildService"

export class DiscordModule implements IModule {
    public name = "discord"
    public services = [
        DiscordService,
        DiscordEventService,
        DiscordGuildService
    ]
}

import "@pollux/core"
import "@pollux/logging"
import "@pollux/config"
import "@pollux/discord-command"
import "@pollux/settings"
import "@pollux/api"
import {Core} from "@pollux/core"
import {DiscordModule} from "@pollux/discord"
import {DiscordCommandModule} from "@pollux/discord-command"
import {DatabaseModule} from "@pollux/database"
import {SettingsModule} from "@pollux/settings"
import {ApiModule} from "@pollux/api"

import {PingModule} from "./modules/Ping/PingModule"
import {HealthModule} from "./modules/Health/HealthModule"
import {PoExchangeModule} from "./modules/PoExchange/PoExchangeModule"
import {ManagementModule} from "./modules/Management/ManagementModule"
import {config} from "./config"

const core = new Core()
core.setup({
    modules: [
        DatabaseModule,
        PingModule,
        HealthModule,
        PoExchangeModule,
        ManagementModule,
        DiscordModule,
        DiscordCommandModule,
        SettingsModule,
        ApiModule,
    ],
    config: config
})
core.start()

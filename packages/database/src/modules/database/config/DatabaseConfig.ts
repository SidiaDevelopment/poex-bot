import {Config, defaultConfig} from "@pollux/config"
import {IDatabaseModuleConfig} from "./IDatabaseConfig"
import {PartialRecursive} from "@pollux/utils"

@defaultConfig
export class DatabaseConfig extends Config<IDatabaseModuleConfig> {
    data: PartialRecursive<IDatabaseModuleConfig> = {
        database: {
            type: "sqlite",
            database: "./data/dev.sq3",
            synchronize: true
        }
    }
}

import {Config, defaultConfig} from "@pollux/config"
import {ILoggingConfig} from "./ILoggingConfig"
import {PartialRecursive} from "@pollux/utils"
import {LogLevel} from "../LogLevel"
import {ConsoleLogStrategy} from "../logStrategies/ConsoleLogStrategy"

@defaultConfig
export class LoggingConfig extends Config<ILoggingConfig> {
    data: PartialRecursive<ILoggingConfig> = {
        logging: {
            logLevel: LogLevel.Development,
            logStrategies: [ConsoleLogStrategy]
        }
    }
}

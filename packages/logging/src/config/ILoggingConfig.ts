import {LogLevel} from "../LogLevel"
import {ILogStrategy} from "../logStrategies/ILogStrategy"
import {Ctor} from "@pollux/utils"

export interface ILoggingConfig {
    logging: {
        logLevel?: LogLevel,
        logStrategies?: Ctor<ILogStrategy>[],
    }
}

declare module "@pollux/core/types" {
     
    export interface IConfig extends ILoggingConfig {}
}

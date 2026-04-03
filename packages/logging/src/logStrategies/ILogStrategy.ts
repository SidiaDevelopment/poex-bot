import {LogLevel} from "../LogLevel"

export interface ILogStrategy {
    init(): Promise<void>
    log(module: string, logLevel: LogLevel, ...messages: unknown[]): Promise<void>
    filter(logLevel: LogLevel): Promise<boolean>
}

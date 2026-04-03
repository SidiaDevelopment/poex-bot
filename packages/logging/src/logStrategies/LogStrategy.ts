import {LogLevel} from "../LogLevel"
import {ILogStrategy} from "./ILogStrategy"

export abstract class LogStrategy implements ILogStrategy {
    public abstract init(): Promise<void>
    public abstract filter(logLevel: LogLevel): Promise<boolean>
    public abstract log(module: string, logLevel: LogLevel, ...messages: unknown[]): Promise<void>
}

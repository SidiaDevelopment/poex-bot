import {LogStrategy} from "./LogStrategy"
import {LogLevel} from "../LogLevel"
import moment from "moment"
import chalk from "chalk"
import {useContext} from "@pollux/core"
import {ConfigContext} from "@pollux/config"

export class ConsoleLogStrategy extends LogStrategy {
    private logLevel: LogLevel = LogLevel.NeverLog
    private projectName: string = ""

    public init = async (): Promise<void> => {
        const {name, logging: {logLevel}} = useContext(ConfigContext)

        this.logLevel = logLevel!
        this.projectName = name

        this.log("@pollux/logging", LogLevel.Debug, `Started ${name}`)
    }

    public filter = async (logLevel: LogLevel): Promise<boolean> => {
        return logLevel >= this.logLevel
    }

    public log = async (module: string, logLevel: LogLevel, ...messages: unknown[]): Promise<void> => {
        if (!(await this.filter(logLevel))) return

        const logName = this.projectName
        const date = moment().format("HH:mm:ss")
        const logLevelText = chalk.red(`[${LogLevel[logLevel]}]`)
        const dateText = chalk.cyanBright(date)
        const nameText = chalk.green(logName)
        const moduleName = chalk.yellow(`<${module}>`)

        console.log(`${dateText} - ${logLevelText} ${nameText} ${moduleName}:`, ...messages)
    }
}

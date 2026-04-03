import {ICoreSetup} from "@pollux/core/types"
import {Core, addContextData, ControllerContext, useContext} from "@pollux/core"
import {ILogStrategy} from "../logStrategies/ILogStrategy"
import {ConfigContext} from "@pollux/config"

declare module "@pollux/core/types" {
    export interface IControllerContext {
        loggingController: LoggingController
    }
}

export class LoggingController {
    private loggers: Array<ILogStrategy> = []


    constructor() {
        Core.onSetup.addListener(this.setupLoggers.bind(this))
    }

    public async setupLoggers(_: ICoreSetup): Promise<void> {
        const {logging: {logStrategies}} = useContext(ConfigContext)
        if (!logStrategies) return

        for (const loggerCtor of logStrategies) {
            const loggerInstance = new loggerCtor()
            await loggerInstance.init()

            this.loggers.push(loggerInstance)
        }
    }

    public async log(module: string, logLevel: number, ...messages: unknown[]): Promise<void> {
        for (const logger of this.loggers) {
            logger.log(module, logLevel, ...messages)
        }
    }
}

addContextData(ControllerContext, {
    loggingController: new LoggingController()
})

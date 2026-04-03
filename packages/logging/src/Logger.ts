import {ControllerContext, useContext} from "@pollux/core"

export class Logger {
    private tag: string = ""

    public init(tag: string): void {
        this.tag = tag
    }

    public async log(logLevel: number, ...messages: unknown[]): Promise<void> {
        const {loggingController} = useContext(ControllerContext)
        loggingController.log(`${this.tag}`, logLevel, ...messages)
    }
}

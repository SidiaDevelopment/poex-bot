import {LogLevel} from "../LogLevel"
import {ControllerContext, useContext} from "@pollux/core"

export const log = (level: LogLevel = LogLevel.Debug): MethodDecorator => {
    return (target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor): void => {
        const method = descriptor.value

        descriptor.value = async function (...args: unknown[]) {
            const {loggingController} = useContext(ControllerContext)
            loggingController.log("@pollux/logging", level, `Called function ${target.constructor.name}->${propertyKey.toString()}(${args.join(", ")})`)
            method.apply(this, args)
        }

    }
}

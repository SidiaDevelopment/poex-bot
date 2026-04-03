import {Logger} from "../Logger"

export const logger = (module: string = "@pollux/default"): PropertyDecorator => (target: object, propertyKey: string | symbol) => {
    const logger = new Logger()
    logger.init(`${module}:${target.constructor.name}`)

    const getter = () => {
        return logger
    }

    const setter = () => {
        return
    }

    Object.defineProperty(target, propertyKey, {
        get: getter,
        set: setter
    })
}

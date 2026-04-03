import {ControllerContext, useContext} from "@pollux/core"

export const injectService = (target: unknown, propertyKey: string): void => {
    const t = Reflect.getMetadata("design:type", target as object, propertyKey)
    const getter = () => {
        const {serviceController} = useContext(ControllerContext)
        return serviceController.get(t)
    }
    const setter = () => {
        return
    }
    Object.defineProperty(target, propertyKey, {
        get: getter,
        set: setter
    })
}

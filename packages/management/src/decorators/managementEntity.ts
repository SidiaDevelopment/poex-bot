import {Ctor} from "@pollux/utils"
import {ManagementEntityHandler} from "../ManagementEntityHandler"
import {ManagementEntityController} from "../ManagementEntityController"

export const managementEntity = (entity: string) => {
    return (ctor: Ctor<ManagementEntityHandler>): void => {
        const instance = new ctor()
        instance.entity = entity
        ManagementEntityController.addHandler(instance)
    }
}

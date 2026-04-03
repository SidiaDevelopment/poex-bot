import {IModule} from "@pollux/core/types"
import {Service} from "../Service"
import {addContextData, ControllerContext, Core, ModuleController} from "@pollux/core"
import {Ctor} from "@pollux/utils"

declare module "@pollux/core/types" {
    export interface IControllerContext {
        serviceController: ServiceController
    }
}

export class ServiceController {
    private serviceInstances: Record<string, Service> = {}

    constructor() {
        Core.onStart.addListener(this.init.bind(this))
        ModuleController.onLoadModule.addListener(this.onLoadModule.bind(this))
    }

    public async onLoadModule(module: IModule): Promise<void> {
        if (!module.services) return

        for (const servicesCtor of module.services) {
            this.serviceInstances[servicesCtor.name] = new servicesCtor()
        }
    }

    public async init(): Promise<void> {
        for (const serviceInstancesKey in this.serviceInstances) {
            const service = this.serviceInstances[serviceInstancesKey]

            await service.init()
        }
    }

    public get<T extends Service>(ctor: Ctor<Service>): T | null {
        if (!this.serviceInstances.hasOwnProperty(ctor.name)) return null

        return this.serviceInstances[ctor.name] as T
    }
}

addContextData(ControllerContext, {
    serviceController: new ServiceController()
})

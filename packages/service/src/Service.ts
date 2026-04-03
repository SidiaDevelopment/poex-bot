import {Ctor} from "@pollux/utils"

declare module "@pollux/core/types" {
    interface IModule {
        services?: Ctor<Service>[]
    }
}

export abstract class Service {
    public abstract init(): Promise<void>
}

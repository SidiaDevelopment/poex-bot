import {Ctor} from "@pollux/utils"
import {IApiRouteConfig} from "./IApiRouteConfig"
import {IApiRequestData} from "./IApiRequestData"
import {Request, Response} from "express"

export interface IModuleApiConfig {
    tag: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiRoutes?: Ctor<ApiHandler<any>>[]
}

declare module "@pollux/core/types" {
    interface IModule {
        api?: IModuleApiConfig
    }
}

export abstract class ApiHandler<T extends IApiRequestData> {
    public config!: IApiRouteConfig

    public execute = async (req: Request, res: Response) => {
        const data = {req, res} as T
        await this.handle(data)
    }

    public abstract handle(data: T): Promise<void>
}

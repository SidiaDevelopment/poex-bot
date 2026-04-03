import {IApiRouteConfig} from "../IApiRouteConfig"
import {ApiHandler} from "../ApiHandler"
import {Ctor} from "@pollux/utils"
import {IApiRequestData} from "../IApiRequestData"
import {ApiController} from "../ApiController"

export const route = (config: IApiRouteConfig) => {
    return (ctor: Ctor<ApiHandler<IApiRequestData>>): void => {
        const instance = new ctor()
        instance.config = config
        ApiController.addRoute(instance)
    }
}

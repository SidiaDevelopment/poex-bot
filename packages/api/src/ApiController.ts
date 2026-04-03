import {ControllerContext, useContext} from "@pollux/core"
import {LogLevel} from "@pollux/logging"
import {ApiHandler} from "./ApiHandler"
import {IApiRequestData} from "./IApiRequestData"
import {IApiControllerData} from "./IApiControllerData"

export class ApiController {
    private static routes: IApiControllerData[] = []

    public static addRoute(handler: ApiHandler<IApiRequestData>): void {
        if (!handler.config) {
            const {loggingController} = useContext(ControllerContext)
            loggingController.log("@pollux/api", LogLevel.Error, `Missing @route decorator on handler ${handler.constructor.name}`)
            return
        }

        ApiController.routes.push({
            instance: handler,
            method: handler.config.method,
            path: handler.config.path
        })
    }

    public static getAllRoutes(): IApiControllerData[] {
        return ApiController.routes
    }

    public static getRoute(method: string, path: string): IApiControllerData | null {
        return ApiController.routes.find(r => r.method === method && r.path === path) ?? null
    }
}

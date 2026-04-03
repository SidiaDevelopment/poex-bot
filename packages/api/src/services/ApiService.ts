import {Service} from "@pollux/service"
import {ControllerContext, useContext} from "@pollux/core"
import {ConfigContext} from "@pollux/config"
import {LogLevel} from "@pollux/logging"
import express, {Express, Request, Response} from "express"
import {ApiController} from "../ApiController"
import {HttpMethod} from "../IApiRouteConfig"

export class ApiService extends Service {
    private app!: Express

    public async init(): Promise<void> {
        const {api} = useContext(ConfigContext)
        const {loggingController} = useContext(ControllerContext)
        const port = api?.port ?? 3000

        this.app = express()
        this.app.use(express.json())

        const routes = ApiController.getAllRoutes()
        loggingController.log("@pollux/api", LogLevel.Debug, `Registered routes (${routes.length}):`)

        for (const routeData of routes) {
            const handler = async (req: Request, res: Response) => {
                try {
                    await routeData.instance.execute(req, res)
                } catch (error) {
                    loggingController.log("@pollux/api", LogLevel.Error, `Error handling ${routeData.method.toUpperCase()} ${routeData.path}: ${error instanceof Error ? error.message : String(error)}`)
                    if (!res.headersSent) {
                        res.status(500).json({error: "Internal server error"})
                    }
                }
            }

            switch (routeData.method) {
            case HttpMethod.GET:
                this.app.get(routeData.path, handler)
                break
            case HttpMethod.POST:
                this.app.post(routeData.path, handler)
                break
            case HttpMethod.PUT:
                this.app.put(routeData.path, handler)
                break
            case HttpMethod.PATCH:
                this.app.patch(routeData.path, handler)
                break
            case HttpMethod.DELETE:
                this.app.delete(routeData.path, handler)
                break
            }

            loggingController.log("@pollux/api", LogLevel.Debug, `  ${routeData.method.toUpperCase()} ${routeData.path}`)
        }

        this.app.listen(port, () => {
            loggingController.log("@pollux/api", LogLevel.Debug, `API server listening on port ${port}`)
        })
    }

    public getApp(): Express {
        return this.app
    }
}

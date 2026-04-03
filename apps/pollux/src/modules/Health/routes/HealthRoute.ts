import {route, ApiHandler, IApiRequestData, HttpMethod} from "@pollux/api"

const routeConfig = {
    method: HttpMethod.GET,
    path: "/health"
}

@route(routeConfig)
export class HealthRoute extends ApiHandler<IApiRequestData> {
    public handle = async ({res}: IApiRequestData): Promise<void> => {
        res.json({status: "ok"})
    }
}

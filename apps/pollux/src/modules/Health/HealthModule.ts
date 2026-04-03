import {IModule} from "@pollux/core/types"
import {IModuleApiConfig} from "@pollux/api"
import {HealthRoute} from "./routes/HealthRoute"

export class HealthModule implements IModule {
    public name = "health"
    public api: IModuleApiConfig = {
        tag: "Health",
        apiRoutes: [HealthRoute]
    }
}

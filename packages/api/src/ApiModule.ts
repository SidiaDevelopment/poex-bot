import {IModule} from "@pollux/core/types"
import {ApiService} from "./services/ApiService"

export class ApiModule implements IModule {
    public name = "api"
    public services = [ApiService]
}

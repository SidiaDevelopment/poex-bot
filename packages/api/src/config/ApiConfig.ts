import {Config, defaultConfig} from "@pollux/config"
import {IApiModuleConfig} from "./IApiConfig"
import {PartialRecursive} from "@pollux/utils"

@defaultConfig
export class ApiConfig extends Config<IApiModuleConfig> {
    data: PartialRecursive<IApiModuleConfig> = {
        api: {
            port: 3000
        }
    }
}

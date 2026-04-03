import {ApiHandler} from "./ApiHandler"
import {IApiRequestData} from "./IApiRequestData"

export interface IApiControllerData {
    method: string
    path: string
    instance: ApiHandler<IApiRequestData>
}

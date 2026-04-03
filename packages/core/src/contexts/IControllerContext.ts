import {ModuleController} from "../module/ModuleController"

declare module "@pollux/core/types" {
    export interface IControllerContext {
        moduleController: ModuleController
    }
}

import {Ctors} from "@pollux/utils"

declare module "@pollux/core/types" {
    export interface ICoreSetup {
        modules: Ctors<IModule>
    }
}

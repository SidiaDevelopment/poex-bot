import {RequiredRecursive} from "@pollux/utils"

declare module "@pollux/core/types" {
    export interface IConfig {
        name: string
    }

     
    export interface IConfigContext extends RequiredRecursive<IConfig> {}

    export interface ICoreSetup {
        config: IConfig
    }
}

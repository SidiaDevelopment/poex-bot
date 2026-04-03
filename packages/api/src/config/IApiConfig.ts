export interface IApiModuleConfig {
    api?: {
        port: number
    }
}

declare module "@pollux/core/types" {
    export interface IConfig extends IApiModuleConfig {}
}

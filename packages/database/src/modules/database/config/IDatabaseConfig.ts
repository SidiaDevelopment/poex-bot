export interface IDatabaseModuleConfig {
    database?: {
        type?: "sqlite" | "mysql"
        host?: string
        port?: number
        username?: string
        password?: string
        database?: string
        synchronize?: boolean
    }
}

declare module "@pollux/core/types" {
    export interface IConfig extends IDatabaseModuleConfig {}
}

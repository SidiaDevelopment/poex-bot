export interface IDiscordCommandModuleConfig {
    discordCommands?: {
        updateCommandsOnStart: boolean
    }
}

declare module "@pollux/core/types" {
    export interface IConfig extends IDiscordCommandModuleConfig {}
}

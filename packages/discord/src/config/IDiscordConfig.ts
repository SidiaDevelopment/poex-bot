import { BitFieldResolvable, GatewayIntentsString } from "discord.js"

export interface IDiscordConfig {
    discord: {
        key: string,
        intents?: BitFieldResolvable<GatewayIntentsString, number>
    }
}

declare module "@pollux/core/types" {
    export interface IConfig extends IDiscordConfig {}
}

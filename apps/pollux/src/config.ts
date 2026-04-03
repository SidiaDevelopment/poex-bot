import "dotenv/config"
import { IConfig } from "@pollux/core/types"
import {LogLevel} from "@pollux/logging"

export const config: IConfig = {
    name: "pollux",
    logging: {
        logLevel: LogLevel.Development,
    },
    discord: {
        key: process.env.DISCORD_KEY!,
    },
    discordCommands: {
        updateCommandsOnStart: true
    },
    database: {
        type: (process.env.DB_TYPE as "sqlite" | "mysql") ?? "sqlite",
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE ?? "./data/dev.sq3",
        synchronize: process.env.DB_SYNCHRONIZE !== "false"
    },
    api: {
        port: process.env.API_PORT ? parseInt(process.env.API_PORT) : 3000
    }
}

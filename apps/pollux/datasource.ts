import "dotenv/config"
import "reflect-metadata"
import {DataSource, DataSourceOptions} from "typeorm"
import {GuildEntity} from "@pollux/discord"
import {SettingEntity} from "@pollux/settings"
import {PoExchangeCategoryEntity} from "./src/modules/PoExchange/entities/PoExchangeCategoryEntity"

const entities = [GuildEntity, SettingEntity, PoExchangeCategoryEntity]

let options: DataSourceOptions

if (process.env.DB_TYPE === "mysql") {
    options = {
        type: "mysql",
        host: process.env.DB_HOST ?? "localhost",
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
        username: process.env.DB_USERNAME ?? "root",
        password: process.env.DB_PASSWORD ?? "",
        database: process.env.DB_DATABASE ?? "pollux",
        entities,
        migrations: ["./migrations/*.ts"],
        logger: "advanced-console"
    }
} else {
    options = {
        type: "sqlite",
        database: process.env.DB_DATABASE ?? "./data/dev.sq3",
        entities,
        migrations: ["./migrations/*.ts"],
        logger: "advanced-console"
    }
}

export default new DataSource(options)

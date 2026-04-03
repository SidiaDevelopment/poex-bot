"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const discord_1 = require("@pollux/discord");
const settings_1 = require("@pollux/settings");
const PoExchangeCategoryEntity_1 = require("./src/modules/PoExchange/entities/PoExchangeCategoryEntity");
const entities = [discord_1.GuildEntity, settings_1.SettingEntity, PoExchangeCategoryEntity_1.PoExchangeCategoryEntity];
let options;
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
    };
}
else {
    options = {
        type: "sqlite",
        database: process.env.DB_DATABASE ?? "./data/dev.sq3",
        entities,
        migrations: ["./migrations/*.ts"],
        logger: "advanced-console"
    };
}
exports.default = new typeorm_1.DataSource(options);
//# sourceMappingURL=datasource.js.map
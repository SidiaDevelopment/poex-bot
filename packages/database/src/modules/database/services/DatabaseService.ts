import {Service} from "@pollux/service"
import {useContext} from "@pollux/core"
import {ControllerContext} from "@pollux/core"
import {ConfigContext} from "@pollux/config"
import {Ctor} from "@pollux/utils"
import {LogLevel} from "@pollux/logging"
import {DataSource, DataSourceOptions} from "typeorm"

export class DatabaseService extends Service {
    private client!: DataSource

    public static entities: Ctor<object>[] = []

    public async init(): Promise<void> {
        const {database} = useContext(ConfigContext)
        const {loggingController} = useContext(ControllerContext)

        let options: DataSourceOptions

        if (database?.type === "mysql") {
            options = {
                type: "mysql",
                host: database.host ?? "localhost",
                port: database.port ?? 3306,
                username: database.username ?? "root",
                password: database.password ?? "",
                database: database.database ?? "pollux",
                entities: DatabaseService.entities,
                synchronize: database.synchronize ?? false,
                logger: "advanced-console"
            }
        } else {
            options = {
                type: "sqlite",
                database: database?.database ?? "./data/dev.sq3",
                entities: DatabaseService.entities,
                synchronize: database?.synchronize ?? true,
                logger: "advanced-console"
            }
        }

        this.client = new DataSource(options)
        await this.client.initialize()
        loggingController.log("@pollux/database", LogLevel.Debug, `Connected to ${options.type} database`)
    }

    public getClient(): DataSource {
        return this.client
    }
}

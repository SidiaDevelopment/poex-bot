import {Service} from "@pollux/service"
import {ControllerContext, useContext} from "@pollux/core"
import {ConfigContext} from "@pollux/config"
import {CallbackEvent} from "@pollux/utils"
import {Client, GuildManager, Status} from "discord.js"
import {LogLevel} from "@pollux/logging"
import chalk from "chalk"

export class DiscordService extends Service {
    public static onClientReady: CallbackEvent<GuildManager> = new CallbackEvent<GuildManager>()

    private client!: Client

    public init = async (): Promise<void> => {
        const {discord: {key, intents}} = useContext(ConfigContext)

        this.client = new Client({
            intents: intents!
        })

        this.client.on("clientReady", this.onReady)
        this.client.on("debug", this.onDebug)
        this.client.on("error", this.onError)

        await this.client.login(key)
    }

    public getClient(): Client {
        return this.client
    }

    private onReady = async (): Promise<void> => {
        const {loggingController: logger} = useContext(ControllerContext)
        await logger.log("@pollux/discord", LogLevel.Debug, `Connected to Discord API
${chalk.underline.bold.magenta("Bot")}
 > ${chalk.bold("Bot-User:")} ${this.client.user?.displayName ?? "None"} <@${this.client.user?.id ?? "unknown"}>
 > ${chalk.bold("Guilds:")} ${this.client.guilds.cache.size}
${chalk.underline.bold.magenta("Connection")}
 > ${chalk.bold("Websocket Status:")} ${Status[this.client.ws.status]}
 > ${chalk.bold("Shard Count:")} ${this.client.shard?.count ?? "Not sharded"}
 > ${chalk.bold("Shard Type:")} ${this.client.shard?.mode ?? "Not sharded"}`)

        DiscordService.onClientReady.emit(this.client.guilds)
    }

    private onDebug = async (message: string): Promise<void> => {
        const {loggingController: logger} = useContext(ControllerContext)
        await logger.log("@pollux/discord", LogLevel.Development, message)
    }

    private onError = async (error: Error): Promise<void> => {
        const {loggingController: logger} = useContext(ControllerContext)
        await logger.log("@pollux/discord", LogLevel.Error, error.message)
    }
}

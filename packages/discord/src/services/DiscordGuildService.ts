import {injectService, Service} from "@pollux/service"
import {DiscordEventService} from "./DiscordEventService"
import {Events, Guild, GuildManager, Snowflake} from "discord.js"
import {DiscordService} from "./DiscordService"
import {DatabaseService} from "@pollux/database"
import {GuildEntity} from "../entities/GuildEntity"

export class DiscordGuildService extends Service {
    @injectService
    protected discordEventService!: DiscordEventService

    @injectService
    protected discordService!: DiscordService

    @injectService
    protected databaseService!: DatabaseService

    private integrityCache: Snowflake[] = []

    public init = async (): Promise<void> => {
        this.discordEventService.subscribe(Events.GuildCreate, this.onGuildJoin)
        DiscordService.onClientReady.addListener(this.startupIntegrityCheck.bind(this))
    }

    public onGuildJoin = async (guild: Guild): Promise<void> => {
        await this.upsertGuild(guild.id, guild.name)
    }

    public async startupIntegrityCheck(guilds: GuildManager): Promise<void> {
        for (const cacheElement of guilds.cache) {
            await this.integrityCheck(...cacheElement)
        }
    }

    public async integrityCheck(id: Snowflake, guild: Guild): Promise<void> {
        if (this.integrityCache.includes(id)) return
        this.integrityCache.push(id)
        await this.upsertGuild(id, guild.name)
    }

    private async upsertGuild(id: string, name: string): Promise<void> {
        const repo = this.databaseService.getClient().getRepository(GuildEntity)
        let entity = await repo.findOneBy({id})
        if (!entity) {
            entity = new GuildEntity()
            entity.id = id
        }
        entity.name = name
        await repo.save(entity)
    }
}

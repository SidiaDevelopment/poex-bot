import {injectService, Service} from "@pollux/service"
import {DatabaseService} from "@pollux/database"
import {DiscordService} from "@pollux/discord"
import {EmbedService} from "@pollux/discord-command"
import {Colors, EmbedBuilder, TextChannel} from "discord.js"
import {PoExchangeCategoryEntity} from "../entities/PoExchangeCategoryEntity"
import {PoExchangeChannelId} from "../PoExchangeDeclaration"
import {IPoExchangeFormatter, IPoExchangeUser, IPoExchangeService, IPoExchangeLinks} from "../formatters/IPoExchangeFormatter"
import {BossCarryFormatter} from "../formatters/BossCarryFormatter"
import {NightmareMapFormatter} from "../formatters/NightmareMapFormatter"
import {GoldRotaFormatter} from "../formatters/GoldRotaFormatter"
import {FiveWayFormatter} from "../formatters/FiveWayFormatter"
import {BenchCraftFormatter} from "../formatters/BenchCraftFormatter"
import {TempleHostFormatter} from "../formatters/TempleHostFormatter"
import {ChallengeCompletionFormatter} from "../formatters/ChallengeCompletionFormatter"
import {CampaignSkipFormatter} from "../formatters/CampaignSkipFormatter"
import {LabyrinthFormatter} from "../formatters/LabyrinthFormatter"
import {BloodlinesFormatter} from "../formatters/BloodlinesFormatter"

export interface IPoExchangePost {
    channelId: string
    action: "update" | "refresh" | "strike"
    messageId?: string
    services?: IPoExchangeService[]
    browseUrl?: string
    listUrl?: string
}

export interface IPoExchangePostResult {
    channelId: string
    messageId?: string
    status: "ok" | "error"
    errorMessage?: string
}

export class PoExchangeService extends Service {
    @injectService
    private databaseService!: DatabaseService

    @injectService
    private discordService!: DiscordService

    @injectService
    private embedService!: EmbedService

    private cache: Record<string, string> = {}

    private formatters: Record<string, IPoExchangeFormatter> = {
        [PoExchangeChannelId.POE1_BOSS_KILLING]: new BossCarryFormatter(),
        [PoExchangeChannelId.POE1_NIGHTMARE_MAPS]: new NightmareMapFormatter(),
        [PoExchangeChannelId.POE1_INVITATIONS]: new BossCarryFormatter(),
        [PoExchangeChannelId.POE1_BLOODLINES]: new BloodlinesFormatter(),
        [PoExchangeChannelId.POE1_LABYRINTH]: new LabyrinthFormatter(),
        [PoExchangeChannelId.POE1_5_WAY]: new FiveWayFormatter(),
        [PoExchangeChannelId.POE1_CAMPAIGN_SKIP]: new CampaignSkipFormatter(),
        [PoExchangeChannelId.POE1_GOLD_ROTATION]: new GoldRotaFormatter(),
        [PoExchangeChannelId.POE1_TEMPLE_HOST]: new TempleHostFormatter(),
        [PoExchangeChannelId.POE1_CHALLENGE_COMPLETION]: new ChallengeCompletionFormatter(),
        [PoExchangeChannelId.POE1_BENCH_CRAFT]: new BenchCraftFormatter(),
        [PoExchangeChannelId.POE1_STANDARD_BOSS_KILLING]: new BossCarryFormatter(),
        [PoExchangeChannelId.POE1_STANDARD_NIGHTMARE_MAPS]: new NightmareMapFormatter(),
        [PoExchangeChannelId.POE1_STANDARD_INVITATIONS]: new BossCarryFormatter(),
        [PoExchangeChannelId.POE1_STANDARD_BLOODLINES]: new BloodlinesFormatter(),
        [PoExchangeChannelId.POE1_STANDARD_LABYRINTH]: new LabyrinthFormatter(),
        [PoExchangeChannelId.POE1_STANDARD_5_WAY]: new FiveWayFormatter(),
        [PoExchangeChannelId.POE1_STANDARD_CAMPAIGN_SKIP]: new CampaignSkipFormatter(),
        [PoExchangeChannelId.POE1_STANDARD_GOLD_ROTATION]: new GoldRotaFormatter(),
        [PoExchangeChannelId.POE1_STANDARD_TEMPLE_HOST]: new TempleHostFormatter(),
        [PoExchangeChannelId.POE1_STANDARD_CHALLENGE_COMPLETION]: new ChallengeCompletionFormatter(),
        [PoExchangeChannelId.POE1_STANDARD_BENCH_CRAFT]: new BenchCraftFormatter()
    }

    private cacheKey(channelKey: string, guildId: string): string {
        return `${channelKey}::${guildId}`
    }

    public async init(): Promise<void> {
        const repo = this.databaseService.getClient().getRepository(PoExchangeCategoryEntity)
        const all = await repo.find()
        for (const entity of all) {
            this.cache[this.cacheKey(entity.channelKey, entity.guildId)] = entity.discordChannelId
        }
    }

    public async processPost(user: IPoExchangeUser | null, post: IPoExchangePost, guildId: string): Promise<IPoExchangePostResult> {
        const discordChannelId = this.cache[this.cacheKey(post.channelId, guildId)]
        if (!discordChannelId) {
            return {channelId: post.channelId, status: "error", errorMessage: `No channel mapping for ${post.channelId}`}
        }

        const client = this.discordService.getClient()
        const channel = await client.channels.fetch(discordChannelId)
        if (!channel || !(channel instanceof TextChannel)) {
            return {channelId: post.channelId, status: "error", errorMessage: "Channel not found or not a text channel"}
        }

        switch (post.action) {
        case "update":
            if (!user) return {channelId: post.channelId, status: "error", errorMessage: "User required for update action"}
            return this.handleUpdate(channel, user, post)
        case "refresh":
            if (!user) return {channelId: post.channelId, status: "error", errorMessage: "User required for refresh action"}
            return this.handleRefresh(channel, user, post)
        case "strike":
            return this.handleStrike(channel, post)
        default:
            return {channelId: post.channelId, status: "error", errorMessage: `Unknown action: ${post.action}`}
        }
    }

    private buildEmbed(channelId: string, user: IPoExchangeUser, services: IPoExchangeService[], links: IPoExchangeLinks): EmbedBuilder {
        const embed = this.embedService.getDefaultBuilder(Colors.Blue)
        const formatter = this.formatters[channelId]
        if (formatter) {
            formatter.format(embed, user, services, links)
        }
        return embed
    }

    private async handleUpdate(channel: TextChannel, user: IPoExchangeUser, post: IPoExchangePost): Promise<IPoExchangePostResult> {
        const embed = this.buildEmbed(post.channelId, user, post.services ?? [], {browseUrl: post.browseUrl, listUrl: post.listUrl})

        if (post.messageId) {
            try {
                const msg = await channel.messages.fetch(post.messageId)
                await msg.edit({embeds: [embed]})
                return {channelId: post.channelId, messageId: post.messageId, status: "ok"}
            } catch {
                // Message not found, create new
            }
        }

        const msg = await channel.send({embeds: [embed]})
        return {channelId: post.channelId, messageId: msg.id, status: "ok"}
    }

    private async handleRefresh(channel: TextChannel, user: IPoExchangeUser, post: IPoExchangePost): Promise<IPoExchangePostResult> {
        if (post.messageId) {
            try {
                const msg = await channel.messages.fetch(post.messageId)
                await msg.delete()
            } catch {
                // Ignore if message doesn't exist
            }
        }

        const embed = this.buildEmbed(post.channelId, user, post.services ?? [], {browseUrl: post.browseUrl, listUrl: post.listUrl})
        const msg = await channel.send({embeds: [embed]})
        return {channelId: post.channelId, messageId: msg.id, status: "ok"}
    }

    private async handleStrike(channel: TextChannel, post: IPoExchangePost): Promise<IPoExchangePostResult> {
        if (!post.messageId) {
            return {channelId: post.channelId, status: "error", errorMessage: "messageId required for strike action"}
        }

        try {
            const msg = await channel.messages.fetch(post.messageId)
            const oldEmbed = msg.embeds[0]
            const embed = this.embedService.getDefaultBuilder(Colors.DarkButNotBlack)
            if (oldEmbed) {
                embed.setTitle(`~~${oldEmbed.title ?? ""}~~`)
                const desc = oldEmbed.description ?? ""
                embed.setDescription(`~~${desc}~~`)
                for (const field of oldEmbed.fields) {
                    embed.addFields({name: `~~${field.name}~~`, value: `~~${field.value}~~`, inline: field.inline ?? false})
                }
            }
            await msg.delete()
            const newMsg = await channel.send({embeds: [embed]})
            return {channelId: post.channelId, messageId: newMsg.id, status: "ok"}
        } catch {
            return {channelId: post.channelId, status: "error", errorMessage: "Message not found"}
        }
    }

    public getDiscordChannelId(channelKey: string, guildId: string): string | null {
        return this.cache[this.cacheKey(channelKey, guildId)] ?? null
    }

    public async setChannel(channelKey: string, guildId: string, discordChannelId: string): Promise<void> {
        const repo = this.databaseService.getClient().getRepository(PoExchangeCategoryEntity)
        let entity = await repo.findOneBy({channelKey, guildId})
        if (!entity) {
            entity = new PoExchangeCategoryEntity()
            entity.channelKey = channelKey
            entity.guildId = guildId
        }
        entity.discordChannelId = discordChannelId
        await repo.save(entity)
        this.cache[this.cacheKey(channelKey, guildId)] = discordChannelId
    }

    public async removeChannel(channelKey: string, guildId: string): Promise<boolean> {
        const key = this.cacheKey(channelKey, guildId)
        if (!Object.prototype.hasOwnProperty.call(this.cache, key)) return false

        const repo = this.databaseService.getClient().getRepository(PoExchangeCategoryEntity)
        await repo.delete({channelKey, guildId})
        delete this.cache[key]
        return true
    }
}

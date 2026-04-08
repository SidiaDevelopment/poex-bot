import {injectService, Service} from "@pollux/service"
import {SettingsKeys, SettingsService} from "@pollux/settings"
import {Request, Response} from "express"

interface DiscordUser {
    id: string
    username: string
}

interface DiscordGuild {
    id: string
    name: string
    icon: string | null
    permissions: string
}

interface CacheEntry<T> {
    data: T
    expiresAt: number
}

const MANAGE_GUILD = 0x20n
const CACHE_TTL = 60 * 1000

export class ManagementAuthService extends Service {
    @injectService
    private settingsService!: SettingsService

    private userCache: Record<string, CacheEntry<DiscordUser>> = {}
    private guildsCache: Record<string, CacheEntry<DiscordGuild[]>> = {}

    public async init(): Promise<void> {}

    public async getUser(req: Request): Promise<DiscordUser | null> {
        const token = this.extractToken(req)
        if (!token) return null

        const cached = this.userCache[token]
        if (cached && cached.expiresAt > Date.now()) return cached.data

        try {
            const response = await fetch("https://discord.com/api/v10/users/@me", {
                headers: {Authorization: `Bearer ${token}`}
            })
            if (!response.ok) return null
            const user = await response.json()
            this.userCache[token] = {data: user, expiresAt: Date.now() + CACHE_TTL}
            return user
        } catch {
            return null
        }
    }

    public async getUserGuilds(req: Request): Promise<DiscordGuild[]> {
        const token = this.extractToken(req)
        if (!token) return []

        const cached = this.guildsCache[token]
        if (cached && cached.expiresAt > Date.now()) return cached.data

        try {
            const response = await fetch("https://discord.com/api/v10/users/@me/guilds", {
                headers: {Authorization: `Bearer ${token}`}
            })
            if (!response.ok) return []
            const guilds = await response.json()
            this.guildsCache[token] = {data: guilds, expiresAt: Date.now() + CACHE_TTL}
            return guilds
        } catch {
            return []
        }
    }

    public async canManageGuild(req: Request, guildId: string): Promise<boolean> {
        const guilds = await this.getUserGuilds(req)
        const guild = guilds.find(g => g.id === guildId)
        if (!guild) return false
        return (BigInt(guild.permissions) & MANAGE_GUILD) === MANAGE_GUILD
    }

    public async isAdmin(req: Request): Promise<boolean> {
        const user = await this.getUser(req)
        if (!user) return false
        const adminUser = this.settingsService.get(SettingsKeys.AdminUser, "")
        return user.id === adminUser
    }

    public sendUnauthorized(res: Response): void {
        res.status(401).json({error: "Unauthorized"})
    }

    public sendForbidden(res: Response): void {
        res.status(403).json({error: "Forbidden"})
    }

    private extractToken(req: Request): string | null {
        const header = req.headers.authorization
        if (!header?.startsWith("Bearer ")) return null
        return header.slice(7)
    }
}

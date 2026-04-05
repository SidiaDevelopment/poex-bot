import {config} from "./config"
import {getSession} from "./session"

async function botFetch(path: string, options?: RequestInit): Promise<Response> {
    const session = await getSession()
    if (!session) throw new Error("Not authenticated")

    return fetch(`${config.botApiUrl}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.accessToken}`,
            ...options?.headers
        }
    })
}

export async function getModules() {
    const res = await botFetch("/api/management/modules")
    return res.json()
}

export async function getGuilds() {
    const res = await botFetch("/api/management/guilds")
    return res.json()
}

export async function getGuildSettings(guildId: string) {
    const res = await botFetch(`/api/management/guilds/${guildId}/settings`)
    return res.json()
}

export async function setGuildSetting(guildId: string, key: string, value: string) {
    const res = await botFetch(`/api/management/guilds/${guildId}/settings`, {
        method: "POST",
        body: JSON.stringify({key, value})
    })
    return res.json()
}

export async function getGuildEntities(guildId: string, entity: string) {
    const res = await botFetch(`/api/management/guilds/${guildId}/entities/${entity}`)
    return res.json()
}

export async function createGuildEntity(guildId: string, entity: string, data: Record<string, unknown>) {
    const res = await botFetch(`/api/management/guilds/${guildId}/entities/${entity}`, {
        method: "POST",
        body: JSON.stringify(data)
    })
    return res.json()
}

export async function deleteGuildEntity(guildId: string, entity: string, id: string) {
    const res = await botFetch(`/api/management/guilds/${guildId}/entities/${entity}/${id}`, {
        method: "DELETE"
    })
    return res.json()
}

const discordDataCache: Record<string, {data: unknown, expiresAt: number}> = {}
const DISCORD_CACHE_TTL = 10 * 60 * 1000

export async function getGuildDiscordData(guildId: string) {
    const cached = discordDataCache[guildId]
    if (cached && cached.expiresAt > Date.now()) return cached.data

    const res = await botFetch(`/api/management/guilds/${guildId}/discord`)
    const data = await res.json()
    discordDataCache[guildId] = {data, expiresAt: Date.now() + DISCORD_CACHE_TTL}
    return data
}

export function invalidateDiscordDataCache(guildId: string) {
    delete discordDataCache[guildId]
}

export async function getGlobalSettings() {
    const res = await botFetch("/api/management/global/settings")
    return res.json()
}

export async function setGlobalSetting(key: string, value: string) {
    const res = await botFetch("/api/management/global/settings", {
        method: "POST",
        body: JSON.stringify({key, value})
    })
    return res.json()
}

import {redirect} from "next/navigation"
import {getSession} from "@/lib/session"
import {getModules, getGuildSettings, getGuildEntities, getGuildDiscordData} from "@/lib/bot-api"
import {GuildDashboardClient} from "./GuildDashboardClient"

interface ModuleData {
    name: string
    management: {
        sections?: {title: string, fields: {key: string, type: string, label: string, description?: string, choices?: {name: string, value: string}[]}[]}[]
        tables?: {title: string, description?: string, entity: string, columns: {key: string, type: string, label: string, choices?: {name: string, value: string}[], unique?: boolean}[]}[]
    }
}

export default async function GuildDashboard({params}: {params: Promise<{guildId: string}>}) {
    const session = await getSession()
    if (!session) redirect("/")

    const {guildId} = await params

    let modules: ModuleData[] = []
    let settings: Record<string, string | null> = {}

    let discordData = {channels: [] as {id: string, name: string}[], roles: [] as {id: string, name: string, color: string}[]}

    try {
        const [mods, s, d] = await Promise.all([
            getModules(),
            getGuildSettings(guildId),
            getGuildDiscordData(guildId)
        ])
        modules = Array.isArray(mods) ? mods : []
        settings = s && typeof s === "object" && !("error" in s) ? s : {}
        discordData = d && d.channels ? d : {channels: [], roles: []}
    } catch {
        redirect("/dashboard")
    }

    const tableData: Record<string, Record<string, unknown>[]> = {}
    for (const mod of modules) {
        for (const table of mod.management.tables ?? []) {
            try {
                tableData[table.entity] = await getGuildEntities(guildId, table.entity)
            } catch {
                tableData[table.entity] = []
            }
        }
    }

    return (
        <GuildDashboardClient
            guildId={guildId}
            modules={modules}
            settings={settings}
            tableData={tableData}
            discordData={discordData}
        />
    )
}

"use client"

import {useState} from "react"
import {SectionRenderer} from "@/components/SectionRenderer"
import {TableRenderer} from "@/components/TableRenderer"
import {ArrowLeft, LogOut, Package, Server, Boxes, RefreshCw} from "lucide-react"

interface ModuleData {
    name: string
    management: {
        sections?: {title: string, fields: {key: string, type: string, label: string, description?: string, choices?: {name: string, value: string}[]}[]}[]
        tables?: {title: string, description?: string, entity: string, columns: {key: string, type: string, label: string, choices?: {name: string, value: string}[], unique?: boolean}[]}[]
    }
}

interface DiscordData {
    channels: {id: string, name: string}[]
    roles: {id: string, name: string, color: string}[]
}

interface Props {
    guildId: string
    modules: ModuleData[]
    settings: Record<string, string | null>
    tableData: Record<string, Record<string, unknown>[]>
    discordData: DiscordData
}

export function GuildDashboardClient({guildId, modules, settings, tableData, discordData: initialDiscordData}: Props) {
    const [activeModule, setActiveModule] = useState(modules[0]?.name ?? "")
    const [discordData, setDiscordData] = useState(initialDiscordData)
    const [refreshing, setRefreshing] = useState(false)

    const active = modules.find(m => m.name === activeModule)

    async function handleRefreshDiscord() {
        setRefreshing(true)
        try {
            const res = await fetch(`/api/discord/${guildId}`, {method: "DELETE"})
            const data = await res.json()
            setDiscordData(data)
        } catch {}
        setRefreshing(false)
    }

    return (
        <div className="min-h-full">
            <header className="border-b border-border px-6 py-4 bg-surface/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="flex items-center justify-between w-full px-2">
                    <div className="flex items-center gap-3">
                        <a href="/dashboard" className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-muted hover:text-white hover:border-border-hover hover:bg-surface-hover transition-all duration-200">
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Back
                        </a>
                        <div className="h-5 w-px bg-border" />
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-accent-soft border border-accent/20 flex items-center justify-center">
                                <Server className="w-3.5 h-3.5 text-accent-text" />
                            </div>
                            <h1 className="text-base font-semibold text-white">Server Settings</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleRefreshDiscord}
                            disabled={refreshing}
                            title="Refresh channels & roles"
                            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-muted hover:text-white hover:border-border-hover hover:bg-surface-hover transition-all duration-200 disabled:opacity-50"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
                            Refresh
                        </button>
                        <a href="/api/auth/logout" className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm text-muted hover:text-white hover:border-border-hover hover:bg-surface-hover transition-all duration-200">
                            <LogOut className="w-3.5 h-3.5" />
                            Logout
                        </a>
                    </div>
                </div>
            </header>
            <div className="w-full px-2 flex min-h-[calc(100vh-57px)]">
                <nav className="w-64 shrink-0 border-r border-border py-6 px-4 bg-surface/30">
                    <div className="flex items-center gap-2 px-3 mb-4">
                        <Boxes className="w-3.5 h-3.5 text-muted" />
                        <h3 className="text-[11px] font-semibold text-muted uppercase tracking-widest">Modules</h3>
                    </div>
                    <ul className="space-y-0.5">
                        {modules.map(mod => (
                            <li key={mod.name}>
                                <button
                                    onClick={() => setActiveModule(mod.name)}
                                    className={`w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                                        activeModule === mod.name
                                            ? "bg-accent-soft text-accent-text font-medium shadow-sm shadow-accent/5 border border-accent/15"
                                            : "text-muted hover:text-white hover:bg-surface-hover border border-transparent"
                                    }`}
                                >
                                    <Package className={`w-4 h-4 shrink-0 ${activeModule === mod.name ? "text-accent-text" : ""}`} />
                                    {mod.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
                <main className="flex-1 py-10 px-12">
                    {active ? (
                        <>
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-white tracking-tight">{active.name}</h2>
                                <p className="text-muted text-sm mt-1">Configure module settings and data</p>
                            </div>

                            {active.management.sections?.map((section, i) => (
                                <SectionRenderer
                                    key={i}
                                    section={section}
                                    values={settings}
                                    guildId={guildId}
                                    discordData={discordData}
                                />
                            ))}

                            {active.management.tables?.map((table, i) => (
                                <TableRenderer
                                    key={i}
                                    table={table}
                                    data={tableData[table.entity] ?? []}
                                    guildId={guildId}
                                    discordData={discordData}
                                />
                            ))}
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-64">
                            <p className="text-muted">No configurable modules found.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

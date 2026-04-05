import {redirect} from "next/navigation"
import {getSession} from "@/lib/session"
import {getGuilds} from "@/lib/bot-api"
import Link from "next/link"
import {LogOut, ChevronRight, Server, Shield} from "lucide-react"

interface Guild {
    id: string
    name: string
    icon: string | null
}

export default async function Dashboard() {
    const session = await getSession()
    if (!session) redirect("/")

    let guilds: Guild[] = []
    try {
        guilds = await getGuilds()
    } catch {
        redirect("/")
    }

    return (
        <div className="min-h-full">
            <header className="border-b border-border px-6 py-4 bg-surface/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="flex items-center justify-between w-full px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-accent-soft border border-accent/20 flex items-center justify-center">
                            <Server className="w-4 h-4 text-accent-text" />
                        </div>
                        <h1 className="text-lg font-semibold text-white">Pollux</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <a href="/admin" className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm text-muted hover:text-white hover:border-border-hover hover:bg-surface-hover transition-all duration-200">
                            <Shield className="w-3.5 h-3.5" />
                            Admin
                        </a>
                        <a href="/api/auth/logout" className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm text-muted hover:text-white hover:border-border-hover hover:bg-surface-hover transition-all duration-200">
                            <LogOut className="w-3.5 h-3.5" />
                            Logout
                        </a>
                    </div>
                </div>
            </header>
            <main className="w-full px-2 px-6 py-12">
                <div className="mb-10">
                    <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Your Servers</h2>
                    <p className="text-muted">Select a server to configure</p>
                </div>
                {guilds.length === 0 ? (
                    <div className="rounded-2xl border border-border bg-surface/50 p-12 text-center">
                        <Server className="w-10 h-10 text-zinc-600 mx-auto mb-4" />
                        <p className="text-muted">No servers found where you have management permissions and the bot is present.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {guilds.map((guild) => (
                            <Link
                                key={guild.id}
                                href={`/dashboard/${guild.id}`}
                                className="glow-card group flex items-center gap-4 rounded-2xl border border-border bg-surface/50 p-5 hover:bg-surface-hover hover:border-border-hover transition-all duration-200"
                            >
                                {guild.icon ? (
                                    <img
                                        src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=64`}
                                        alt={guild.name}
                                        className="w-11 h-11 rounded-xl ring-1 ring-white/5"
                                    />
                                ) : (
                                    <div className="w-11 h-11 rounded-xl bg-accent-soft border border-accent/10 flex items-center justify-center text-sm font-bold text-accent-text">
                                        {guild.name.charAt(0)}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <span className="font-medium text-white truncate block">{guild.name}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-accent-text transition-colors duration-200 group-hover:translate-x-0.5 transform" />
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}

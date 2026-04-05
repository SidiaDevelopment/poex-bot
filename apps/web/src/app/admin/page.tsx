import {redirect} from "next/navigation"
import {getSession} from "@/lib/session"
import {getGlobalSettings} from "@/lib/bot-api"
import {GlobalSettingsForm} from "./GlobalSettingsForm"
import {ArrowLeft, LogOut, Shield} from "lucide-react"

export default async function AdminPage() {
    const session = await getSession()
    if (!session) redirect("/")

    let settings: Record<string, string | null> = {}

    try {
        settings = await getGlobalSettings()
    } catch {
        redirect("/dashboard")
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
                            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                <Shield className="w-3.5 h-3.5 text-amber-400" />
                            </div>
                            <h1 className="text-base font-semibold text-white">Admin</h1>
                        </div>
                    </div>
                    <a href="/api/auth/logout" className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm text-muted hover:text-white hover:border-border-hover hover:bg-surface-hover transition-all duration-200">
                        <LogOut className="w-3.5 h-3.5" />
                        Logout
                    </a>
                </div>
            </header>
            <main className="w-full px-2 px-6 py-12">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Global Settings</h2>
                    <p className="text-muted">These settings apply across all servers</p>
                </div>
                <GlobalSettingsForm settings={settings} />
            </main>
        </div>
    )
}

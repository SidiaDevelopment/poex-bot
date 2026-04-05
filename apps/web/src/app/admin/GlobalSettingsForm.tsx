"use client"

import {useState} from "react"
import {Save, Loader2, Check} from "lucide-react"

interface Props {
    settings: Record<string, string | null>
}

export function GlobalSettingsForm({settings}: Props) {
    const [values, setValues] = useState<Record<string, string>>(
        Object.fromEntries(Object.entries(settings).map(([k, v]) => [k, v ?? ""]))
    )
    const [saving, setSaving] = useState<Record<string, boolean>>({})
    const [saved, setSaved] = useState<Record<string, boolean>>({})

    async function handleSave(key: string) {
        setSaving(s => ({...s, [key]: true}))
        await fetch("/api/admin/settings", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({key, value: values[key]})
        })
        setSaving(s => ({...s, [key]: false}))
        setSaved(s => ({...s, [key]: true}))
        setTimeout(() => setSaved(s => ({...s, [key]: false})), 2000)
    }

    const entries = Object.entries(values)

    if (entries.length === 0) {
        return (
            <div className="rounded-2xl border border-border bg-surface/40 p-12 text-center">
                <p className="text-muted">No global settings configured.</p>
            </div>
        )
    }

    return (
        <div className="rounded-2xl border border-border bg-surface/40 p-6 backdrop-blur-sm">
            <div className="space-y-5">
                {entries.map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between gap-8 py-1">
                        <label className="text-sm font-medium text-zinc-200 font-mono shrink-0">{key}</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={value}
                                onChange={e => setValues(v => ({...v, [key]: e.target.value}))}
                                className="rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-white w-64 focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none transition-all duration-200"
                            />
                            <button
                                onClick={() => handleSave(key)}
                                disabled={saving[key]}
                                className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                                    saved[key]
                                        ? "bg-success/10 text-success border border-success/20"
                                        : "bg-accent text-white hover:bg-accent-hover shadow-sm shadow-accent/10"
                                }`}
                            >
                                {saving[key] ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    : saved[key] ? <Check className="w-3.5 h-3.5" />
                                    : <Save className="w-3.5 h-3.5" />}
                                {saved[key] ? "Saved" : "Save"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

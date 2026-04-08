"use client"

import {useState} from "react"
import {Save, Loader2, Check} from "lucide-react"
import {SearchableSelect} from "./SearchableSelect"

interface ManagementChoice { name: string; value: string }
interface ManagementField { key: string; type: string; label: string; description?: string; choices?: ManagementChoice[] }
interface ManagementSection { title: string; fields: ManagementField[] }
interface DiscordData { channels: {id: string, name: string}[]; roles: {id: string, name: string, color: string}[] }
interface Props { section: ManagementSection; values: Record<string, string | null>; guildId: string; discordData: DiscordData }

const inputClass = "rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-white w-64 focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none transition-all duration-200 placeholder:text-zinc-600"

export function SectionRenderer({section, values, guildId, discordData}: Props) {
    const [localValues, setLocalValues] = useState<Record<string, string>>(
        Object.fromEntries(section.fields.map(f => [f.key, values[f.key] ?? ""]))
    )
    const [saving, setSaving] = useState<Record<string, boolean>>({})
    const [saved, setSaved] = useState<Record<string, boolean>>({})


    async function handleSave(key: string, value: string) {
        setSaving(s => ({...s, [key]: true}))
        await fetch(`/api/settings/${guildId}`, {
            method: "POST", headers: {"Content-Type": "application/json"},
            body: JSON.stringify({key, value})
        })
        setSaving(s => ({...s, [key]: false}))
        setSaved(s => ({...s, [key]: true}))
        setTimeout(() => setSaved(s => ({...s, [key]: false})), 2000)
    }

    function SaveBtn({fieldKey}: {fieldKey: string}) {
        return (
            <button
                onClick={() => handleSave(fieldKey, localValues[fieldKey])}
                disabled={saving[fieldKey]}
                className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    saved[fieldKey]
                        ? "bg-success/10 text-success border border-success/20"
                        : "bg-accent text-white hover:bg-accent-hover shadow-sm shadow-accent/10"
                }`}
            >
                {saving[fieldKey] ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : saved[fieldKey] ? <Check className="w-3.5 h-3.5" />
                        : <Save className="w-3.5 h-3.5" />}
                {saved[fieldKey] ? "Saved" : "Save"}
            </button>
        )
    }

    function renderSearchableSelect(fieldKey: string, options: {value: string, label: string, color?: string}[], placeholder: string) {
        return (
            <div className="flex items-center gap-2">
                <SearchableSelect
                    value={localValues[fieldKey] ?? ""}
                    onChange={val => setLocalValues(v => ({...v, [fieldKey]: val}))}
                    options={options}
                    placeholder={placeholder}
                    className="w-64"
                />
                <SaveBtn fieldKey={fieldKey} />
            </div>
        )
    }

    function renderField(field: ManagementField) {
        if (field.type === "boolean") {
            return (
                <button
                    onClick={() => {
                        const newVal = localValues[field.key] === "true" ? "false" : "true"
                        setLocalValues(v => ({...v, [field.key]: newVal}))
                        handleSave(field.key, newVal)
                    }}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${
                        localValues[field.key] === "true" ? "bg-accent shadow-sm shadow-accent/20" : "bg-zinc-800 border border-border"
                    }`}
                >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-all duration-300 shadow-sm ${
                        localValues[field.key] === "true" ? "translate-x-6" : "translate-x-1"
                    }`} />
                </button>
            )
        }
        if (field.type === "channel") return renderSearchableSelect(field.key, discordData.channels.map(c => ({value: c.id, label: `# ${c.name}`})), "Select channel...")
        if (field.type === "role") return renderSearchableSelect(field.key, discordData.roles.map(r => ({value: r.id, label: `@ ${r.name}`, color: r.color === "#000000" ? "#99aab5" : r.color})), "Select role...")
        if (field.choices) return renderSearchableSelect(field.key, field.choices.map(c => ({value: c.value, label: c.name})), "Select...")
        return (
            <div className="flex items-center gap-2">
                <input type={field.type === "number" ? "number" : "text"} value={localValues[field.key] ?? ""}
                    onChange={e => setLocalValues(v => ({...v, [field.key]: e.target.value}))}
                    className={inputClass} />
                <SaveBtn fieldKey={field.key} />
            </div>
        )
    }

    return (
        <div className="rounded-2xl border border-border bg-surface/40 p-6 mb-5 backdrop-blur-sm">
            <h3 className="text-base font-semibold text-white mb-6">{section.title}</h3>
            <div className="space-y-5">
                {section.fields.map(field => (
                    <div key={field.key} className="flex items-center justify-between gap-8 py-1">
                        <div className="min-w-0">
                            <label className="text-sm font-medium text-zinc-200">{field.label}</label>
                            {field.description && <p className="text-xs text-muted mt-0.5">{field.description}</p>}
                        </div>
                        {renderField(field)}
                    </div>
                ))}
            </div>
        </div>
    )
}

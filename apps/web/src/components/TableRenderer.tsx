"use client"

import {useState, useCallback} from "react"
import {Plus, Pencil, Trash2, Check, X, Loader2} from "lucide-react"
import {SearchableSelect} from "./SearchableSelect"

interface ManagementChoice { name: string; value: string }
interface ManagementTableColumn { key: string; type: string; label: string; choices?: ManagementChoice[]; unique?: boolean }
interface ManagementTable { title: string; description?: string; entity: string; columns: ManagementTableColumn[] }
interface DiscordData { channels: {id: string, name: string}[]; roles: {id: string, name: string, color: string}[] }
interface Props { table: ManagementTable; data: Record<string, unknown>[]; guildId: string; discordData: DiscordData }

const fieldClass = "rounded-xl border border-border bg-surface px-2.5 py-2 text-sm text-white w-full focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none transition-all duration-200"

export function TableRenderer({table, data, guildId, discordData}: Props) {
    const [rows, setRows] = useState(Array.isArray(data) ? data : [])
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [editRow, setEditRow] = useState<Record<string, string>>({})
    const [newRow, setNewRow] = useState<Record<string, string>>(Object.fromEntries(table.columns.map(c => [c.key, ""])))
    const [saving, setSaving] = useState(false)

    const getUsedValues = useCallback((col: ManagementTableColumn, excludeIndex?: number): Set<string> => {
        if (!col.unique) return new Set()
        return new Set(rows.filter((_, i) => i !== excludeIndex).map(r => String(r[col.key] ?? "")))
    }, [rows])

    function getDisplayValue(col: ManagementTableColumn, val: string): React.ReactNode {
        if (col.choices) return col.choices.find(c => c.value === val)?.name ?? val
        if (col.type === "channel") { const ch = discordData.channels.find(c => c.id === val); return ch ? `# ${ch.name}` : val }
        if (col.type === "role") {
            const r = discordData.roles.find(r => r.id === val)
            if (!r) return val
            const color = r.color === "#000000" ? "#99aab5" : r.color
            return <span style={{color}}>@ {r.name}</span>
        }
        return val
    }

    function renderField(col: ManagementTableColumn, value: string, onChange: (val: string) => void, excludeIndex?: number) {
        const used = getUsedValues(col, excludeIndex)
        if (col.choices) return (
            <SearchableSelect value={value} onChange={onChange} placeholder="Select..." className="w-full"
                options={col.choices.filter(c => !used.has(c.value) || c.value === value).map(c => ({value: c.value, label: c.name}))} />)
        if (col.type === "channel") return (
            <SearchableSelect value={value} onChange={onChange} placeholder="Select channel..." className="w-full"
                options={discordData.channels.filter(c => !used.has(c.id) || c.id === value).map(c => ({value: c.id, label: `# ${c.name}`}))} />)
        if (col.type === "role") return (
            <SearchableSelect value={value} onChange={onChange} placeholder="Select role..." className="w-full"
                options={discordData.roles.filter(r => !used.has(r.id) || r.id === value).map(r => ({value: r.id, label: `@ ${r.name}`, color: r.color === "#000000" ? "#99aab5" : r.color}))} />)
        return <input type={col.type === "number" ? "number" : "text"} value={value}
            onChange={e => onChange(e.target.value)} className={fieldClass} placeholder={col.label} />
    }

    async function handleAdd() {
        setSaving(true)
        const res = await fetch(`/api/entities/${guildId}/${table.entity}`, {
            method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(newRow)
        })
        if (res.ok) { setRows([...rows, {...newRow}]); setNewRow(Object.fromEntries(table.columns.map(c => [c.key, ""]))) }
        setSaving(false)
    }

    async function handleSaveEdit(index: number) {
        setSaving(true)
        const oldId = String(rows[index][table.columns[0].key])
        await fetch(`/api/entities/${guildId}/${table.entity}/${oldId}`, {method: "DELETE"})
        const res = await fetch(`/api/entities/${guildId}/${table.entity}`, {
            method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(editRow)
        })
        if (res.ok) { const updated = [...rows]; updated[index] = {...editRow}; setRows(updated) }
        setEditingIndex(null); setSaving(false)
    }

    async function handleDelete(row: Record<string, unknown>, index: number) {
        const id = String(row[table.columns[0].key])
        const res = await fetch(`/api/entities/${guildId}/${table.entity}/${id}`, {method: "DELETE"})
        if (res.ok) { setRows(rows.filter((_, i) => i !== index)); if (editingIndex === index) setEditingIndex(null) }
    }

    function startEdit(row: Record<string, unknown>, index: number) {
        setEditRow(Object.fromEntries(table.columns.map(c => [c.key, String(row[c.key] ?? "")])))
        setEditingIndex(index)
    }

    const iconBtn = (onClick: () => void, icon: React.ReactNode, variant: "accent" | "danger" | "success" | "muted", title: string, disabled = false) => (
        <button onClick={onClick} disabled={disabled} title={title}
            className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
                variant === "accent" ? "text-accent-text hover:bg-accent-soft" :
                variant === "danger" ? "text-danger hover:bg-danger/10" :
                variant === "success" ? "text-success hover:bg-success/10" :
                "text-muted hover:bg-surface-hover hover:text-white"
            }`}>
            {icon}
        </button>
    )

    return (
        <div className="rounded-2xl border border-border bg-surface/40 p-6 mb-5 backdrop-blur-sm">
            <div className="mb-5">
                <h3 className="text-base font-semibold text-white">{table.title}</h3>
                {table.description && <p className="text-sm text-muted mt-1">{table.description}</p>}
            </div>
            <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm table-fixed">
                    <thead>
                        <tr className="bg-surface">
                            {table.columns.map(col => (
                                <th key={col.key} className="text-left py-3 px-4 text-[11px] font-semibold text-foreground/60 uppercase tracking-widest">{col.label}</th>
                            ))}
                            <th className="w-28" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {rows.map((row, i) => (
                            <tr key={i} className="group hover:bg-surface-hover/30 transition-colors duration-150">
                                {editingIndex === i ? (
                                    <>
                                        {table.columns.map(col => (
                                            <td key={col.key} className="py-2 px-5">
                                                {renderField(col, editRow[col.key] ?? "", val => setEditRow(r => ({...r, [col.key]: val})), i)}
                                            </td>
                                        ))}
                                        <td className="py-2 px-5">
                                            <div className="flex items-center gap-0.5">
                                                {iconBtn(() => handleSaveEdit(i),
                                                    saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />,
                                                    "success", "Save", saving)}
                                                {iconBtn(() => setEditingIndex(null), <X className="w-4 h-4" />, "muted", "Cancel")}
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        {table.columns.map(col => {
                                            const val = String(row[col.key] ?? "")
                                            return <td key={col.key} className="py-3.5 px-4 text-foreground">{getDisplayValue(col, val)}</td>
                                        })}
                                        <td className="py-2 px-5">
                                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                {iconBtn(() => startEdit(row, i), <Pencil className="w-3.5 h-3.5" />, "accent", "Edit")}
                                                {iconBtn(() => handleDelete(row, i), <Trash2 className="w-3.5 h-3.5" />, "danger", "Delete")}
                                            </div>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                        <tr className="bg-accent-soft/30">
                            {table.columns.map(col => (
                                <td key={col.key} className="py-2.5 px-5">
                                    {renderField(col, newRow[col.key], val => setNewRow(r => ({...r, [col.key]: val})))}
                                </td>
                            ))}
                            <td className="py-2.5 px-5">
                                <button onClick={handleAdd} disabled={saving}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50 transition-all duration-200 shadow-sm shadow-accent/10">
                                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                                    Add
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

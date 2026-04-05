"use client"

import {useState, useRef, useEffect, useCallback} from "react"
import {createPortal} from "react-dom"
import {ChevronDown, Search} from "lucide-react"

interface Option {
    value: string
    label: string
    color?: string
}

interface Props {
    options: Option[]
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
}

export function SearchableSelect({options, value, onChange, placeholder = "Select...", className = ""}: Props) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({})
    const triggerRef = useRef<HTMLButtonElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const selected = options.find(o => o.value === value)
    const filtered = search
        ? options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
        : options

    const updatePosition = useCallback(() => {
        if (!triggerRef.current) return
        const rect = triggerRef.current.getBoundingClientRect()
        setDropdownStyle({
            position: "fixed",
            top: rect.bottom + 6,
            left: rect.left,
            width: rect.width,
            zIndex: 9999
        })
    }, [])

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (triggerRef.current?.contains(e.target as Node)) return
            if (dropdownRef.current?.contains(e.target as Node)) return
            setOpen(false)
            setSearch("")
        }
        document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [])

    useEffect(() => {
        if (open) {
            requestAnimationFrame(() => {
                updatePosition()
                inputRef.current?.focus({preventScroll: true})
            })
        }
    }, [open, updatePosition])

    useEffect(() => {
        if (!open) return
        window.addEventListener("scroll", updatePosition, true)
        window.addEventListener("resize", updatePosition)
        return () => {
            window.removeEventListener("scroll", updatePosition, true)
            window.removeEventListener("resize", updatePosition)
        }
    }, [open, updatePosition])

    const dropdown = open && (
        <div ref={dropdownRef} style={dropdownStyle}
            className="rounded-xl border border-border bg-surface shadow-2xl shadow-black/50 overflow-hidden animate-[dropdown_150ms_ease-out]">
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border">
                <Search className="w-3.5 h-3.5 text-muted shrink-0" />
                <input
                    ref={inputRef}
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
                />
            </div>
            <div className="max-h-52 overflow-y-auto py-1">
                {filtered.length === 0 ? (
                    <div className="px-3 py-3 text-sm text-muted text-center">No results</div>
                ) : (
                    filtered.map(option => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => { onChange(option.value); setOpen(false); setSearch("") }}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors duration-100 ${
                                option.value === value
                                    ? "bg-accent-soft text-accent-text"
                                    : "text-zinc-300 hover:bg-surface-hover"
                            }`}
                        >
                            <span className="truncate" style={option.color && option.value !== value ? {color: option.color} : {}}>{option.label}</span>
                        </button>
                    ))
                )}
            </div>
        </div>
    )

    return (
        <div className={className}>
            <button
                ref={triggerRef}
                type="button"
                onClick={() => { setOpen(!open); setSearch("") }}
                className="w-full flex items-center justify-between gap-2 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-left transition-all duration-200 hover:border-border-hover focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none"
            >
                {selected ? (
                    <span className="truncate" style={selected.color ? {color: selected.color} : {}}>{selected.label}</span>
                ) : (
                    <span className="text-zinc-500">{placeholder}</span>
                )}
                <ChevronDown className={`w-3.5 h-3.5 text-muted shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </button>
            {open && typeof window !== "undefined" && createPortal(dropdown, document.body)}
        </div>
    )
}

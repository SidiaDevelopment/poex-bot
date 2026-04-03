const CURRENCY_EMOJIS: Record<string, string> = {
    r: "<:regal:531610117339217943> ",
    alch: "<:alchemy:531610116491968523> ",
    c: "<:chaos:531610116437573633> ",
    ex: "<:exalt:531610117158993941>",
    d: "<:divine:531610115229483037> "
}

export function formatPrice(value?: number, type?: string): string {
    if (value === undefined || type === undefined) return "Free"
    const emoji = CURRENCY_EMOJIS[type.toLowerCase()] ?? type
    return `${value} ${emoji}`
}

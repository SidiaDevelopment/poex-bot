const EMOJIS: Record<string, string> = {
    regal: "<:regal:531610117339217943>",
    alchemy: "<:alchemy:531610116491968523>",
    alch: "<:alchemy:531610116491968523>",
    chaos: "<:chaos:531610116437573633>",
    c: "<:chaos:531610116437573633>",
    exalt: "<:exalt:531610117158993941>",
    exalted: "<:exalt:531610117158993941>",
    ex: "<:exalt:531610117158993941>",
    divine: "<:divine:531610115229483037>",
    div: "<:divine:531610115229483037>",
    d: "<:divine:531610115229483037>"
}

export function replaceCurrencyEmojis(text: string): string {
    return text.replace(/:([a-zA-Z]+):/g, (match, name) => EMOJIS[name.toLowerCase()] ?? match)
}

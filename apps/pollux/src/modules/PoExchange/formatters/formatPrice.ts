const CURRENCY_EMOJIS: Record<string, string> = {
    r: "<:regal_orb:REPLACE_WITH_ID>",
    alch: "<:orb_of_alchemy:REPLACE_WITH_ID>",
    c: "<:chaos_orb:1489607480270131200>",
    ex: "<:exalted_orb:REPLACE_WITH_ID>",
    d: "<:divine_orb:1489607521227378748>"
}

export function formatPrice(value: number, type: string): string {
    const emoji = CURRENCY_EMOJIS[type.toLowerCase()] ?? type
    return `${value} ${emoji}`
}

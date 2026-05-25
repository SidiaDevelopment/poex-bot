// PoE2 channels reuse the shared price/customMessage formatters, which emit the
// PoE1 currency emojis (via formatPrice and replaceCurrencyEmojis). Swap those
// for the PoE2 variants in the final embed text for PoE2 channels.
const POE2_CURRENCY_SWAPS: Record<string, string> = {
    "<:chaos:531610116437573633>": "<:chaos_poe2:1326922403569336453>",
    "<:exalt:531610117158993941>": "<:exalted_poe2:1326922041596837964>",
    "<:divine:531610115229483037>": "<:divine_poe2:1326922171481722912>"
}

export function applyPoe2Currency(text: string): string {
    let result = text
    for (const [poe1, poe2] of Object.entries(POE2_CURRENCY_SWAPS)) {
        result = result.split(poe1).join(poe2)
    }
    return result
}

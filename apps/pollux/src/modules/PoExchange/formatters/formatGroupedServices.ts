import {IPoExchangeService} from "./IPoExchangeFormatter"
import {formatPrice} from "./formatPrice"
import {replaceCurrencyEmojis} from "./replaceCurrencyEmojis"
import {translate, LocalizationTag} from "@pollux/i18n"

const MAP_TYPES = ["Buyer", "Seller", "Both"] as const

// Renders a service list, grouped under Your Map / My Map / Both when services
// carry a mapType (boss/map categories), and as a plain list otherwise
// (services without a mapType, e.g. crafting/leveling). Mirrors the PoE1
// boss/nightmare layout so it stays consistent across games.
export function formatGroupedServices(services: IPoExchangeService[]): string[] {
    const lines: string[] = []

    const renderService = (service: IPoExchangeService): void => {
        lines.push(`**${service.name}** - ${formatPrice(service.priceValue, service.priceType)}`)
        if (service.customMessage) {
            lines.push(`> ${replaceCurrencyEmojis(service.customMessage)}`)
        }
    }

    const renderSection = (label: LocalizationTag, list: IPoExchangeService[]): void => {
        if (list.length === 0) return
        lines.push("")
        lines.push(`__${translate(label)}__`)
        for (const service of list) renderService(service)
    }

    const ungrouped = services.filter(s => !MAP_TYPES.includes((s.mapType ?? "") as typeof MAP_TYPES[number]))
    for (const service of ungrouped) renderService(service)

    renderSection("poex.format.mapType.buyer", services.filter(s => s.mapType === "Buyer"))
    renderSection("poex.format.mapType.seller", services.filter(s => s.mapType === "Seller"))
    renderSection("poex.format.mapType.both", services.filter(s => s.mapType === "Both"))

    return lines
}

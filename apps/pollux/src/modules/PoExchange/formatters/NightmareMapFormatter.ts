import {EmbedBuilder} from "discord.js"
import {IPoExchangeFormatter, IPoExchangeUser, IPoExchangeService} from "./IPoExchangeFormatter"
import {formatPrice} from "./formatPrice"
import {translate} from "@pollux/i18n"

export class NightmareMapFormatter implements IPoExchangeFormatter {
    public format(embed: EmbedBuilder, user: IPoExchangeUser, services: IPoExchangeService[]): void {
        const seller = user.discordId ? `${user.name} (<@${user.discordId}>)` : user.name

        const buyerMap = services.filter(s => s.mapType === "Buyer")
        const sellerMap = services.filter(s => s.mapType === "Seller")
        const bothMap = services.filter(s => s.mapType === "Both")

        const lines: string[] = []
        lines.push(`${translate("poex.format.seller")}: ${seller} | ${user.vouches} ${translate("poex.format.vouches")}`)

        if (buyerMap.length > 0) {
            lines.push("")
            lines.push(`__${translate("poex.format.mapType.buyer")}__`)
            for (const s of buyerMap) {
                let line = `**${s.name}** - ${formatPrice(s.priceValue, s.priceType)}`
                if (s.customMessage) line += `\n> ${s.customMessage}`
                lines.push(line)
            }
        }

        if (sellerMap.length > 0) {
            lines.push("")
            lines.push(`__${translate("poex.format.mapType.seller")}__`)
            for (const s of sellerMap) {
                let line = `**${s.name}** - ${formatPrice(s.priceValue, s.priceType)}`
                if (s.customMessage) line += `\n> ${s.customMessage}`
                lines.push(line)
            }
        }

        if (bothMap.length > 0) {
            lines.push("")
            lines.push(`__${translate("poex.format.mapType.both")}__`)
            for (const s of bothMap) {
                let line = `**${s.name}** - ${formatPrice(s.priceValue, s.priceType)}`
                if (s.customMessage) line += `\n> ${s.customMessage}`
                lines.push(line)
            }
        }

        lines.push("")
        lines.push(`\`\`\`@${user.name} ${translate("poex.format.whispers.nightmareMaps")}\`\`\``)

        lines.push(translate("poex.format.exchangeLink"))

        embed.setTitle(translate("poex.format.titles.nightmareMaps"))
        embed.setURL(translate("poex.format.exchangeUrl"))
        embed.setDescription(lines.join("\n"))
    }
}

import {EmbedBuilder} from "discord.js"
import {IPoExchangeFormatter, IPoExchangeUser, IPoExchangeService, IPoExchangeLinks} from "./IPoExchangeFormatter"
import {formatPrice} from "./formatPrice"
import {formatLinks} from "./formatLinks"
import {translate} from "@pollux/i18n"

export class BloodlinesFormatter implements IPoExchangeFormatter {
    public format(embed: EmbedBuilder, user: IPoExchangeUser, services: IPoExchangeService[], links: IPoExchangeLinks): void {
        const seller = user.discordId ? `\`${user.name}\` (<@${user.discordId}>)` : `\`${user.name}\``

        const buyerMap = services.filter(s => s.mapType === "Buyer")
        const sellerMap = services.filter(s => s.mapType === "Seller")
        const bothMap = services.filter(s => s.mapType === "Both")

        const lines: string[] = []
        lines.push(`${translate("poex.format.seller")}: ${seller} | ${user.vouches} ${translate("poex.format.vouches")}`)

        if (buyerMap.length > 0) {
            lines.push("")
            lines.push(`__${translate("poex.format.mapType.buyer")}__`)
            for (const s of buyerMap) {
                lines.push(`**${s.name}** - ${formatPrice(s.priceValue, s.priceType)}`)
            }
        }

        if (sellerMap.length > 0) {
            lines.push("")
            lines.push(`__${translate("poex.format.mapType.seller")}__`)
            for (const s of sellerMap) {
                lines.push(`**${s.name}** - ${formatPrice(s.priceValue, s.priceType)}`)
            }
        }

        if (bothMap.length > 0) {
            lines.push("")
            lines.push(`__${translate("poex.format.mapType.both")}__`)
            for (const s of bothMap) {
                lines.push(`**${s.name}** - ${formatPrice(s.priceValue, s.priceType)}`)
            }
        }

        lines.push("")
        lines.push(`\`\`\`@${user.name} ${translate("poex.format.whispers.bloodlines")}\`\`\``)

        lines.push(formatLinks(links))

        embed.setTitle(translate("poex.format.titles.bloodlines"))
        embed.setDescription(lines.join("\n"))
    }
}

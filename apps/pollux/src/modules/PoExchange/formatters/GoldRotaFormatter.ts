import {EmbedBuilder} from "discord.js"
import {IPoExchangeFormatter, IPoExchangeUser, IPoExchangeService, IPoExchangeLinks} from "./IPoExchangeFormatter"
import {formatPrice} from "./formatPrice"
import {formatLinks} from "./formatLinks"
import {replaceCurrencyEmojis} from "./replaceCurrencyEmojis"
import {translate} from "@pollux/i18n"

export class GoldRotaFormatter implements IPoExchangeFormatter {
    public sellerLabel = "host" as const

    public format(embed: EmbedBuilder, user: IPoExchangeUser, services: IPoExchangeService[], links: IPoExchangeLinks): void {
        const lines: string[] = []

        for (const service of services) {
            let line = `**${service.name}** - ${formatPrice(service.priceValue, service.priceType)}`
            if (service.customMessage) line += `\n> ${replaceCurrencyEmojis(service.customMessage)}`
            lines.push(line)
        }

        lines.push("")
        lines.push(`\`\`\`@${user.name} ${translate("poex.format.whispers.goldRotation")}\`\`\``)

        lines.push(formatLinks(links))

        embed.setTitle(translate("poex.format.titles.goldRotation"))
        embed.setDescription(lines.join("\n"))
    }
}

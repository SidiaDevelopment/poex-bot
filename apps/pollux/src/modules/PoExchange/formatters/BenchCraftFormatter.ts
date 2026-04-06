import {EmbedBuilder} from "discord.js"
import {IPoExchangeFormatter, IPoExchangeUser, IPoExchangeService, IPoExchangeLinks} from "./IPoExchangeFormatter"
import {formatPrice} from "./formatPrice"
import {formatLinks} from "./formatLinks"
import {translate} from "@pollux/i18n"

export class BenchCraftFormatter implements IPoExchangeFormatter {
    public sellerLabel = "seller" as const

    public format(embed: EmbedBuilder, user: IPoExchangeUser, services: IPoExchangeService[], links: IPoExchangeLinks): void {
        const lines: string[] = []

        for (const service of services) {
            lines.push(`**${service.name}** - ${formatPrice(service.priceValue, service.priceType)}`)
        }

        lines.push("")
        lines.push(`\`\`\`@${user.name} ${translate("poex.format.whispers.benchCraft")}\`\`\``)
        lines.push(formatLinks(links))

        embed.setTitle(translate("poex.format.titles.benchCraft"))
        embed.setDescription(lines.join("\n"))
    }
}

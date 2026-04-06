import {EmbedBuilder} from "discord.js"
import {IPoExchangeFormatter, IPoExchangeUser, IPoExchangeService, IPoExchangeLinks} from "./IPoExchangeFormatter"
import {formatPrice} from "./formatPrice"
import {formatLinks} from "./formatLinks"
import {translate} from "@pollux/i18n"

export class TempleHostFormatter implements IPoExchangeFormatter {
    public sellerLabel = "host" as const

    public format(embed: EmbedBuilder, user: IPoExchangeUser, services: IPoExchangeService[], links: IPoExchangeLinks): void {
        const lines: string[] = []

        for (const service of services) {
            lines.push(`**${service.name}** - ${formatPrice(service.priceValue, service.priceType)}`)
        }

        lines.push("")
        lines.push(`\`\`\`@${user.name} ${translate("poex.format.whispers.templeHost")}\`\`\``)
        lines.push(formatLinks(links))

        embed.setTitle(translate("poex.format.titles.templeHost"))
        embed.setDescription(lines.join("\n"))
    }
}

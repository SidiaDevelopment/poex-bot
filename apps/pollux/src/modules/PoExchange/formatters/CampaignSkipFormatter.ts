import {EmbedBuilder} from "discord.js"
import {IPoExchangeFormatter, IPoExchangeUser, IPoExchangeService, IPoExchangeLinks} from "./IPoExchangeFormatter"
import {formatPrice} from "./formatPrice"
import {formatLinks} from "./formatLinks"
import {translate} from "@pollux/i18n"

export class CampaignSkipFormatter implements IPoExchangeFormatter {
    public format(embed: EmbedBuilder, user: IPoExchangeUser, services: IPoExchangeService[], links: IPoExchangeLinks): void {
        const seller = user.discordId ? `${user.name} (<@${user.discordId}>)` : user.name

        const lines: string[] = []
        lines.push(`${translate("poex.format.seller")}: ${seller} | ${user.vouches} ${translate("poex.format.vouches")}`)
        lines.push("")

        for (const service of services) {
            lines.push(`**${service.name}** - ${formatPrice(service.priceValue, service.priceType)}`)
        }

        lines.push("")
        lines.push(`\`\`\`@${user.name} ${translate("poex.format.whispers.campaignSkip")}\`\`\``)
        lines.push(formatLinks(links))

        embed.setTitle(translate("poex.format.titles.campaignSkip"))
        embed.setDescription(lines.join("\n"))
    }
}

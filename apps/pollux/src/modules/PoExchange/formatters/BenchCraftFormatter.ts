import {EmbedBuilder} from "discord.js"
import {IPoExchangeFormatter, IPoExchangeUser, IPoExchangeService} from "./IPoExchangeFormatter"
import {formatPrice} from "./formatPrice"
import {translate} from "@pollux/i18n"

export class BenchCraftFormatter implements IPoExchangeFormatter {
    public format(embed: EmbedBuilder, user: IPoExchangeUser, services: IPoExchangeService[]): void {
        const seller = user.discordId ? `${user.name} (<@${user.discordId}>)` : user.name

        const lines: string[] = []
        lines.push(`${translate("poex.format.seller")}: ${seller} | ${user.vouches} ${translate("poex.format.vouches")}`)
        lines.push("")

        for (const service of services) {
            lines.push(`**${service.name}** - ${formatPrice(service.priceValue, service.priceType)}`)
        }

        lines.push("")
        lines.push(`\`\`\`@${user.name} ${translate("poex.format.whispers.benchCraft")}\`\`\``)
        lines.push(translate("poex.format.exchangeLink"))

        embed.setTitle(translate("poex.format.titles.benchCraft"))
        embed.setURL(translate("poex.format.exchangeUrl"))
        embed.setDescription(lines.join("\n"))
    }
}

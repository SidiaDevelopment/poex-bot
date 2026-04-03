import {EmbedBuilder} from "discord.js"
import {IPoExchangeFormatter, IPoExchangeUser, IPoExchangeService, IPoExchangeLinks} from "./IPoExchangeFormatter"
import {formatPrice} from "./formatPrice"
import {formatLinks} from "./formatLinks"
import {translate} from "@pollux/i18n"

export class GoldRotaFormatter implements IPoExchangeFormatter {
    public format(embed: EmbedBuilder, user: IPoExchangeUser, services: IPoExchangeService[], links: IPoExchangeLinks): void {
        const host = user.discordId ? `${user.name} (<@${user.discordId}>)` : user.name

        const lines: string[] = []
        lines.push(`${translate("poex.format.host")}: ${host} | ${user.vouches} ${translate("poex.format.vouches")}`)
        lines.push("")

        for (const service of services) {
            let line = `**${service.name}** - ${formatPrice(service.priceValue, service.priceType)}`
            if (service.customMessage) line += `\n> ${service.customMessage}`
            lines.push(line)
        }

        lines.push("")
        lines.push(`\`\`\`@${user.name} ${translate("poex.format.whispers.goldRotation")}\`\`\``)

        lines.push(formatLinks(links))

        embed.setTitle(translate("poex.format.titles.goldRotation"))
        embed.setDescription(lines.join("\n"))
    }
}

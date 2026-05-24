import {EmbedBuilder} from "discord.js"
import {IPoExchangeFormatter, IPoExchangeUser, IPoExchangeService, IPoExchangeLinks, SellerLabel} from "./IPoExchangeFormatter"
import {formatPrice} from "./formatPrice"
import {formatLinks} from "./formatLinks"
import {replaceCurrencyEmojis} from "./replaceCurrencyEmojis"
import {translate, LocalizationTag} from "@pollux/i18n"

// PoE2 service categories share a single list layout and only differ by their
// title and whisper wording, so they are configured per channel rather than
// getting one near-identical formatter class each.
export class Poe2ServiceFormatter implements IPoExchangeFormatter {
    public constructor(
        private readonly titleKey: LocalizationTag,
        private readonly whisperKey: LocalizationTag,
        public readonly sellerLabel: SellerLabel = "seller"
    ) {}

    public format(embed: EmbedBuilder, user: IPoExchangeUser, services: IPoExchangeService[], links: IPoExchangeLinks): void {
        const lines: string[] = []

        for (const service of services) {
            lines.push(`**${service.name}** - ${formatPrice(service.priceValue, service.priceType)}`)
            if (service.customMessage) {
                lines.push(`> ${replaceCurrencyEmojis(service.customMessage)}`)
            }
        }

        lines.push("")
        lines.push(`\`\`\`@${user.name} ${translate(this.whisperKey)}\`\`\``)
        lines.push(formatLinks(links))

        embed.setTitle(translate(this.titleKey))
        embed.setDescription(lines.join("\n"))
    }
}

import {EmbedBuilder} from "discord.js"
import {IPoExchangeFormatter, IPoExchangeUser, IPoExchangeService, IPoExchangeLinks, SellerLabel} from "./IPoExchangeFormatter"
import {formatLinks} from "./formatLinks"
import {formatGroupedServices} from "./formatGroupedServices"
import {translate, LocalizationTag} from "@pollux/i18n"

// Want-to-buy posts: the poster is the buyer, so the header is labelled for a
// buyer and there is no vouch button (the seller who answers is the one to be
// vouched). Services are grouped by mapType (Your Map / My Map / Both) when
// present, or listed plainly otherwise.
export class WtbServiceFormatter implements IPoExchangeFormatter {
    public readonly sellerLabel: SellerLabel = "buyer"
    public readonly vouchable = false

    public constructor(
        private readonly titleKey: LocalizationTag,
        private readonly whisperKey: LocalizationTag
    ) {}

    public format(embed: EmbedBuilder, user: IPoExchangeUser, services: IPoExchangeService[], links: IPoExchangeLinks): void {
        const lines = formatGroupedServices(services)

        lines.push("")
        lines.push(`\`\`\`@${user.name} ${translate(this.whisperKey)}\`\`\``)
        lines.push(formatLinks(links))

        embed.setTitle(translate(this.titleKey))
        embed.setDescription(lines.join("\n"))
    }
}

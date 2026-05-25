import {EmbedBuilder} from "discord.js"
import {IPoExchangeFormatter, IPoExchangeUser, IPoExchangeService, IPoExchangeLinks, SellerLabel} from "./IPoExchangeFormatter"
import {formatLinks} from "./formatLinks"
import {formatGroupedServices} from "./formatGroupedServices"
import {translate, LocalizationTag} from "@pollux/i18n"

// PoE2 service categories share a single layout and only differ by their title
// and whisper wording, so they are configured per channel rather than getting
// one near-identical formatter class each. Services are grouped by mapType
// (Your Map / My Map / Both) when present, or listed plainly otherwise.
export class Poe2ServiceFormatter implements IPoExchangeFormatter {
    public constructor(
        private readonly titleKey: LocalizationTag,
        private readonly whisperKey: LocalizationTag,
        public readonly sellerLabel: SellerLabel = "seller"
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

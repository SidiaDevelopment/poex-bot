import {translate} from "@pollux/i18n"
import {IPoExchangeLinks} from "./IPoExchangeFormatter"

export function formatLinks(links: IPoExchangeLinks): string {
    const parts: string[] = []
    if (links.browseUrl) parts.push(`[${translate("poex.format.browseServices")}](${links.browseUrl})`)
    if (links.listUrl) parts.push(`[${translate("poex.format.listServices")}](${links.listUrl})`)
    return parts.join(" | ")
}

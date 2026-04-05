import {translate} from "@pollux/i18n"
import {VouchResponse} from "../types/VouchTypes"

export function formatVouchMessage(voucherUserId: string, data: VouchResponse): string {
    const mention = data.discordId ? `<@${data.discordId}>` : data.username
    return `<@${voucherUserId}> ${translate("poex.vouch.channelMessage")} **${data.username}** (${mention}) — ${data.uniqueVouches} ${translate("poex.vouch.uniqueVouches")} (${data.totalVouches} ${translate("poex.vouch.totalVouches")})`
}

export function formatVouchCount(data: VouchResponse): string {
    return `**${data.username}** — **${data.uniqueVouches}** ${translate("poex.vouch.uniqueVouches")} (**${data.totalVouches}** ${translate("poex.vouch.totalVouches")})`
}

export function formatVouchError(connectUrl: string): string {
    return `${translate("poex.vouch.noLinkedAccount")} ${connectUrl}`
}

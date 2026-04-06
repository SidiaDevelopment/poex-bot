import {translate} from "@pollux/i18n"
import {ConfigContext} from "@pollux/config"
import {useContext} from "@pollux/core"
import {Colors, EmbedBuilder, GuildMember, User} from "discord.js"
import {VouchResponse} from "../types/VouchTypes"

export function formatVouchMessage(voucherUserId: string, data: VouchResponse): string {
    const sender = `<@${voucherUserId}>`
    return formatVouchMessageFromSender(sender, data)
}

export function formatVouchMessageFromSender(sender: string, data: VouchResponse): string {
    const target = data.discordId
        ? `**${data.username}** (<@${data.discordId}>)`
        : `**${data.username}**`
    return `${sender} ${translate("poex.vouch.channelMessage")} ${target} — ${data.uniqueVouches} ${translate("poex.vouch.uniqueVouches")} (${data.totalVouches} ${translate("poex.vouch.totalVouches")})`
}

export function formatVouchCountEmbed(data: VouchResponse, user?: User, member?: GuildMember | null): EmbedBuilder {
    const embed = new EmbedBuilder().setColor(Colors.Blue)

    embed.setTitle(data.username)
    if (data.joinDate) {
        embed.setDescription(`${translate("poex.vouch.memberSince")} ${formatRelativeTime(new Date(data.joinDate))}`)
    }

    if (user) {
        embed.setThumbnail(user.displayAvatarURL())
    }

    const linked = data.discordId
        ? `<@${data.discordId}>`
        : translate("poex.vouch.no")

    embed.addFields(
        {name: translate("poex.vouch.discordLinked"), value: linked, inline: true},
        {name: translate("poex.vouch.discordAccountAge"), value: user ? formatRelativeTime(user.createdAt) : "-", inline: true},
        {name: translate("poex.vouch.discordJoinDate"), value: member?.joinedAt ? formatRelativeTime(member.joinedAt) : "-", inline: true},
        {name: data.currentCycle ? `${translate("poex.vouch.seasonVouches")} (${data.currentCycle})` : translate("poex.vouch.seasonVouches"), value: `${data.seasonVouches}`, inline: true},
        {name: translate("poex.vouch.uniqueVouches"), value: `${data.uniqueVouches}`, inline: true},
        {name: translate("poex.vouch.totalVouches"), value: `${data.totalVouches}`, inline: true}
    )

    return embed
}

function formatRelativeTime(date: Date): string {
    return `<t:${Math.floor(date.getTime() / 1000)}:R>`
}

export function formatVouchSaved(amount: number): string {
    const {poExchange: {connectUrl}} = useContext(ConfigContext)
    return `${translate("poex.vouch.vouchSaved" as never).replace("{amount}", String(amount))} [${translate("poex.vouch.linkDiscord" as never)}](${connectUrl})`
}

export function formatVouchError(): string {
    const {poExchange: {connectUrl}} = useContext(ConfigContext)
    return `${translate("poex.vouch.noLinkedAccount")} [${translate("poex.vouch.linkDiscord")}](${connectUrl})`
}

export function formatUserNotFoundError(): string {
    const {poExchange: {connectUrl}} = useContext(ConfigContext)
    return `${translate("poex.vouch.userNotFound")} [${translate("poex.vouch.linkDiscord")}](${connectUrl})`
}

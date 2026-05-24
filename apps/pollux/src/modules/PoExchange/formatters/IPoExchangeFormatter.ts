import {EmbedBuilder} from "discord.js"

export interface IPoExchangeService {
    name: string
    priceValue?: number
    priceType?: string
    customMessage?: string
    mapType?: string
}

export interface IPoExchangeUser {
    name: string
    discordId?: string
    vouches: number
}

export interface IPoExchangeLinks {
    browseUrl?: string
    listUrl?: string
}

export type SellerLabel = "seller" | "host" | "buyer"

export interface IPoExchangeFormatter {
    sellerLabel: SellerLabel
    // Defaults to vouchable when omitted; WTB formatters set this false so the
    // vouch button is suppressed on buy-side posts.
    vouchable?: boolean
    format(embed: EmbedBuilder, user: IPoExchangeUser, services: IPoExchangeService[], links: IPoExchangeLinks): void
}

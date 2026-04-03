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

export interface IPoExchangeFormatter {
    format(embed: EmbedBuilder, user: IPoExchangeUser, services: IPoExchangeService[]): void
}

import {ChatInputCommandInteraction, Guild, TextBasedChannel, User} from "discord.js"

export interface IDiscordCommandData {
    user: User
    interaction: ChatInputCommandInteraction
    channel?: TextBasedChannel
    guild?: Guild
}

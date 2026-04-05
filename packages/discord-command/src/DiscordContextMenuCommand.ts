import {ApplicationCommandType, UserContextMenuCommandInteraction} from "discord.js"

export interface IDiscordContextMenuCommand {
    name: string
    type: ApplicationCommandType.User | ApplicationCommandType.Message
    defaultMemberPermissions?: bigint
    adminOnly?: boolean
}

export abstract class DiscordContextMenuCommand {
    public config!: IDiscordContextMenuCommand

    public abstract handle(interaction: UserContextMenuCommandInteraction): Promise<void>
}

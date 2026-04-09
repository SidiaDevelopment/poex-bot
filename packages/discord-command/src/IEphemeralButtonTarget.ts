import {MessageEditOptions} from "discord.js"

export interface IEphemeralButtonTarget {
    edit(payload: MessageEditOptions): Promise<unknown>
    disableButton(customId: string): Promise<void>
}

import {ButtonInteraction} from "discord.js"
import {IDiscordButton} from "./IDiscordButtonConfig"

export abstract class DiscordButton {
    public config!: IDiscordButton

    public abstract handle(interaction: ButtonInteraction): Promise<void>
}

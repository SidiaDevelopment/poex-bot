import {ControllerContext, useContext} from "@pollux/core"
import {LogLevel} from "@pollux/logging"
import {DiscordButton} from "./DiscordButton"

export class DiscordButtonController {
    private static buttons: Record<string, DiscordButton> = {}

    public static addButton(button: DiscordButton): void {
        if (!button.config) {
            const {loggingController} = useContext(ControllerContext)
            loggingController.log("@pollux/discord-command", LogLevel.Error, `Missing @button decorator on button ${button.constructor.name}`)
            return
        }

        DiscordButtonController.buttons[button.config.customId] = button
    }

    public static getButton(customId: string): DiscordButton | null {
        return DiscordButtonController.buttons[customId] ?? null
    }

    public static getAllButtons(): DiscordButton[] {
        return Object.values(DiscordButtonController.buttons)
    }
}

import {ControllerContext, useContext} from "@pollux/core"
import {LogLevel} from "@pollux/logging"
import {DiscordContextMenuCommand} from "./DiscordContextMenuCommand"

export class DiscordContextMenuController {
    private static commands: DiscordContextMenuCommand[] = []

    public static addCommand(command: DiscordContextMenuCommand): void {
        if (!command.config) {
            const {loggingController} = useContext(ControllerContext)
            loggingController.log("@pollux/discord-command", LogLevel.Error, `Missing @contextMenuCommand decorator on command ${command.constructor.name}`)
            return
        }

        DiscordContextMenuController.commands.push(command)
    }

    public static getAllCommands(): DiscordContextMenuCommand[] {
        return DiscordContextMenuController.commands
    }

    public static getCommand(name: string): DiscordContextMenuCommand | null {
        return DiscordContextMenuController.commands.find(cmd => cmd.config.name === name) ?? null
    }
}

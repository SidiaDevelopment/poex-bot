import {ControllerContext, useContext} from "@pollux/core"
import {LogLevel} from "@pollux/logging"
import {IDiscordCommandControllerData} from "./IDiscordCommandControllerData"
import {DiscordCommand} from "./DiscordCommand"
import {IDiscordCommandData} from "./IDiscordCommandData"

export class DiscordCommandController {
    private static commands: Record<string, IDiscordCommandControllerData> = {}

    public static addCommand(command: DiscordCommand<IDiscordCommandData>): void {
        if (!command.config) {
            const {loggingController} = useContext(ControllerContext)
            loggingController.log("@pollux/discord-command", LogLevel.Error, `Missing @command decorator on command ${command.constructor.name}`)
            return
        }

        const identifier = DiscordCommandController.getUniqueIdentifier(
            command.config.command,
            command.config.subCommand ?? null,
            command.config.subCommandGroup ?? null
        )

        DiscordCommandController.commands[identifier] = {
            instance: command,
            command: command.config.command,
            subCommand: command.config.subCommand ?? null,
            subCommandGroup: command.config.subCommandGroup ?? null
        }
    }

    public static getUniqueIdentifier(command: string, subCommand: string | null, subCommandGroup: string | null): string {
        let id = command
        if (subCommandGroup != null) id = `${id}_${subCommandGroup}`
        if (subCommand != null) id = `${id}_${subCommand}`

        return id
    }

    public static getAllCommands(): IDiscordCommandControllerData[] {
        return Object.values(DiscordCommandController.commands)
    }

    public static getCommand(command: string, subCommand: string | null, subCommandGroup: string | null): IDiscordCommandControllerData | null {
        const predicate = (element: IDiscordCommandControllerData) =>
            element.command == command && element.subCommand == subCommand && element.subCommandGroup == subCommandGroup
        return DiscordCommandController.findCommand(predicate)
    }

    public static findCommand(predicate: (element: IDiscordCommandControllerData) => boolean): IDiscordCommandControllerData | null {
        return Object.values(DiscordCommandController.commands).find(predicate) ?? null
    }
}

import {IDiscordContextMenuCommand, DiscordContextMenuCommand} from "../DiscordContextMenuCommand"
import {Ctor} from "@pollux/utils"
import {DiscordContextMenuController} from "../DiscordContextMenuController"

export const contextMenuCommand = (data: IDiscordContextMenuCommand) => {
    return (ctor: Ctor<DiscordContextMenuCommand>): void => {
        const instance = new ctor()
        instance.config = data
        DiscordContextMenuController.addCommand(instance)
    }
}

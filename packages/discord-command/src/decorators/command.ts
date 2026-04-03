import {IDiscordCommand} from "../IDiscordCommandConfig"
import {DiscordCommand} from "../DiscordCommand"
import {Ctor} from "@pollux/utils"
import {IDiscordCommandData} from "../IDiscordCommandData"
import {DiscordCommandController} from "../DiscordCommandController"

export const command = <T extends IDiscordCommandData>(data: IDiscordCommand<T>) => {
    return (ctor: Ctor<DiscordCommand<T>>): void => {
        const instance = new ctor()
        instance.config = data
        DiscordCommandController.addCommand(instance as unknown as DiscordCommand<IDiscordCommandData>)
    }
}

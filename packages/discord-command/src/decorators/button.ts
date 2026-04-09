import {Ctor} from "@pollux/utils"
import {DiscordButton} from "../DiscordButton"
import {IDiscordButton} from "../IDiscordButtonConfig"
import {DiscordButtonController} from "../DiscordButtonController"

export const button = (data: IDiscordButton) => {
    return (ctor: Ctor<DiscordButton>): void => {
        const instance = new ctor()
        instance.config = data
        DiscordButtonController.addButton(instance)
    }
}

import {IModule} from "@pollux/core/types"
import {DiscordCommandService} from "./services/DiscordCommandService"
import {DiscordUpdateCommandsService} from "./services/DiscordUpdateCommandsService"
import {EmbedService} from "./services/EmbedService"
import {UpdateCommandsCommand} from "./commands/discord/UpdateCommandsCommand"
import {IModuleDiscordConfig} from "./DiscordCommand"
import {DiscordCommandLocalizations} from "./DiscordCommandDeclaration"

export class DiscordCommandModule implements IModule {
    public name: string = "discord-command"
    public services = [
        DiscordCommandService,
        DiscordUpdateCommandsService,
        EmbedService
    ]
    public discord: IModuleDiscordConfig = {
        tag: "DiscordCommands",
        discordCommands: [
            UpdateCommandsCommand
        ]
    }
    public localizations = DiscordCommandLocalizations
}

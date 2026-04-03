import {IModule} from "@pollux/core/types"
import {IModuleDiscordConfig} from "@pollux/discord-command"
import {IModuleSetting} from "./IModuleSetting"
import {SettingsService} from "./services/SettingsService"
import {SettingsAutocompleteService} from "./services/SettingsAutocompleteService"
import {SetCommand} from "./commands/settings/SetCommand"
import {GetCommand} from "./commands/settings/GetCommand"
import {ListCommand} from "./commands/settings/ListCommand"
import {SettingsKeys, SettingsLocalizations} from "./SettingsDeclaration"

export class SettingsModule implements IModule {
    public name = "settings"
    public services = [SettingsService, SettingsAutocompleteService]
    public discord: IModuleDiscordConfig = {
        tag: "Settings",
        discordCommands: [SetCommand, GetCommand, ListCommand]
    }
    public localizations = SettingsLocalizations
    public settings: IModuleSetting[] = [
        {
            key: SettingsKeys.AdminServer,
            defaultValue: "1242243721852878900",
            description: "settings.adminServer.description",
            global: true,
            hidden: true
        },
        {
            key: SettingsKeys.AdminUser,
            defaultValue: "183382329400623104",
            description: "settings.adminUser.description",
            global: true,
            hidden: true
        }
    ]
}

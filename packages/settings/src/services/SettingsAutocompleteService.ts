import {Service} from "@pollux/service"
import {ControllerContext, useContext} from "@pollux/core"
import {APIApplicationCommandOptionChoice} from "discord.js"

export class SettingsAutocompleteService extends Service {
    public async init(): Promise<void> {}

    public async keyAutocomplete(value: string): Promise<APIApplicationCommandOptionChoice[]> {
        const {settingsController} = useContext(ControllerContext)
        return Object.keys(settingsController.getAll())
            .filter(key => key.toLowerCase().includes(value.toLowerCase()))
            .map(key => ({name: key, value: key}))
    }
}

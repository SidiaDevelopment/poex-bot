import {ControllerContext, useContext} from "@pollux/core"
import {SettingsService} from "../services/SettingsService"

export const useSetting = (key: string, guildId: string = ""): string | null => {
    const {serviceController, settingsController} = useContext(ControllerContext)
    const service = serviceController.get<SettingsService>(SettingsService)
    if (service) {
        return service.get(key, guildId)
    }
    return settingsController.getDefault(key)
}

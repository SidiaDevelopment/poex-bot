import {addContextData, ControllerContext, ModuleController} from "@pollux/core"
import {IModule} from "@pollux/core/types"

export interface ISettingEntry {
    moduleName: string
    defaultValue: string
    description: string
    global: boolean
    hidden: boolean
}

declare module "@pollux/core/types" {
    interface IControllerContext {
        settingsController: SettingsController
    }
}

export class SettingsController {
    private settings: Record<string, ISettingEntry> = {}

    constructor() {
        ModuleController.onLoadModule.addListener(this.onModuleLoad.bind(this))
    }

    public async onModuleLoad(module: IModule): Promise<void> {
        if (!module.settings) return

        for (const setting of module.settings) {
            this.settings[setting.key] = {
                moduleName: module.name,
                defaultValue: setting.defaultValue,
                description: setting.description as string,
                global: setting.global ?? false,
                hidden: setting.hidden ?? false
            }
        }
    }

    public getDefault(key: string): string | null {
        return this.settings[key]?.defaultValue ?? null
    }

    public getEntry(key: string): ISettingEntry | null {
        return this.settings[key] ?? null
    }

    public getAllByModule(moduleName: string, includeHidden: boolean = false): Record<string, ISettingEntry> {
        return Object.fromEntries(
            Object.entries(this.settings).filter(([, entry]) => entry.moduleName === moduleName && (includeHidden || !entry.hidden))
        )
    }

    public getAll(): Record<string, ISettingEntry> {
        return this.settings
    }

    public isKnown(key: string): boolean {
        return Object.prototype.hasOwnProperty.call(this.settings, key)
    }
}

addContextData(ControllerContext, {
    settingsController: new SettingsController()
})

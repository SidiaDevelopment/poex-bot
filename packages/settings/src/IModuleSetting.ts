import {LocalizationTag} from "@pollux/i18n"

export interface IModuleSetting {
    key: string
    defaultValue: string
    description: LocalizationTag
    global?: boolean
    hidden?: boolean
}

declare module "@pollux/core/types" {
    interface IModule {
        settings?: IModuleSetting[]
    }
}

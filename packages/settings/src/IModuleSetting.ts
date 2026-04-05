import {LocalizationTag} from "@pollux/i18n"

export type SettingFieldType = "string" | "boolean" | "channel" | "role" | "number"

export interface IModuleSetting {
    key: string
    defaultValue: string
    description: LocalizationTag
    type?: SettingFieldType
    global?: boolean
    hidden?: boolean
}

declare module "@pollux/core/types" {
    interface IModule {
        settings?: IModuleSetting[]
    }
}

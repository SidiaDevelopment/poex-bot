import en from "./localizations/en"
import {LocalizationOverrides} from "@pollux/i18n"

declare module "@pollux/core/types" {
    type SettingsLocalizationType = typeof en
    export interface ILocalization extends SettingsLocalizationType {}
}

export enum SettingsKeys {
    AdminServer = "pollux.adminServer",
    AdminUser = "pollux.adminUser"
}

export const SettingsLocalizations: LocalizationOverrides = {
    en
}

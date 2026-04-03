import en from "./localizations/en"
import {LocalizationOverrides} from "@pollux/i18n"

declare module "@pollux/core/types" {
    type PingLocalizationType = typeof en
    export interface ILocalization extends PingLocalizationType {}
}

export const PingLocalizations: LocalizationOverrides = {
    en
}

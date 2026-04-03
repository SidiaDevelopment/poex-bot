import en from "./localizations/en"
import {LocalizationOverrides} from "@pollux/i18n"

declare module "@pollux/core/types" {
    type CommandsLocalizationType = typeof en
    export interface ILocalization extends CommandsLocalizationType {}
}

export const DiscordCommandLocalizations: LocalizationOverrides = {
    en
}

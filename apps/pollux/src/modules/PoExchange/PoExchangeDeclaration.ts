import en from "./localizations/en"
import {LocalizationOverrides} from "@pollux/i18n"

declare module "@pollux/core/types" {
    type PoExchangeLocalizationType = typeof en
    export interface ILocalization extends PoExchangeLocalizationType {}

    export interface IConfig {
        poExchange?: {
            apiUrl?: string
            apiKey?: string
            connectUrl?: string
        }
    }
}

export enum PoExchangeChannelId {
    POE1_BOSS_KILLING = "POE1_BOSS_KILLING",
    POE1_NIGHTMARE_MAPS = "POE1_NIGHTMARE_MAPS",
    POE1_INVITATIONS = "POE1_INVITATIONS",
    POE1_BLOODLINES = "POE1_BLOODLINES",
    POE1_LABYRINTH = "POE1_LABYRINTH",
    POE1_5_WAY = "POE1_5_WAY",
    POE1_CAMPAIGN_SKIP = "POE1_CAMPAIGN_SKIP",
    POE1_GOLD_ROTATION = "POE1_GOLD_ROTATION",
    POE1_TEMPLE_HOST = "POE1_TEMPLE_HOST",
    POE1_CHALLENGE_COMPLETION = "POE1_CHALLENGE_COMPLETION",
    POE1_BENCH_CRAFT = "POE1_BENCH_CRAFT",
    POE1_STANDARD_BOSS_KILLING = "POE1_STD_BOSS_KILLING",
    POE1_STANDARD_NIGHTMARE_MAPS = "POE1_STD_NIGHTMARE_MAPS",
    POE1_STANDARD_INVITATIONS = "POE1_STD_INVITATIONS",
    POE1_STANDARD_BLOODLINES = "POE1_STD_BLOODLINES",
    POE1_STANDARD_LABYRINTH = "POE1_STD_LABYRINTH",
    POE1_STANDARD_5_WAY = "POE1_STD_5_WAY",
    POE1_STANDARD_CAMPAIGN_SKIP = "POE1_STD_CAMPAIGN_SKIP",
    POE1_STANDARD_GOLD_ROTATION = "POE1_STD_GOLD_ROTATION",
    POE1_STANDARD_TEMPLE_HOST = "POE1_STD_TEMPLE_HOST",
    POE1_STANDARD_CHALLENGE_COMPLETION = "POE1_STD_CHALLENGE_COMPLETION",
    POE1_STANDARD_BENCH_CRAFT = "POE1_STD_BENCH_CRAFT"
}

export const PoExchangeLocalizations: LocalizationOverrides = {
    en
}

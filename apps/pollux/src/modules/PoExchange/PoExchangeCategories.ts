import {APIApplicationCommandOptionChoice} from "discord.js"
import {translate, LocalizationTag} from "@pollux/i18n"
import {PoExchangeChannelId} from "./PoExchangeDeclaration"

export const PoExchangeCategories = [
    {name: "poex.categories.bossKilling", value: PoExchangeChannelId.POE1_BOSS_KILLING},
    {name: "poex.categories.nightmareMaps", value: PoExchangeChannelId.POE1_NIGHTMARE_MAPS},
    {name: "poex.categories.invitations", value: PoExchangeChannelId.POE1_INVITATIONS},
    {name: "poex.categories.bloodlines", value: PoExchangeChannelId.POE1_BLOODLINES},
    {name: "poex.categories.labyrinth", value: PoExchangeChannelId.POE1_LABYRINTH},
    {name: "poex.categories.fiveWay", value: PoExchangeChannelId.POE1_5_WAY},
    {name: "poex.categories.campaignSkip", value: PoExchangeChannelId.POE1_CAMPAIGN_SKIP},
    {name: "poex.categories.goldRotation", value: PoExchangeChannelId.POE1_GOLD_ROTATION},
    {name: "poex.categories.templeHost", value: PoExchangeChannelId.POE1_TEMPLE_HOST},
    {name: "poex.categories.challengeCompletion", value: PoExchangeChannelId.POE1_CHALLENGE_COMPLETION},
    {name: "poex.categories.benchCraft", value: PoExchangeChannelId.POE1_BENCH_CRAFT},
    {name: "poex.categories.stdBossKilling", value: PoExchangeChannelId.POE1_STANDARD_BOSS_KILLING},
    {name: "poex.categories.stdNightmareMaps", value: PoExchangeChannelId.POE1_STANDARD_NIGHTMARE_MAPS},
    {name: "poex.categories.stdInvitations", value: PoExchangeChannelId.POE1_STANDARD_INVITATIONS},
    {name: "poex.categories.stdBloodlines", value: PoExchangeChannelId.POE1_STANDARD_BLOODLINES},
    {name: "poex.categories.stdLabyrinth", value: PoExchangeChannelId.POE1_STANDARD_LABYRINTH},
    {name: "poex.categories.stdFiveWay", value: PoExchangeChannelId.POE1_STANDARD_5_WAY},
    {name: "poex.categories.stdCampaignSkip", value: PoExchangeChannelId.POE1_STANDARD_CAMPAIGN_SKIP},
    {name: "poex.categories.stdGoldRotation", value: PoExchangeChannelId.POE1_STANDARD_GOLD_ROTATION},
    {name: "poex.categories.stdTempleHost", value: PoExchangeChannelId.POE1_STANDARD_TEMPLE_HOST},
    {name: "poex.categories.stdChallengeCompletion", value: PoExchangeChannelId.POE1_STANDARD_CHALLENGE_COMPLETION},
    {name: "poex.categories.stdBenchCraft", value: PoExchangeChannelId.POE1_STANDARD_BENCH_CRAFT},
    {name: "poex.categories.poe2PinnacleEncounters", value: PoExchangeChannelId.POE2_PINNACLE_ENCOUNTERS},
    {name: "poex.categories.poe2CitadelBosses", value: PoExchangeChannelId.POE2_CITADEL_BOSSES},
    {name: "poex.categories.poe2AnomalyAndMapBosses", value: PoExchangeChannelId.POE2_ANOMALY_AND_MAP_BOSSES},
    {name: "poex.categories.poe2CampaignBosses", value: PoExchangeChannelId.POE2_CAMPAIGN_BOSSES},
    {name: "poex.categories.poe2CampaignLeveling", value: PoExchangeChannelId.POE2_CAMPAIGN_LEVELING},
    {name: "poex.categories.poe2GoldRotation", value: PoExchangeChannelId.POE2_GOLD_ROTATION},
    {name: "poex.categories.poe2ChallengeCompletion", value: PoExchangeChannelId.POE2_CHALLENGE_COMPLETION},
    {name: "poex.categories.poe2AscendancyTrials", value: PoExchangeChannelId.POE2_ASCENDANCY_TRIALS},
    {name: "poex.categories.poe2CraftingServices", value: PoExchangeChannelId.POE2_CRAFTING_SERVICES},
    {name: "poex.categories.poe2StdPinnacleEncounters", value: PoExchangeChannelId.POE2_STANDARD_PINNACLE_ENCOUNTERS},
    {name: "poex.categories.poe2StdCitadelBosses", value: PoExchangeChannelId.POE2_STANDARD_CITADEL_BOSSES},
    {name: "poex.categories.poe2StdAnomalyAndMapBosses", value: PoExchangeChannelId.POE2_STANDARD_ANOMALY_AND_MAP_BOSSES},
    {name: "poex.categories.poe2StdCampaignBosses", value: PoExchangeChannelId.POE2_STANDARD_CAMPAIGN_BOSSES},
    {name: "poex.categories.poe2StdCampaignLeveling", value: PoExchangeChannelId.POE2_STANDARD_CAMPAIGN_LEVELING},
    {name: "poex.categories.poe2StdGoldRotation", value: PoExchangeChannelId.POE2_STANDARD_GOLD_ROTATION},
    {name: "poex.categories.poe2StdChallengeCompletion", value: PoExchangeChannelId.POE2_STANDARD_CHALLENGE_COMPLETION},
    {name: "poex.categories.poe2StdAscendancyTrials", value: PoExchangeChannelId.POE2_STANDARD_ASCENDANCY_TRIALS},
    {name: "poex.categories.poe2StdCraftingServices", value: PoExchangeChannelId.POE2_STANDARD_CRAFTING_SERVICES}
]

// Discord caps a command option at 25 static choices; with both PoE1 and PoE2
// categories the list exceeds that, so the slash commands use this autocomplete
// callback to filter down to a returnable slice instead.
export const poExchangeCategoryAutocomplete = async (value: string): Promise<APIApplicationCommandOptionChoice[]> => {
    const query = value.toLowerCase()
    return PoExchangeCategories
        .map(category => ({name: translate(category.name as LocalizationTag), value: category.value as string}))
        .filter(choice => choice.name.toLowerCase().includes(query) || choice.value.toLowerCase().includes(query))
        .slice(0, 25)
}

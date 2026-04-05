import {command, DiscordCommand, IDiscordCommand, IDiscordCommandData} from "@pollux/discord-command"
import {ApplicationCommandOptionType} from "discord-api-types/v10"
import {injectService} from "@pollux/service"
import {translate} from "@pollux/i18n"
import {DiscordService} from "@pollux/discord"
import {PoExchangeApiService} from "../../services/PoExchangeApiService"
import {VouchRoleService} from "../../services/VouchRoleService"
import {formatVouchCountEmbed, formatVouchError} from "../../formatters/formatVouch"
import {VouchCountRequest} from "../../types/VouchTypes"

export interface IVouchCountCommandData extends IDiscordCommandData {
    target: string
}

const MENTION_PATTERN = /^<@!?(\d+)>$/

const commandConfig: IDiscordCommand<IVouchCountCommandData> = {
    command: "vouch",
    subCommand: "count",
    description: "poex.commands.vouch.count.description",
    options: [
        {
            name: "target",
            type: ApplicationCommandOptionType.String,
            description: "poex.commands.vouch.count.userOption",
            required: true
        }
    ]
}

@command(commandConfig)
export class VouchCountCommand extends DiscordCommand<IVouchCountCommandData> {
    @injectService
    private poExchangeApiService!: PoExchangeApiService

    @injectService
    private discordService!: DiscordService

    @injectService
    private vouchRoleService!: VouchRoleService

    public handle = async ({interaction, target}: IVouchCountCommandData): Promise<void> => {
        await interaction.deferReply()

        try {
            const mentionMatch = target.match(MENTION_PATTERN)
            const request: VouchCountRequest = mentionMatch
                ? {discordId: mentionMatch[1]}
                : {username: target}

            const data = await this.poExchangeApiService.getVouchCount(request)

            if ("error" in data) {
                await interaction.editReply({content: formatVouchError()})
                return
            }

            const discordId = data.discordId ?? mentionMatch?.[1]
            const client = this.discordService.getClient()
            const user = discordId ? await client.users.fetch(discordId).catch(() => undefined) : undefined
            const member = discordId ? interaction.guild?.members.cache.get(discordId) ?? await interaction.guild?.members.fetch(discordId).catch(() => null) : null
            await interaction.editReply({embeds: [formatVouchCountEmbed(data, user, member)]})
            if (interaction.guildId) await this.vouchRoleService.checkAndAssignRoles(interaction.guildId, data)
        } catch {
            await interaction.editReply({content: translate("poex.vouch.failed")})
        }
    }
}

import {command, DiscordCommand, IDiscordCommand, IDiscordCommandData} from "@pollux/discord-command"
import {ApplicationCommandOptionType} from "discord-api-types/v10"
import {User} from "discord.js"
import {injectService} from "@pollux/service"
import {translate} from "@pollux/i18n"
import {PoExchangeApiService} from "../../services/PoExchangeApiService"
import {formatVouchCount, formatVouchError} from "../../formatters/formatVouch"

export interface IVouchCountCommandData extends IDiscordCommandData {
    target: User
}

const commandConfig: IDiscordCommand<IVouchCountCommandData> = {
    command: "vouch",
    subCommand: "count",
    description: "poex.commands.vouch.count.description",
    options: [
        {
            name: "target",
            type: ApplicationCommandOptionType.User,
            description: "poex.commands.vouch.count.userOption",
            required: true
        }
    ]
}

@command(commandConfig)
export class VouchCountCommand extends DiscordCommand<IVouchCountCommandData> {
    @injectService
    private poExchangeApiService!: PoExchangeApiService

    public handle = async ({interaction, target}: IVouchCountCommandData): Promise<void> => {
        await interaction.deferReply()

        try {
            const data = await this.poExchangeApiService.getVouchCount({discordId: target.id})

            if ("error" in data) {
                await interaction.editReply({content: formatVouchError(data.connectUrl)})
                return
            }

            await interaction.editReply({content: formatVouchCount(data)})
        } catch {
            await interaction.editReply({content: translate("poex.vouch.failed")})
        }
    }
}

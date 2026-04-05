import {command, DiscordCommand, IDiscordCommand, IDiscordCommandData} from "@pollux/discord-command"
import {ApplicationCommandOptionType} from "discord-api-types/v10"
import {TextChannel, User} from "discord.js"
import {injectService} from "@pollux/service"
import {translate} from "@pollux/i18n"
import {PoExchangeApiService} from "../../services/PoExchangeApiService"
import {formatVouchMessage, formatVouchError} from "../../formatters/formatVouch"

export interface IVouchCommandData extends IDiscordCommandData {
    target: User
}

const commandConfig: IDiscordCommand<IVouchCommandData> = {
    command: "vouch",
    subCommand: "send",
    description: "poex.commands.vouch.description",
    options: [
        {
            name: "target",
            type: ApplicationCommandOptionType.User,
            description: "poex.commands.vouch.userOption",
            required: true
        }
    ]
}

@command(commandConfig)
export class VouchCommand extends DiscordCommand<IVouchCommandData> {
    @injectService
    private poExchangeApiService!: PoExchangeApiService

    public handle = async ({interaction, target}: IVouchCommandData): Promise<void> => {
        await interaction.deferReply()

        try {
            const data = await this.poExchangeApiService.sendVouch({
                type: "message",
                voucherId: interaction.user.id,
                channelId: interaction.channelId,
                channelName: (interaction.channel as TextChannel)?.name ?? "unknown",
                messageContent: `<@${target.id}> vouch via command`
            })

            if ("error" in data) {
                await interaction.editReply({content: formatVouchError(data.connectUrl)})
                return
            }

            await interaction.editReply({content: formatVouchMessage(interaction.user.id, data)})
        } catch {
            await interaction.editReply({content: translate("poex.vouch.failed")})
        }
    }
}

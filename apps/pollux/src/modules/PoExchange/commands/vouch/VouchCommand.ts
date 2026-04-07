import {command, DiscordCommand, IDiscordCommand, IDiscordCommandData} from "@pollux/discord-command"
import {ApplicationCommandOptionType} from "discord-api-types/v10"
import {MessageFlags, TextChannel, User} from "discord.js"
import {injectService} from "@pollux/service"
import {translate} from "@pollux/i18n"
import {PoExchangeApiService} from "../../services/PoExchangeApiService"
import {VouchRoleService} from "../../services/VouchRoleService"
import {formatVouchError, formatVouchSaved} from "../../formatters/formatVouch"

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

    @injectService
    private vouchRoleService!: VouchRoleService

    public handle = async ({interaction, target}: IVouchCommandData): Promise<void> => {
        if (interaction.user.id === target.id) {
            await interaction.reply({content: translate("poex.vouch.selfVouch"), flags: [MessageFlags.Ephemeral]})
            return
        }

        await interaction.deferReply()

        try {
            const data = await this.poExchangeApiService.sendVouch({
                type: "message",
                voucherId: interaction.user.id,
                voucherUsername: interaction.user.username,
                channelId: interaction.channelId,
                channelName: (interaction.channel as TextChannel)?.name ?? "unknown",
                targetId: target.id,
                messageContent: "Vouched via command"
            })

            if ("error" in data) {
                if (data.error === "vouch_saved") {
                    await interaction.editReply({content: formatVouchSaved(data.totalVouches)})
                } else {
                    await interaction.editReply({content: formatVouchError()})
                }
                return
            }

            const mention = data.discordId ? `<@${data.discordId}>` : data.username
            await interaction.editReply({content: `${translate("poex.vouch.success")} **${data.username}** (${mention}) — ${data.uniqueVouches} ${translate("poex.vouch.uniqueVouches")} (${data.totalVouches} ${translate("poex.vouch.totalVouches")})`})
            if (interaction.guildId) await this.vouchRoleService.checkAndAssignRoles(interaction.guildId, data)
        } catch {
            await interaction.editReply({content: translate("poex.vouch.failed")})
        }
    }
}

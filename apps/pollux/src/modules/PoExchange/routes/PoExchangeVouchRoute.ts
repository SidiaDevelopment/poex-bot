import {route, ApiHandler, IApiRequestData, HttpMethod} from "@pollux/api"
import {injectService} from "@pollux/service"
import {DiscordService} from "@pollux/discord"
import {SettingsService} from "@pollux/settings"
import {PoExchangeSettingsKeys} from "../PoExchangeDeclaration"
import {validateApiKey} from "../../../shared/validateApiKey"
import {TextChannel} from "discord.js"
import {VouchRoleService} from "../services/VouchRoleService"
import {formatWebsiteVouchMessage} from "../formatters/formatVouch"
import {VouchResponse} from "../types/VouchTypes"

interface VouchNotification {
    sender: {
        username: string
        discordId?: string
    }
    receiver: VouchResponse
    guildId: string
}

@route({method: HttpMethod.POST, path: "/poex/vouch"})
export class PoExchangeVouchRoute extends ApiHandler<IApiRequestData> {
    @injectService
    private discordService!: DiscordService

    @injectService
    private settingsService!: SettingsService

    @injectService
    private vouchRoleService!: VouchRoleService

    public handle = async ({req, res}: IApiRequestData): Promise<void> => {
        if (!validateApiKey(req, res)) return

        const {sender, receiver, guildId} = req.body as VouchNotification

        if (!sender?.username || !receiver?.username || !guildId) {
            res.status(400).json({status: "error", errorMessage: "Missing required fields: sender.username, receiver, guildId"})
            return
        }

        const vouchChannelId = this.settingsService.get(PoExchangeSettingsKeys.VouchChannel, guildId)
        if (!vouchChannelId) {
            res.status(400).json({status: "error", errorMessage: "Vouch channel not configured for this guild"})
            return
        }

        const client = this.discordService.getClient()
        const channel = await client.channels.fetch(vouchChannelId).catch(() => null)
        if (!channel || !(channel instanceof TextChannel)) {
            res.status(400).json({status: "error", errorMessage: "Vouch channel not found or not a text channel"})
            return
        }

        await channel.send(formatWebsiteVouchMessage(sender, receiver))

        await this.vouchRoleService.checkAndAssignRoles(guildId, receiver)

        res.json({status: "ok"})
    }
}

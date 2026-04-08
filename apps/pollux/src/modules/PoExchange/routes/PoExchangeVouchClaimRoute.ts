import {route, ApiHandler, IApiRequestData, HttpMethod} from "@pollux/api"
import {injectService} from "@pollux/service"
import {DiscordService} from "@pollux/discord"
import {SettingsService} from "@pollux/settings"
import {PoExchangeSettingsKeys} from "../PoExchangeDeclaration"
import {TextChannel} from "discord.js"
import {VouchRoleService} from "../services/VouchRoleService"
import {formatVouchClaimMessage} from "../formatters/formatVouch"

interface VouchClaimNotification {
    discordId: string
    username: string
    totalVouches: number
    guildId: string
}

@route({method: HttpMethod.POST, path: "/poex/vouch/claim"})
export class PoExchangeVouchClaimRoute extends ApiHandler<IApiRequestData> {
    @injectService
    private discordService!: DiscordService

    @injectService
    private settingsService!: SettingsService

    @injectService
    private vouchRoleService!: VouchRoleService

    public handle = async ({req, res}: IApiRequestData): Promise<void> => {
        const apiKey = req.query.apiKey as string
        if (!apiKey || apiKey !== process.env.API_KEY) {
            res.status(401).json({status: "error", errorMessage: "Invalid or missing API key"})
            return
        }

        const {discordId, username, totalVouches, guildId} = req.body as VouchClaimNotification

        if (!discordId || !username || typeof totalVouches !== "number" || !guildId) {
            res.status(400).json({status: "error", errorMessage: "Missing required fields: discordId, username, totalVouches, guildId"})
            return
        }

        if (totalVouches <= 0) {
            res.status(400).json({status: "error", errorMessage: "No outstanding vouches to claim"})
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

        await channel.send({
            content: formatVouchClaimMessage(discordId, username, totalVouches),
            allowedMentions: {users: [discordId]}
        })

        await this.vouchRoleService.checkAndAssignRoles(guildId, {
            username,
            discordId,
            uniqueVouches: totalVouches,
            totalVouches,
            cycleVouches: 0
        })

        res.json({status: "ok"})
    }
}

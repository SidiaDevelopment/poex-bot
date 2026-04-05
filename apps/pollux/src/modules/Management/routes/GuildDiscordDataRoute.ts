import {route, ApiHandler, IApiRequestData, HttpMethod} from "@pollux/api"
import {injectService} from "@pollux/service"
import {DiscordService} from "@pollux/discord"
import {ChannelType} from "discord.js"
import {ManagementAuthService} from "../services/ManagementAuthService"

@route({method: HttpMethod.GET, path: "/api/management/guilds/:guildId/discord"})
export class GuildDiscordDataRoute extends ApiHandler<IApiRequestData> {
    @injectService
    private managementAuthService!: ManagementAuthService

    @injectService
    private discordService!: DiscordService

    public handle = async ({req, res}: IApiRequestData): Promise<void> => {
        const guildId = req.params.guildId as string
        if (!await this.managementAuthService.canManageGuild(req, guildId)) {
            this.managementAuthService.sendForbidden(res)
            return
        }

        const client = this.discordService.getClient()
        const guild = await client.guilds.fetch(guildId).catch(() => null)
        if (!guild) {
            res.status(404).json({error: "Guild not found"})
            return
        }

        const channels = (await guild.channels.fetch()).filter(c => c !== null && c.type === ChannelType.GuildText).map(c => ({
            id: c!.id,
            name: c!.name
        }))

        const roles = (await guild.roles.fetch()).filter(r => !r.managed && r.name !== "@everyone").map(r => ({
            id: r.id,
            name: r.name,
            color: r.hexColor
        }))

        res.json({channels, roles})
    }
}

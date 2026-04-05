import {route, ApiHandler, IApiRequestData, HttpMethod} from "@pollux/api"
import {injectService} from "@pollux/service"
import {DiscordService} from "@pollux/discord"
import {ManagementAuthService} from "../services/ManagementAuthService"

@route({method: HttpMethod.GET, path: "/api/management/guilds"})
export class GuildsRoute extends ApiHandler<IApiRequestData> {
    @injectService
    private managementAuthService!: ManagementAuthService

    @injectService
    private discordService!: DiscordService

    public handle = async ({req, res}: IApiRequestData): Promise<void> => {
        const user = await this.managementAuthService.getUser(req)
        if (!user) {
            this.managementAuthService.sendUnauthorized(res)
            return
        }

        const userGuilds = await this.managementAuthService.getUserGuilds(req)
        const client = this.discordService.getClient()
        const botGuildIds = new Set(client.guilds.cache.map(g => g.id))

        const MANAGE_GUILD = 0x20n
        const result = userGuilds
            .filter(g => (BigInt(g.permissions) & MANAGE_GUILD) === MANAGE_GUILD)
            .filter(g => botGuildIds.has(g.id))
            .map(g => ({
                id: g.id,
                name: g.name,
                icon: g.icon
            }))

        res.json(result)
    }
}

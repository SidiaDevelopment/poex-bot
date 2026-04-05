import {route, ApiHandler, IApiRequestData, HttpMethod} from "@pollux/api"
import {injectService} from "@pollux/service"
import {ManagementEntityController} from "@pollux/management"
import {ManagementAuthService} from "../services/ManagementAuthService"

@route({method: HttpMethod.GET, path: "/api/management/guilds/:guildId/entities/:entity"})
export class GuildEntitiesGetRoute extends ApiHandler<IApiRequestData> {
    @injectService
    private managementAuthService!: ManagementAuthService

    public handle = async ({req, res}: IApiRequestData): Promise<void> => {
        const guildId = req.params.guildId as string
        const entity = req.params.entity as string
        if (!await this.managementAuthService.canManageGuild(req, guildId)) {
            this.managementAuthService.sendForbidden(res)
            return
        }

        const handler = ManagementEntityController.getHandler(entity)
        if (!handler) {
            res.status(404).json({error: "Unknown entity"})
            return
        }

        res.json(await handler.list(guildId))
    }
}

@route({method: HttpMethod.POST, path: "/api/management/guilds/:guildId/entities/:entity"})
export class GuildEntitiesPostRoute extends ApiHandler<IApiRequestData> {
    @injectService
    private managementAuthService!: ManagementAuthService

    public handle = async ({req, res}: IApiRequestData): Promise<void> => {
        const guildId = req.params.guildId as string
        const entity = req.params.entity as string
        if (!await this.managementAuthService.canManageGuild(req, guildId)) {
            this.managementAuthService.sendForbidden(res)
            return
        }

        const handler = ManagementEntityController.getHandler(entity)
        if (!handler) {
            res.status(404).json({error: "Unknown entity"})
            return
        }

        await handler.create(guildId, req.body)
        res.json({status: "ok"})
    }
}

@route({method: HttpMethod.DELETE, path: "/api/management/guilds/:guildId/entities/:entity/:id"})
export class GuildEntitiesDeleteRoute extends ApiHandler<IApiRequestData> {
    @injectService
    private managementAuthService!: ManagementAuthService

    public handle = async ({req, res}: IApiRequestData): Promise<void> => {
        const guildId = req.params.guildId as string
        const entity = req.params.entity as string
        const id = req.params.id as string
        if (!await this.managementAuthService.canManageGuild(req, guildId)) {
            this.managementAuthService.sendForbidden(res)
            return
        }

        const handler = ManagementEntityController.getHandler(entity)
        if (!handler) {
            res.status(404).json({error: "Unknown entity"})
            return
        }

        await handler.remove(guildId, id)
        res.json({status: "ok"})
    }
}

import {route, ApiHandler, IApiRequestData, HttpMethod} from "@pollux/api"
import {injectService} from "@pollux/service"
import {SettingsService} from "@pollux/settings"
import {ControllerContext, useContext} from "@pollux/core"
import {ManagementAuthService} from "../services/ManagementAuthService"

@route({method: HttpMethod.GET, path: "/api/management/guilds/:guildId/settings"})
export class GuildSettingsGetRoute extends ApiHandler<IApiRequestData> {
    @injectService
    private managementAuthService!: ManagementAuthService

    @injectService
    private settingsService!: SettingsService

    public handle = async ({req, res}: IApiRequestData): Promise<void> => {
        const guildId = req.params.guildId as string
        if (!await this.managementAuthService.canManageGuild(req, guildId)) {
            this.managementAuthService.sendForbidden(res)
            return
        }

        const {settingsController} = useContext(ControllerContext)
        const allSettings = settingsController.getAll()
        const result: Record<string, string | null> = {}

        for (const key of Object.keys(allSettings)) {
            const entry = allSettings[key]
            if (entry.global || entry.hidden) continue
            result[key] = this.settingsService.get(key, guildId)
        }

        res.json(result)
    }
}

@route({method: HttpMethod.POST, path: "/api/management/guilds/:guildId/settings"})
export class GuildSettingsPostRoute extends ApiHandler<IApiRequestData> {
    @injectService
    private managementAuthService!: ManagementAuthService

    @injectService
    private settingsService!: SettingsService

    public handle = async ({req, res}: IApiRequestData): Promise<void> => {
        const guildId = req.params.guildId as string
        if (!await this.managementAuthService.canManageGuild(req, guildId)) {
            this.managementAuthService.sendForbidden(res)
            return
        }

        const {settingsController} = useContext(ControllerContext)
        const {key, value} = req.body

        if (!key || value === undefined) {
            res.status(400).json({error: "Missing key or value"})
            return
        }

        if (!settingsController.isKnown(key)) {
            res.status(400).json({error: "Unknown setting"})
            return
        }

        const entry = settingsController.getEntry(key)
        if (entry?.global) {
            res.status(400).json({error: "Cannot set global setting via guild endpoint"})
            return
        }

        await this.settingsService.set(key, value, guildId)
        res.json({status: "ok"})
    }
}

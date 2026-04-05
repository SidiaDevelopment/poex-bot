import {route, ApiHandler, IApiRequestData, HttpMethod} from "@pollux/api"
import {injectService} from "@pollux/service"
import {SettingsService} from "@pollux/settings"
import {ControllerContext, useContext} from "@pollux/core"
import {ManagementAuthService} from "../services/ManagementAuthService"

@route({method: HttpMethod.GET, path: "/api/management/global/settings"})
export class GlobalSettingsGetRoute extends ApiHandler<IApiRequestData> {
    @injectService
    private managementAuthService!: ManagementAuthService

    @injectService
    private settingsService!: SettingsService

    public handle = async ({req, res}: IApiRequestData): Promise<void> => {
        if (!await this.managementAuthService.isAdmin(req)) {
            this.managementAuthService.sendForbidden(res)
            return
        }

        const {settingsController} = useContext(ControllerContext)
        const allSettings = settingsController.getAll()
        const result: Record<string, string | null> = {}

        for (const key of Object.keys(allSettings)) {
            const entry = allSettings[key]
            if (!entry.global) continue
            result[key] = this.settingsService.get(key, "")
        }

        res.json(result)
    }
}

@route({method: HttpMethod.POST, path: "/api/management/global/settings"})
export class GlobalSettingsPostRoute extends ApiHandler<IApiRequestData> {
    @injectService
    private managementAuthService!: ManagementAuthService

    @injectService
    private settingsService!: SettingsService

    public handle = async ({req, res}: IApiRequestData): Promise<void> => {
        if (!await this.managementAuthService.isAdmin(req)) {
            this.managementAuthService.sendForbidden(res)
            return
        }

        const {settingsController} = useContext(ControllerContext)
        const {key, value} = req.body

        if (!key || value === undefined) {
            res.status(400).json({error: "Missing key or value"})
            return
        }

        const entry = settingsController.getEntry(key)
        if (!entry?.global) {
            res.status(400).json({error: "Not a global setting"})
            return
        }

        await this.settingsService.set(key, value, "")
        res.json({status: "ok"})
    }
}

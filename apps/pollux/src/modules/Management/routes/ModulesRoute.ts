import {route, ApiHandler, IApiRequestData, HttpMethod} from "@pollux/api"
import {injectService} from "@pollux/service"
import {ControllerContext, useContext} from "@pollux/core"
import {translate, LocalizationTag} from "@pollux/i18n"
import {IManagementPage} from "@pollux/management"
import {ManagementAuthService} from "../services/ManagementAuthService"

@route({method: HttpMethod.GET, path: "/api/management/modules"})
export class ModulesRoute extends ApiHandler<IApiRequestData> {
    @injectService
    private managementAuthService!: ManagementAuthService

    public handle = async ({req, res}: IApiRequestData): Promise<void> => {
        const user = await this.managementAuthService.getUser(req)
        if (!user) {
            this.managementAuthService.sendUnauthorized(res)
            return
        }

        const {moduleController, settingsController} = useContext(ControllerContext)
        const modules = moduleController.getModules()

        const result: {name: string, priority: number, management: IManagementPage}[] = modules
            .filter(m => m.management)
            .map(m => ({
                name: m.name,
                priority: m.management!.priority ?? 0,
                management: this.translateSchema(m.management!)
            }))

        // Build a "Settings" entry from all non-hidden, non-global settings across all modules
        const allSettings = settingsController.getAll()
        const settingsByModule: Record<string, {key: string, type: "boolean" | "string", label: string}[]> = {}

        for (const [key, entry] of Object.entries(allSettings)) {
            if (entry.hidden || entry.global) continue
            if (!settingsByModule[entry.moduleName]) settingsByModule[entry.moduleName] = []
            settingsByModule[entry.moduleName].push({
                key,
                type: entry.type as "boolean" | "string",
                label: entry.description
            })
        }

        const settingSections = Object.entries(settingsByModule).map(([moduleName, fields]) => ({
            title: moduleName,
            fields
        }))

        if (settingSections.length > 0) {
            result.push({
                name: "Settings",
                priority: 100,
                management: {
                    sections: settingSections.map(s => ({
                        title: s.title,
                        fields: s.fields.map(f => ({
                            ...f,
                            label: this.t(f.label)
                        }))
                    }))
                }
            })
        }

        result.sort((a, b) => b.priority - a.priority)
        res.json(result)
    }

    private t(tag: string): string {
        return translate(tag as LocalizationTag)
    }

    private translateSchema(page: IManagementPage): IManagementPage {
        return {
            sections: page.sections?.map(s => ({
                title: this.t(s.title),
                fields: s.fields.map(f => ({
                    ...f,
                    label: this.t(f.label),
                    description: f.description ? this.t(f.description) : undefined,
                    choices: f.choices?.map(ch => ({...ch, name: this.t(ch.name)}))
                }))
            })),
            tables: page.tables?.map(t => ({
                ...t,
                title: this.t(t.title),
                description: t.description ? this.t(t.description) : undefined,
                columns: t.columns.map(c => ({
                    ...c,
                    label: this.t(c.label),
                    choices: c.choices?.map(ch => ({...ch, name: this.t(ch.name)}))
                }))
            }))
        }
    }
}

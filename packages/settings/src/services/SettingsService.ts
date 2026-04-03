import {injectService, Service} from "@pollux/service"
import {DatabaseService} from "@pollux/database"
import {ControllerContext, useContext} from "@pollux/core"
import {SettingEntity} from "../entities/SettingEntity"

export class SettingsService extends Service {
    @injectService
    private databaseService!: DatabaseService

    private cache: Record<string, string> = {}

    public async init(): Promise<void> {
        const repo = this.databaseService.getClient().getRepository(SettingEntity)
        const all = await repo.find()
        for (const entity of all) {
            this.cache[`${entity.key}::${entity.guildId}`] = entity.value
        }
    }

    public get(key: string, guildId: string): string | null {
        const {settingsController} = useContext(ControllerContext)
        const entry = settingsController.getEntry(key)
        const effectiveGuildId = entry?.global ? "" : guildId
        const cacheKey = `${key}::${effectiveGuildId}`
        if (Object.prototype.hasOwnProperty.call(this.cache, cacheKey)) {
            return this.cache[cacheKey]
        }
        return entry?.defaultValue ?? null
    }

    public async set(key: string, value: string, guildId: string): Promise<void> {
        const {settingsController} = useContext(ControllerContext)
        const entry = settingsController.getEntry(key)
        const effectiveGuildId = entry?.global ? "" : guildId
        const cacheKey = `${key}::${effectiveGuildId}`

        const repo = this.databaseService.getClient().getRepository(SettingEntity)
        let entity = await repo.findOneBy({key, guildId: effectiveGuildId})
        if (!entity) {
            entity = new SettingEntity()
            entity.key = key
            entity.guildId = effectiveGuildId
        }
        entity.value = value
        await repo.save(entity)
        this.cache[cacheKey] = value
    }
}

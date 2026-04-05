import {injectService, Service} from "@pollux/service"
import {DatabaseService} from "@pollux/database"
import {DiscordService} from "@pollux/discord"
import {ControllerContext, useContext} from "@pollux/core"
import {LogLevel} from "@pollux/logging"
import {VouchRoleEntity} from "../entities/VouchRoleEntity"
import {VouchResponse} from "../types/VouchTypes"

export class VouchRoleService extends Service {
    @injectService
    private databaseService!: DatabaseService

    @injectService
    private discordService!: DiscordService

    private cache: Record<string, VouchRoleEntity[]> = {}

    public async init(): Promise<void> {
        const repo = this.databaseService.getClient().getRepository(VouchRoleEntity)
        const all = await repo.find()
        for (const entity of all) {
            if (!this.cache[entity.guildId]) {
                this.cache[entity.guildId] = []
            }
            this.cache[entity.guildId].push(entity)
        }
    }

    public async checkAndAssignRoles(guildId: string, data: VouchResponse): Promise<void> {
        if (!data.discordId) return

        const roles = this.cache[guildId]
        if (!roles || roles.length === 0) return

        const {loggingController} = useContext(ControllerContext)
        const client = this.discordService.getClient()

        try {
            const guild = await client.guilds.fetch(guildId)
            const member = await guild.members.fetch(data.discordId)

            for (const role of roles) {
                if (data.uniqueVouches >= role.threshold && !member.roles.cache.has(role.roleId)) {
                    await member.roles.add(role.roleId)
                    loggingController.log("PoExchange", LogLevel.Debug, `Assigned role ${role.roleId} to ${data.discordId} (${data.uniqueVouches} >= ${role.threshold})`)
                }
            }
        } catch (error) {
            loggingController.log("PoExchange", LogLevel.Error, `Failed to assign vouch roles: ${error}`)
        }
    }

    public async addRole(guildId: string, roleId: string, threshold: number): Promise<void> {
        const repo = this.databaseService.getClient().getRepository(VouchRoleEntity)
        let entity = await repo.findOneBy({guildId, roleId})
        if (!entity) {
            entity = new VouchRoleEntity()
            entity.guildId = guildId
            entity.roleId = roleId
        }
        entity.threshold = threshold
        await repo.save(entity)

        if (!this.cache[guildId]) {
            this.cache[guildId] = []
        }
        const existing = this.cache[guildId].find(r => r.roleId === roleId)
        if (existing) {
            existing.threshold = threshold
        } else {
            this.cache[guildId].push(entity)
        }
    }

    public async removeRole(guildId: string, roleId: string): Promise<boolean> {
        const roles = this.cache[guildId]
        if (!roles) return false

        const index = roles.findIndex(r => r.roleId === roleId)
        if (index === -1) return false

        const repo = this.databaseService.getClient().getRepository(VouchRoleEntity)
        await repo.delete({guildId, roleId})
        roles.splice(index, 1)
        return true
    }

    public getRoles(guildId: string): VouchRoleEntity[] {
        return (this.cache[guildId] ?? []).sort((a, b) => a.threshold - b.threshold)
    }
}

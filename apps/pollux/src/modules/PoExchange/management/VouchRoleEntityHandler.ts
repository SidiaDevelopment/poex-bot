import {managementEntity, ManagementEntityHandler} from "@pollux/management"
import {injectService} from "@pollux/service"
import {VouchRoleService} from "../services/VouchRoleService"

@managementEntity("vouch-roles")
export class VouchRoleEntityHandler extends ManagementEntityHandler {
    @injectService
    private vouchRoleService!: VouchRoleService

    public async list(guildId: string): Promise<Record<string, unknown>[]> {
        return this.vouchRoleService.getRoles(guildId).map(r => ({...r}))
    }

    public async create(guildId: string, data: Record<string, unknown>): Promise<void> {
        await this.vouchRoleService.addRole(guildId, data.roleId as string, data.threshold as number)
    }

    public async remove(guildId: string, id: string): Promise<void> {
        await this.vouchRoleService.removeRole(guildId, id)
    }
}

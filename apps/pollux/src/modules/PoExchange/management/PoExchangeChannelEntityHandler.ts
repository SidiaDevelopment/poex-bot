import {managementEntity, ManagementEntityHandler} from "@pollux/management"
import {injectService} from "@pollux/service"
import {PoExchangeService} from "../services/PoExchangeService"

@managementEntity("poex-channels")
export class PoExchangeChannelEntityHandler extends ManagementEntityHandler {
    @injectService
    private poExchangeService!: PoExchangeService

    public async list(guildId: string): Promise<Record<string, unknown>[]> {
        return this.poExchangeService.getChannelMappings(guildId)
    }

    public async create(guildId: string, data: Record<string, unknown>): Promise<void> {
        await this.poExchangeService.setChannel(data.channelKey as string, guildId, data.discordChannelId as string)
    }

    public async remove(guildId: string, id: string): Promise<void> {
        await this.poExchangeService.removeChannel(id, guildId)
    }
}

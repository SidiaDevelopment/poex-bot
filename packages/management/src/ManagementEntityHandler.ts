import {Ctor} from "@pollux/utils"

export interface IManagementEntityHandler {
    entity: string
    list(guildId: string): Promise<Record<string, unknown>[]>
    create(guildId: string, data: Record<string, unknown>): Promise<void>
    remove(guildId: string, id: string): Promise<void>
}

export abstract class ManagementEntityHandler implements IManagementEntityHandler {
    public entity!: string

    public abstract list(guildId: string): Promise<Record<string, unknown>[]>
    public abstract create(guildId: string, data: Record<string, unknown>): Promise<void>
    public abstract remove(guildId: string, id: string): Promise<void>
}

declare module "@pollux/core/types" {
    interface IModule {
        managementEntities?: Ctor<ManagementEntityHandler>[]
    }
}

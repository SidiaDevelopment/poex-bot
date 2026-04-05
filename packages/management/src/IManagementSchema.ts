export type ManagementFieldType = "string" | "boolean" | "channel" | "role" | "number"

export interface IManagementChoice {
    name: string
    value: string
}

export interface IManagementField {
    key: string
    type: ManagementFieldType
    label: string
    description?: string
    choices?: IManagementChoice[]
}

export interface IManagementSection {
    title: string
    fields: IManagementField[]
}

export interface IManagementTableColumn {
    key: string
    type: ManagementFieldType
    label: string
    choices?: IManagementChoice[]
    unique?: boolean
}

export interface IManagementTable {
    title: string
    description?: string
    entity: string
    columns: IManagementTableColumn[]
}

export interface IManagementPage {
    priority?: number
    sections?: IManagementSection[]
    tables?: IManagementTable[]
}

declare module "@pollux/core/types" {
    interface IModule {
        management?: IManagementPage
    }
}

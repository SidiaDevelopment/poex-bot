import {Contexts} from "./Contexts"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TUnknownStringRecord = Record<string, any>
export type TUnknownContext = Context<TUnknownStringRecord>

export abstract class Context<T extends TUnknownStringRecord> {
    public data: T = {} as T

    public create(): void {
        Contexts.register(this)
    }

    public getData(): T {
        return this.data
    }

    public addData(data: Partial<T>): void {
        this.data = {...this.data, ...data}
    }
}

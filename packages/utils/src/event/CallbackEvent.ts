export type EventListener<T> = (data: T) => Promise<void>

export class CallbackEvent<T> {
    protected listeners: EventListener<T>[] = []
    public static Default: void

    public emit(data: T): void {
        for (const listener of this.listeners) {
            listener(data)
        }
    }

    public addListener(listener: EventListener<T>): void {
        this.listeners.push(listener)
    }
}

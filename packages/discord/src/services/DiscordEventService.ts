import {injectService, Service} from "@pollux/service"
import {DiscordService} from "./DiscordService"
import {ClientEvents} from "discord.js"

export type DiscordEventCallback<T extends keyof ClientEvents = keyof ClientEvents> = (...args: ClientEvents[T]) => void;
export type DiscordEventSubscribers = Record<string, DiscordEventCallback[]>

export class DiscordEventService extends Service {
    @injectService
    private discordService!: DiscordService

    private subscribers: DiscordEventSubscribers = {}

    public async init(): Promise<void> {}

    public subscribe<T extends keyof ClientEvents>(name: T, callback: DiscordEventCallback<T>): void {
        if (!this.subscribers.hasOwnProperty(name)) {
            this.subscribers[name] = []

            this.createEventSubscription(name)
        }
        this.subscribers[name].push(callback as DiscordEventCallback)
    }

    private createEventSubscription<T extends keyof ClientEvents>(name: T) {
        const client = this.discordService.getClient()
        client.on(name, this.mapEvent(name))
    }

    private mapEvent<T extends keyof ClientEvents>(name: T) {
        return (...args: ClientEvents[T]) => {
            this.subscribers[name].forEach(e => e(...args))
        }
    }
}

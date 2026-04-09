import {randomUUID} from "crypto"
import {Service} from "@pollux/service"
import {Ctor} from "@pollux/utils"
import {ControllerContext, useContext} from "@pollux/core"
import {LogLevel} from "@pollux/logging"
import {EphemeralButton} from "../EphemeralButton"
import {EphemeralButtonController} from "../EphemeralButtonController"

interface ICreateOptions {
    timeoutMs?: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EphemeralButtonCtor<B> = (new (data: any, instanceId: string, timeoutMs: number) => B) & typeof EphemeralButton

export class EphemeralButtonService extends Service {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private prefixOwners: Map<string, Ctor<any>> = new Map()

    public create<TData, TBuildOptions, B extends EphemeralButton<TData, TBuildOptions>>(
        Ctor: EphemeralButtonCtor<B>,
        data: TData,
        options?: ICreateOptions
    ): B {
        const prefix = Ctor.customIdPrefix
        if (!prefix) {
            throw new Error(`${Ctor.name} must declare a non-empty static customIdPrefix`)
        }
        this.checkPrefixOwnership(prefix, Ctor as unknown as Ctor<B>)

        const timeoutMs = options?.timeoutMs ?? Ctor.defaultTimeoutMs
        const instanceId = `${prefix}:${randomUUID()}`
        const instance = new Ctor(data, instanceId, timeoutMs)

        const timeoutHandle = setTimeout(() => {
            this.expire(instanceId).catch(error => {
                const {loggingController} = useContext(ControllerContext)
                loggingController.log("@pollux/discord-command", LogLevel.Error, `Ephemeral button timeout handler failed (${instanceId}): ${error}`)
            })
        }, timeoutMs)

        EphemeralButtonController.register(instance, timeoutHandle)
        return instance
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private checkPrefixOwnership(prefix: string, Ctor: Ctor<any>): void {
        const existing = this.prefixOwners.get(prefix)
        if (!existing) {
            this.prefixOwners.set(prefix, Ctor)
            return
        }
        if (existing === Ctor) return
        const {loggingController} = useContext(ControllerContext)
        loggingController.log(
            "@pollux/discord-command",
            LogLevel.Warning,
            `EphemeralButton customIdPrefix collision: "${prefix}" used by both ${existing.name} and ${Ctor.name}`
        )
    }

    private async expire(customId: string): Promise<void> {
        const button = EphemeralButtonController.get(customId)
        if (!button) return
        try {
            await button.disable()
        } finally {
            try {
                await button.onTimeout?.()
            } finally {
                EphemeralButtonController.unregister(customId)
            }
        }
    }
}

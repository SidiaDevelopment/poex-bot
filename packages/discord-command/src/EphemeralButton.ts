import {ButtonBuilder, ButtonInteraction} from "discord.js"
import {EphemeralButtonController} from "./EphemeralButtonController"
import {IEphemeralButtonTarget} from "./IEphemeralButtonTarget"

type BuildArgs<TBuildOptions> = TBuildOptions extends void ? [] : [options: TBuildOptions]

export abstract class EphemeralButton<TData = void, TBuildOptions = void> {
    public static defaultTimeoutMs = 15 * 60 * 1000

    /** Must be overridden by subclasses with a unique string. */
    public static readonly customIdPrefix: string = ""

    public readonly instanceId: string
    public readonly timeoutMs: number

    protected readonly data: TData
    protected target?: IEphemeralButtonTarget

    public constructor(data: TData, instanceId: string, timeoutMs: number) {
        this.data = data
        this.instanceId = instanceId
        this.timeoutMs = timeoutMs
    }

    public attachTarget(target: IEphemeralButtonTarget): this {
        this.target = target
        return this
    }

    public abstract build(...args: BuildArgs<TBuildOptions>): ButtonBuilder

    public abstract handle(interaction: ButtonInteraction): Promise<void>

    public onTimeout?(): Promise<void> | void

    /** Disables this button on its attached message (if any). Safe to call multiple times. */
    public async disable(): Promise<void> {
        await this.target?.disableButton(this.instanceId)
    }

    /**
     * Disables the button and removes it from the registry early. Call from within
     * {@link handle} once the interaction is done; otherwise the timeout handles cleanup.
     */
    protected async dispose(): Promise<void> {
        try {
            await this.disable()
        } finally {
            EphemeralButtonController.unregister(this.instanceId)
        }
    }
}

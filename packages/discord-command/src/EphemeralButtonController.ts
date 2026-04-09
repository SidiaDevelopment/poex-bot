import {EphemeralButton} from "./EphemeralButton"

interface IEphemeralButtonEntry {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    button: EphemeralButton<any, any>
    timeoutHandle: NodeJS.Timeout
}

export class EphemeralButtonController {
    private static instances: Map<string, IEphemeralButtonEntry> = new Map()

    public static register(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        button: EphemeralButton<any, any>,
        timeoutHandle: NodeJS.Timeout
    ): void {
        EphemeralButtonController.instances.set(button.instanceId, {button, timeoutHandle})
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static get(customId: string): EphemeralButton<any, any> | null {
        return EphemeralButtonController.instances.get(customId)?.button ?? null
    }

    public static unregister(customId: string): void {
        const entry = EphemeralButtonController.instances.get(customId)
        if (!entry) return
        clearTimeout(entry.timeoutHandle)
        EphemeralButtonController.instances.delete(customId)
    }
}

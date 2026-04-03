import {ICoreSetup} from "@pollux/core/types"
import {CallbackEvent} from "@pollux/utils"

export class Core {
    public static onSetup: CallbackEvent<ICoreSetup> = new CallbackEvent<ICoreSetup>()
    public static onStart: CallbackEvent<void> = new CallbackEvent<void>()

    public async setup(options: ICoreSetup): Promise<void> {
        Core.onSetup.emit(options)
    }

    public async start(): Promise<void> {
        Core.onStart.emit()
    }
}

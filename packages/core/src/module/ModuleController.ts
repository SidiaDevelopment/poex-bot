import {CallbackEvent, Ctor} from "@pollux/utils"
import {ICoreSetup, IModule} from "@pollux/core/types"
import {addContextData} from "../context/hooks/addContextData"
import {ControllerContext} from "../contexts/ControllerContext"
import {Core} from "../Core"


export class ModuleController {
    public static onLoadModule: CallbackEvent<IModule> = new CallbackEvent<IModule>()

    private modules: Array<IModule> = new Array<IModule>()

    constructor() {
        Core.onStart.addListener(this.init.bind(this))
        Core.onSetup.addListener(this.onSetupCore.bind(this))
    }

    public async init(): Promise<void> {
        for (const module of this.modules) {
            ModuleController.onLoadModule.emit(module)
        }
    }

    public async onSetupCore(setup: ICoreSetup): Promise<void> {
        setup.modules.forEach(this.loadModule.bind(this))
    }

    public loadModule(module: Ctor<IModule>): void {
        const instance = new module()

        this.modules.push(instance)
    }
}

addContextData(ControllerContext, {
    moduleController: new ModuleController()
})

import {IConfigContext, ICoreSetup} from "@pollux/core/types"
import {Context, Core, createContext} from "@pollux/core"
import deepmerge from "deepmerge"

export class ConfigContext extends Context<IConfigContext> {
    constructor() {
        super()

        Core.onSetup.addListener(this.addContextData.bind(this))
    }

    public addData(data: Partial<IConfigContext>) {
        this.data = deepmerge(this.data, data)
    }

    public async addContextData(options: ICoreSetup) {
        this.addData(options.config)
    }
}

createContext(new ConfigContext())

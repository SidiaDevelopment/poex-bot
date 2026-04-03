import {Config} from "../Config"
import {ConfigContext} from "../contexts/ConfigContext"
import {IConfigContext} from "@pollux/core/types"
import {Ctor, PartialRecursive} from "@pollux/utils"
import {addContextData} from "@pollux/core"

export const defaultConfig = <TConfig extends Record<string, unknown> = PartialRecursive<IConfigContext>>(constructor: Ctor<Config<TConfig>>) => {
    const config = new constructor()
    addContextData(ConfigContext, config.data)
}

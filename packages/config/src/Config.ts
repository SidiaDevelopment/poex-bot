import {PartialRecursive} from "@pollux/utils"
import {IConfig} from "@pollux/core/types"

export abstract class Config<T extends PartialRecursive<IConfig>> {
    public abstract data: PartialRecursive<T>
}

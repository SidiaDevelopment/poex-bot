import {Ctor} from "@pollux/utils"
import {TUnknownContext} from "../Context"
import {Contexts} from "../Contexts"

export const addContextData = <T extends TUnknownContext>(ctor: Ctor<T>, data: Partial<T["data"]>): void => Contexts.addValues(ctor, data)

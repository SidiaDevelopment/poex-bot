import {Ctor} from "@pollux/utils"
import {TUnknownContext} from "../Context"
import {Contexts} from "../Contexts"

export const useContext = <T extends TUnknownContext>(ctor: Ctor<T>): T["data"] => Contexts.getData(ctor)

import {Context} from "../context/Context"
import {IControllerContext} from "@pollux/core/types"
import {createContext} from "../context/hooks/createContext"

export class ControllerContext extends Context<IControllerContext> {}

createContext(new ControllerContext())

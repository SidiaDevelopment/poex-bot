import {Ctor} from "@pollux/utils"
import {TUnknownContext} from "./Context"

export class Contexts {
    private static contexts: Record<string, unknown> = {}

    public static register(context: TUnknownContext): void {
        const id = context.constructor.name
        Contexts.contexts[id] = context
    }

    public static getData<T extends TUnknownContext>(ctor: Ctor<T>): T["data"] {
        const context = Contexts.contexts[ctor.name] as T
        return context.getData()
    }

    public static getContext<T extends TUnknownContext>(ctor: Ctor<T>): T {
        return Contexts.contexts[ctor.name] as T
    }

    public static addValues<T extends TUnknownContext>(ctor: Ctor<T>, data: Partial<T["data"]>): void {
        const name = ctor.name

        if (!Contexts.contexts.hasOwnProperty(name))
            throw new RangeError("No context of this type registered")

        const context = Contexts.contexts[name] as T
        context.addData(data)
    }
}

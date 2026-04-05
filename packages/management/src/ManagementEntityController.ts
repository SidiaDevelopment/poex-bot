import {ManagementEntityHandler} from "./ManagementEntityHandler"

export class ManagementEntityController {
    private static handlers: Record<string, ManagementEntityHandler> = {}

    public static addHandler(handler: ManagementEntityHandler): void {
        ManagementEntityController.handlers[handler.entity] = handler
    }

    public static getHandler(entity: string): ManagementEntityHandler | null {
        return ManagementEntityController.handlers[entity] ?? null
    }

    public static getAllHandlers(): ManagementEntityHandler[] {
        return Object.values(ManagementEntityController.handlers)
    }
}

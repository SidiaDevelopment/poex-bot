import {Ctor} from "@pollux/utils"
import {DatabaseService} from "../modules/database/services/DatabaseService"

export const autoLoadEntity = () => {
    return (ctor: Ctor<object>): void => {
        DatabaseService.entities.push(ctor)
    }
}

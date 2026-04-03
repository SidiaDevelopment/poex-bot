import {LocalizationTag} from "../controllers/LocalizationController"
import {ControllerContext, useContext} from "@pollux/core"

export const translate = (path: LocalizationTag, language: string = "en"): string => {
    const {localizationController} = useContext(ControllerContext)
    return localizationController.translate(language, path)
}

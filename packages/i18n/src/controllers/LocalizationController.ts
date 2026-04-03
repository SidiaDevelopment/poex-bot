import deepmerge from "deepmerge"
import {addContextData, ControllerContext, Core, ModuleController, useContext} from "@pollux/core"
import {Leaves, PartialRecursive} from "@pollux/utils"
import {ICoreSetup, ILocalization, IModule} from "@pollux/core/types"
import {LogLevel} from "@pollux/logging"

export type LocalizationOverride = PartialRecursive<ILocalization>
export type LocalizationOverrides = Record<string, LocalizationOverride>
export type LocalizationTag = Leaves<ILocalization>

type LocalizationLanguage = {[key: string]: string | LocalizationLanguage}

declare module "@pollux/core/types" {
    export interface IControllerContext {
        localizationController: LocalizationController
    }

    export interface ICoreSetup {
        localization?: LocalizationOverrides
    }

    export interface IModule {
        localizations?: LocalizationOverrides
    }
}

export class LocalizationController {
    private localizations: Record<string, ILocalization> = {}

    constructor() {
        Core.onStart.addListener(this.init.bind(this))
        Core.onSetup.addListener(this.loadSetup.bind(this))
        ModuleController.onLoadModule.addListener(this.loadModule.bind(this))
    }

    private async init(): Promise<void> {

    }

    private async loadSetup(setup: ICoreSetup): Promise<void> {
        if (!setup.localization) return

        this.addLocalizations(setup.localization)
    }

    private async loadModule(module: IModule): Promise<void> {
        if (!module.localizations) return

        this.addLocalizations(module.localizations)
    }

    public addLocalizations(localizations: LocalizationOverrides): void {
        for (const language in localizations) {
            if (!Object.prototype.hasOwnProperty.call(this.localizations, language))
                this.localizations[language] = {}

            this.localizations[language] = deepmerge(localizations[language], this.localizations[language])
        }
    }

    public translate(language: string, tag: LocalizationTag): string {
        const lang = Object.prototype.hasOwnProperty.call(this.localizations, language)
            ? language
            : "en"

        if (!Object.prototype.hasOwnProperty.call(this.localizations, lang))
            return tag

        const translations = this.localizations[lang]
        const pathName = tag as string
        const splitPath = pathName.split(".")

        let current = translations as LocalizationLanguage
        for (const pathPart of splitPath) {
            if (!Object.prototype.hasOwnProperty.call(current, pathPart)) {
                return this.fallback(language, tag)
            }

            const content = current[pathPart]
            if (typeof content === "string") {
                return content
            }

            current = content
        }

        return ""
    }

    private fallback(language: string, tag: LocalizationTag) {
        const {loggingController: {log}} = useContext(ControllerContext)

        if (language == "en") {
            log("@sidia/i18n", LogLevel.Error, `Missing english translation: ${tag as string}`)
            return tag
        }
        log("@sidia/i18n", LogLevel.Warning, `Missing "${language}" translation: ${tag as string}, returning english translation`)
        return this.translate("en", tag)
    }
}

addContextData(ControllerContext, {
    localizationController: new LocalizationController()
})

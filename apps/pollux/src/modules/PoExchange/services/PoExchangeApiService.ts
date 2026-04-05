import {Service} from "@pollux/service"
import {ConfigContext} from "@pollux/config"
import {ControllerContext, useContext} from "@pollux/core"
import {LogLevel} from "@pollux/logging"
import {VouchCountRequest, VouchRequest, VouchResponse, VouchResponseError} from "../types/VouchTypes"

export class PoExchangeApiService extends Service {
    public async init(): Promise<void> {}

    public async sendVouch(request: VouchRequest): Promise<VouchResponse | VouchResponseError> {
        const {poExchange: {apiUrl: baseUrl, apiKey}} = useContext(ConfigContext)
        if (!baseUrl) {
            throw new Error("PoExchange API URL is not configured")
        }

        const {loggingController} = useContext(ControllerContext)
        loggingController.log("PoExchange", LogLevel.Debug, `Sending vouch request: type=${request.type} voucherId=${request.voucherId}`)

        const url = new URL("/vouch", baseUrl)
        if (apiKey) {
            url.searchParams.set("apiKey", apiKey)
        }

        const response = await fetch(url, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(request)
        })

        return await response.json()
    }

    public async getVouchCount(request: VouchCountRequest): Promise<VouchResponse | VouchResponseError> {
        const {poExchange: {apiUrl: baseUrl, apiKey}} = useContext(ConfigContext)
        if (!baseUrl) {
            throw new Error("PoExchange API URL is not configured")
        }

        const url = new URL("/vouch/count", baseUrl)
        if (apiKey) {
            url.searchParams.set("apiKey", apiKey)
        }

        const response = await fetch(url, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(request)
        })
        return await response.json()
    }
}

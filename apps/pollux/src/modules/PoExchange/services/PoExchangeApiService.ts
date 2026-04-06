import {Service} from "@pollux/service"
import {ConfigContext} from "@pollux/config"
import {ControllerContext, useContext} from "@pollux/core"
import {LogLevel} from "@pollux/logging"
import {VouchCountRequest, VouchRequest, VouchResponse, VouchResponseError, VouchResponseSaved} from "../types/VouchTypes"

export class PoExchangeApiService extends Service {
    public async init(): Promise<void> {}

    private getHeaders(): Record<string, string> {
        const {poExchange: {apiKey}} = useContext(ConfigContext)
        const headers: Record<string, string> = {"Content-Type": "application/json"}
        if (apiKey) {
            headers["x-api-key"] = apiKey
        }
        return headers
    }

    private buildUrl(path: string): URL {
        const {poExchange: {apiUrl: baseUrl, apiKey}} = useContext(ConfigContext)
        const url = new URL(path, baseUrl)
        if (apiKey) {
            url.searchParams.set("apiKey", apiKey)
        }
        return url
    }

    public async sendVouch(request: VouchRequest): Promise<VouchResponse | VouchResponseError | VouchResponseSaved> {
        const {loggingController} = useContext(ControllerContext)
        loggingController.log("PoExchange", LogLevel.Debug, `Sending vouch request: type=${request.type} voucherId=${request.voucherId}`)

        const response = await fetch(this.buildUrl("/api/v1/discord-vouches"), {
            method: "POST",
            headers: this.getHeaders(),
            body: JSON.stringify(request)
        })

        return await response.json()
    }

    public async getVouchCount(request: VouchCountRequest): Promise<VouchResponse | VouchResponseError> {
        const url = this.buildUrl("/api/v1/discord-vouches/count")
        if (request.discordId) {
            url.searchParams.set("discordId", request.discordId)
        }
        if (request.username) {
            url.searchParams.set("username", request.username)
        }

        const response = await fetch(url, {headers: this.getHeaders()})
        return await response.json()
    }
}

import {route, ApiHandler, IApiRequestData, HttpMethod} from "@pollux/api"
import {injectService} from "@pollux/service"
import {PoExchangeService, IPoExchangePostResult} from "../services/PoExchangeService"

const routeConfig = {
    method: HttpMethod.POST,
    path: "/poex/push"
}

@route(routeConfig)
export class PoExchangePostRoute extends ApiHandler<IApiRequestData> {
    @injectService
    private poExchangeService!: PoExchangeService

    public handle = async ({req, res}: IApiRequestData): Promise<void> => {
        const apiKey = req.query.apiKey as string
        if (!apiKey || apiKey !== process.env.API_KEY) {
            res.status(401).json({status: "error", errorMessage: "Invalid or missing API key"})
            return
        }

        const {user, posts, guildId} = req.body

        if (!user || !posts || !guildId) {
            res.status(400).json({status: "error", errorMessage: "Missing required fields: user, posts, guildId"})
            return
        }

        if (!user.name || user.vouches === undefined) {
            res.status(400).json({status: "error", errorMessage: "User must have: name, vouches"})
            return
        }

        if (!Array.isArray(posts) || posts.length === 0) {
            res.status(400).json({status: "error", errorMessage: "Posts must be a non-empty array"})
            return
        }

        const results: IPoExchangePostResult[] = []

        for (const post of posts) {
            if (!post.channelId || !post.action) {
                results.push({channelId: post.channelId ?? "unknown", status: "error", errorMessage: "Post must have: channelId, action"})
                continue
            }

            const result = await this.poExchangeService.processPost(user, post, guildId)
            results.push(result)
        }

        const hasErrors = results.some(r => r.status === "error")
        res.status(hasErrors ? 207 : 200).json({status: hasErrors ? "partial" : "ok", results})
    }
}

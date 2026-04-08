import {Request, Response} from "express"

export function validateApiKey(req: Request, res: Response): boolean {
    const apiKey = req.query.apiKey as string
    if (!apiKey || apiKey !== process.env.API_KEY) {
        res.status(401).json({status: "error", errorMessage: "Invalid or missing API key"})
        return false
    }
    return true
}

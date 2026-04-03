import {Request, Response} from "express"

export interface IApiRequestData {
    req: Request
    res: Response
}

export enum HttpMethod {
    GET = "get",
    POST = "post",
    PUT = "put",
    PATCH = "patch",
    DELETE = "delete"
}

export interface IApiRouteConfig {
    method: HttpMethod
    path: string
}

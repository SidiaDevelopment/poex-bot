export interface VouchRequest {
    type: "message" | "button"
    voucherId: string
    channelId: string
    channelName: string
    messageId?: string
    messageContent?: string
}

export interface VouchCountRequest {
    username?: string
    discordId?: string
}

export interface VouchResponse {
    username: string
    discordId?: string
    uniqueVouches: number
    totalVouches: number
}

export interface VouchResponseError {
    error: "no_user"
    connectUrl: string
}

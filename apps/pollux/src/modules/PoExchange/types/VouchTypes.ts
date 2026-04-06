export interface VouchRequest {
    type: "message" | "button"
    voucherId: string
    channelId: string
    channelName: string
    messageId?: string
    messageContent?: string
    targetId?: string
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
    seasonVouches: number
    /** ISO 8601 UTC date string */
    joinDate?: string
}

export interface VouchResponseError {
    error: "no_user"
}

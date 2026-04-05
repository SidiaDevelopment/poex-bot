import {NextRequest, NextResponse} from "next/server"
import {getGuildDiscordData, invalidateDiscordDataCache} from "@/lib/bot-api"

export async function GET(_request: NextRequest, {params}: {params: Promise<{guildId: string}>}) {
    const {guildId} = await params
    try {
        const data = await getGuildDiscordData(guildId)
        return NextResponse.json(data)
    } catch {
        return NextResponse.json({channels: [], roles: []}, {status: 500})
    }
}

export async function DELETE(_request: NextRequest, {params}: {params: Promise<{guildId: string}>}) {
    const {guildId} = await params
    invalidateDiscordDataCache(guildId)
    try {
        const data = await getGuildDiscordData(guildId)
        return NextResponse.json(data)
    } catch {
        return NextResponse.json({channels: [], roles: []}, {status: 500})
    }
}

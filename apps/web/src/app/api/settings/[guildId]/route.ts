import {NextRequest, NextResponse} from "next/server"
import {getGuildSettings, setGuildSetting} from "@/lib/bot-api"

export async function GET(_request: NextRequest, {params}: {params: Promise<{guildId: string}>}) {
    const {guildId} = await params
    try {
        const data = await getGuildSettings(guildId)
        return NextResponse.json(data)
    } catch {
        return NextResponse.json({error: "Failed to fetch settings"}, {status: 500})
    }
}

export async function POST(request: NextRequest, {params}: {params: Promise<{guildId: string}>}) {
    const {guildId} = await params
    const {key, value} = await request.json()
    try {
        const data = await setGuildSetting(guildId, key, value)
        return NextResponse.json(data)
    } catch {
        return NextResponse.json({error: "Failed to save setting"}, {status: 500})
    }
}

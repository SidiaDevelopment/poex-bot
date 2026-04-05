import {NextRequest, NextResponse} from "next/server"
import {getGuildEntities, createGuildEntity} from "@/lib/bot-api"

export async function GET(_request: NextRequest, {params}: {params: Promise<{guildId: string, entity: string}>}) {
    const {guildId, entity} = await params
    try {
        const data = await getGuildEntities(guildId, entity)
        return NextResponse.json(data)
    } catch {
        return NextResponse.json({error: "Failed to fetch entities"}, {status: 500})
    }
}

export async function POST(request: NextRequest, {params}: {params: Promise<{guildId: string, entity: string}>}) {
    const {guildId, entity} = await params
    const body = await request.json()
    try {
        const data = await createGuildEntity(guildId, entity, body)
        return NextResponse.json(data)
    } catch {
        return NextResponse.json({error: "Failed to create entity"}, {status: 500})
    }
}

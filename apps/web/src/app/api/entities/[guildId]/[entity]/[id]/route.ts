import {NextRequest, NextResponse} from "next/server"
import {deleteGuildEntity} from "@/lib/bot-api"

export async function DELETE(_request: NextRequest, {params}: {params: Promise<{guildId: string, entity: string, id: string}>}) {
    const {guildId, entity, id} = await params
    try {
        const data = await deleteGuildEntity(guildId, entity, id)
        return NextResponse.json(data)
    } catch {
        return NextResponse.json({error: "Failed to delete entity"}, {status: 500})
    }
}

import {NextResponse} from "next/server"
import {config} from "@/lib/config"

export async function GET() {
    const params = new URLSearchParams({
        client_id: config.discord.clientId,
        redirect_uri: config.discord.redirectUrl,
        response_type: "code",
        scope: "identify guilds"
    })

    return NextResponse.redirect(`https://discord.com/api/oauth2/authorize?${params}`)
}

import {NextResponse} from "next/server"
import {getSession} from "@/lib/session"

export async function GET() {
    const session = await getSession()
    if (!session) {
        return NextResponse.json(null, {status: 401})
    }

    const res = await fetch("https://discord.com/api/v10/users/@me", {
        headers: {Authorization: `Bearer ${session.accessToken}`}
    })

    if (!res.ok) {
        return NextResponse.json(null, {status: 401})
    }

    const user = await res.json()
    return NextResponse.json({
        id: user.id,
        username: user.username,
        avatar: user.avatar
    })
}

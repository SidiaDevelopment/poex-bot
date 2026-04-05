import {NextResponse} from "next/server"
import {clearSession} from "@/lib/session"

export async function GET() {
    await clearSession()
    return NextResponse.redirect(new URL("/", process.env.DISCORD_REDIRECT_URL ?? "http://localhost:3026"))
}

import {NextRequest, NextResponse} from "next/server"
import {config} from "@/lib/config"
import {encodeSession} from "@/lib/session"

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code")
    if (!code) {
        return NextResponse.redirect(new URL("/", config.baseUrl))
    }

    const body = new URLSearchParams({
        client_id: config.discord.clientId,
        client_secret: config.discord.clientSecret,
        grant_type: "authorization_code",
        code,
        redirect_uri: config.discord.redirectUrl,
        scope: "identify guilds"
    })

    const tokenRes = await fetch("https://discord.com/api/v10/oauth2/token", {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body
    })

    if (!tokenRes.ok) {
        const errorBody = await tokenRes.text()
        console.error("[auth/callback] Token exchange failed:", tokenRes.status, errorBody)
        return NextResponse.redirect(new URL("/", config.baseUrl))
    }

    const {access_token} = await tokenRes.json()

    const response = NextResponse.redirect(new URL("/dashboard", config.baseUrl))
    response.cookies.set("pollux_session", encodeSession({accessToken: access_token}), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/"
    })
    return response
}

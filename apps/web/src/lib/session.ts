import {cookies} from "next/headers"

const COOKIE_NAME = "pollux_session"

interface SessionData {
    accessToken: string
}

export function encodeSession(data: SessionData): string {
    return Buffer.from(JSON.stringify(data)).toString("base64")
}

function decode(value: string): SessionData | null {
    try {
        return JSON.parse(Buffer.from(value, "base64").toString("utf-8"))
    } catch {
        return null
    }
}

export async function getSession(): Promise<SessionData | null> {
    const cookieStore = await cookies()
    const cookie = cookieStore.get(COOKIE_NAME)
    if (!cookie) return null
    return decode(cookie.value)
}

export async function setSession(data: SessionData): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, encodeSession(data), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/"
    })
}

export async function clearSession(): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_NAME)
}

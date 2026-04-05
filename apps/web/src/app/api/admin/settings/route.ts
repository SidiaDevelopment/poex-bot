import {NextRequest, NextResponse} from "next/server"
import {getGlobalSettings, setGlobalSetting} from "@/lib/bot-api"

export async function GET() {
    try {
        const data = await getGlobalSettings()
        return NextResponse.json(data)
    } catch {
        return NextResponse.json({error: "Failed to fetch settings"}, {status: 500})
    }
}

export async function POST(request: NextRequest) {
    const {key, value} = await request.json()
    try {
        const data = await setGlobalSetting(key, value)
        return NextResponse.json(data)
    } catch {
        return NextResponse.json({error: "Failed to save setting"}, {status: 500})
    }
}

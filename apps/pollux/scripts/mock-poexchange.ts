import express from "express"

const app = express()
app.use(express.json())

const PORT = 3001

interface UserData {
    username: string
    discordId?: string
    uniqueVouches: number
    totalVouches: number
    seasonVouches: number
    currentCycle: string
    joinDate: string
}

// In-memory user store keyed by discordId or username
const users: Record<string, UserData> = {}

function getOrCreateUser(discordId?: string, username?: string): UserData {
    const key = discordId ?? username ?? "unknown"
    if (!users[key]) {
        users[key] = {
            username: username ?? "MockUser",
            discordId: discordId,
            uniqueVouches: 0,
            totalVouches: 0,
            seasonVouches: 0,
            currentCycle: "Cycle 1",
            joinDate: "2024-03-15T10:30:00Z"
        }
    }
    return users[key]
}

// Validate x-api-key header is present
app.use((req, res, next) => {
    if (!req.headers["x-api-key"]) {
        res.status(401).json({error: "Missing x-api-key header"})
        return
    }
    next()
})

// Mock vouch endpoint
app.post("/api/v1/discord-vouches", (req, res) => {
    const {type, voucherId, targetId, messageId, messageContent} = req.body
    console.log(`[vouch] type=${type} voucherId=${voucherId} targetId=${targetId ?? "-"} messageId=${messageId ?? "-"} messageContent=${messageContent ?? "-"}`)

    // Simulate "no_user" error when voucherId is "unknown" or messageContent contains "fail"
    if (voucherId === "unknown" || (messageContent && messageContent.toLowerCase().includes("fail"))) {
        res.json({error: "no_user"})
        return
    }

    const user = getOrCreateUser(targetId ?? "183382329400623104")
    user.uniqueVouches++
    user.totalVouches++
    user.seasonVouches++

    console.log(`  -> ${user.username} now has ${user.uniqueVouches} unique / ${user.totalVouches} total / ${user.seasonVouches} season`)

    res.json({...user})
})

// Mock vouch count endpoint
app.get("/api/v1/discord-vouches/count", (req, res) => {
    const username = req.query.username as string | undefined
    const discordId = req.query.discordId as string | undefined
    console.log(`[vouch/count] username=${username ?? "-"} discordId=${discordId ?? "-"}`)

    if (!username && !discordId) {
        res.status(400).json({error: "username or discordId required"})
        return
    }

    if ((username && username.toLowerCase().includes("fail")) || discordId === "unknown") {
        res.json({error: "no_user"})
        return
    }

    const isUnlinked = username && username.toLowerCase().includes("unlinked")
    const user = getOrCreateUser(isUnlinked ? undefined : discordId, username)

    res.json({...user})
})

app.listen(PORT, () => {
    console.log(`Mock poexchange API running on http://localhost:${PORT}`)
    console.log("")
    console.log("Endpoints:")
    console.log("  POST /api/v1/discord-vouches        - Submit a vouch (use voucherId='unknown' or 'fail' in messageContent to trigger no_user error)")
    console.log("  GET  /api/v1/discord-vouches/count  - Get vouch count by ?username= or ?discordId= ('fail' for error, 'unlinked' for no discord)")
    console.log("")
    console.log("Vouches start at 0 and increment with each POST")
})

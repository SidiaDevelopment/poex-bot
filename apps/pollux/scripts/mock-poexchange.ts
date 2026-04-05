import express from "express"

const app = express()
app.use(express.json())

const PORT = 3001

// Validate x-api-key header is present
app.use((req, res, next) => {
    if (!req.headers["x-api-key"]) {
        res.status(401).json({error: "Missing x-api-key header"})
        return
    }
    next()
})

// Mock vouch endpoint
app.post("/discord-vouches", (req, res) => {
    const {type, voucherId, messageId, messageContent} = req.body
    console.log(`[vouch] type=${type} voucherId=${voucherId} messageId=${messageId ?? "-"} messageContent=${messageContent ?? "-"}`)

    // Simulate "no_user" error when voucherId is "unknown" or messageContent contains "fail"
    if (voucherId === "unknown" || (messageContent && messageContent.toLowerCase().includes("fail"))) {
        res.json({
            error: "no_user"
        })
        return
    }

    // Normal success response
    res.json({
        username: "MockUser",
        discordId: "183382329400623104",
        uniqueVouches: 42,
        totalVouches: 128,
        seasonVouches: 12,
        createdAt: "2024-03-15T10:30:00Z"
    })
})

// Mock vouch count endpoint
app.get("/discord-vouches/count", (req, res) => {
    const username = req.query.username as string | undefined
    const discordId = req.query.discordId as string | undefined
    console.log(`[vouch/count] username=${username ?? "-"} discordId=${discordId ?? "-"}`)

    if (!username && !discordId) {
        res.status(400).json({error: "username or discordId required"})
        return
    }

    if ((username && username.toLowerCase().includes("fail")) || discordId === "unknown") {
        res.json({
            error: "no_user"
        })
        return
    }

    const isUnlinked = (username && username.toLowerCase().includes("unlinked"))

    res.json({
        username: username ?? "MockUser",
        ...(!isUnlinked && {discordId: "183382329400623104"}),
        uniqueVouches: 42,
        totalVouches: 128,
        seasonVouches: 12,
        createdAt: "2024-03-15T10:30:00Z"
    })
})

app.listen(PORT, () => {
    console.log(`Mock poexchange API running on http://localhost:${PORT}`)
    console.log("")
    console.log("Endpoints:")
    console.log("  POST /discord-vouches        - Submit a vouch (use voucherId='unknown' or 'fail' in messageContent to trigger no_user error)")
    console.log("  GET  /discord-vouches/count  - Get vouch count by ?username= or ?discordId= ('fail' for error, 'unlinked' for no discord)")
})

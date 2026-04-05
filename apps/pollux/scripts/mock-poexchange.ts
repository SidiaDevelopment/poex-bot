import express from "express"

const app = express()
app.use(express.json())

const PORT = 3001

// Mock vouch endpoint
app.post("/vouch", (req, res) => {
    const {type, voucherId, messageId, messageContent} = req.body
    console.log(`[vouch] type=${type} voucherId=${voucherId} messageId=${messageId ?? "-"} messageContent=${messageContent ?? "-"}`)

    // Simulate "no_user" error when voucherId is "unknown" or messageContent contains "fail"
    if (voucherId === "unknown" || (messageContent && messageContent.toLowerCase().includes("fail"))) {
        res.json({
            error: "no_user",
            connectUrl: "https://maxroll.gg/poe/poexchange/connect-discord"
        })
        return
    }

    // Normal success response
    res.json({
        username: "MockUser",
        discordId: "183382329400623104",
        uniqueVouches: 42,
        totalVouches: 128
    })
})

// Mock vouch count endpoint
app.post("/vouch/count", (req, res) => {
    const {username, discordId} = req.body
    console.log(`[vouch/count] username=${username ?? "-"} discordId=${discordId ?? "-"}`)

    if (!username && !discordId) {
        res.status(400).json({error: "username or discordId required"})
        return
    }

    res.json({
        username: username ?? "MockUser",
        discordId: "183382329400623104",
        uniqueVouches: 42,
        totalVouches: 128
    })
})

app.listen(PORT, () => {
    console.log(`Mock poexchange API running on http://localhost:${PORT}`)
    console.log("")
    console.log("Endpoints:")
    console.log("  POST /vouch         - Submit a vouch (use voucherId='unknown' or 'fail' in messageContent to trigger no_user error)")
    console.log("  POST /vouch/count   - Get vouch count by {username} or {discordId} in body")
})

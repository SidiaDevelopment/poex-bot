export const config = {
    botApiUrl: process.env.BOT_API_URL ?? "http://localhost:3025",
    discord: {
        clientId: process.env.DISCORD_CLIENT_ID ?? "",
        clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
        redirectUrl: process.env.DISCORD_REDIRECT_URL ?? "http://localhost:3026/api/auth/callback",
    },
    sessionSecret: process.env.SESSION_SECRET ?? "change-me"
}

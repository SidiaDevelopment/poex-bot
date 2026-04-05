# Pollux

Discord service bot for PoExchange, built on the Pollux framework.

## Setup

1. Copy `.env.example` or create `.env` with the required variables:

```env
DISCORD_KEY=           # Discord bot token
API_KEY=               # API key for the /poex/push endpoint
POEXCHANGE_API_URL=    # PoExchange API base URL
POEXCHANGE_API_KEY=    # API key for PoExchange API (optional)

# Database (defaults to sqlite for dev)
DB_TYPE=               # "sqlite" or "mysql"
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=           # defaults to ./data/dev.sq3 for sqlite
```

2. Install dependencies:

```bash
yarn install
```

3. Start in development mode:

```bash
yarn workspace @pollux/pollux bot:dev
```

## Scripts

| Script | Description |
|---|---|
| `bot:dev` | Start with nodemon (auto-reload) |
| `start` | Start without auto-reload |
| `build` | Compile TypeScript |
| `migration:generate` | Generate a new database migration |
| `migration:run` | Run pending migrations |
| `migration:revert` | Revert last migration |
| `mock:poexchange` | Start mock PoExchange API on port 3001 |

## Testing

Shell scripts for testing the API are in `scripts/`:

```bash
bash scripts/test-poex.sh        # Test all service categories + strike
bash scripts/test-update.sh      # Test create + update flow
```

Both scripts read `API_KEY` from `.env` automatically.

## Modules

- [Health](src/modules/Health/) - Health check endpoint
- [Ping](src/modules/Ping/) - Bot ping/latency command
- [PoExchange](src/modules/PoExchange/) - Service listings and vouch system

## Settings

Configured via `/settings set key:<key> value:<value>`:

| Key | Default | Description |
|---|---|---|
| `poex.vouchEnabled` | `false` | Enable vouch buttons on service messages |
| `poex.vouchChannel` | | Channel ID for vouch messages |

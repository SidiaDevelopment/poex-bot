# PoExchange Module

Service listing management and vouch system for PoExchange.

## Service Listings

Service messages are posted via the external API and formatted per category (Boss Killing, Nightmare Maps, etc.). Each message includes an optional vouch button (controlled by `poex.vouchEnabled`).

### API

| Method | Path | Description |
|---|---|---|
| `POST` | `/poex/push?apiKey=<key>` | Create, update, refresh, or strike service messages |

### Commands

| Command | Permission | Description |
|---|---|---|
| `/poex channel set mapping:<type> target:#channel` | Manage Guild | Map a service category to a Discord channel |
| `/poex channel remove mapping:<type>` | Manage Guild | Remove a channel mapping |

## Vouch System

Users can vouch for service providers through multiple methods. All vouch requests are forwarded to the PoExchange API.

### Vouch Methods

| Method | Description |
|---|---|
| Vouch button | Green button below service messages (when `poex.vouchEnabled` is `true`) |
| `/vouch send target:@user` | Slash command to vouch for a user |
| `@user <text>` | Message in the vouch channel |

### Vouch Count

| Method | Description |
|---|---|
| `/vouch count target:@user` | Slash command to check vouch count |
| `?v @user` | Message in the vouch channel |

### Settings

| Key | Default | Description |
|---|---|---|
| `poex.vouchEnabled` | `false` | Enable vouch buttons on service messages |
| `poex.vouchChannel` | | Channel ID where vouch messages and `?v` queries are handled |

### Services

| Service | Description |
|---|---|
| `PoExchangeService` | Service message CRUD, embed formatting, vouch button rendering |
| `PoExchangeApiService` | HTTP client for the PoExchange API (vouch and vouch count) |
| `VouchService` | Handles vouch button interactions |
| `MessageVouchService` | Handles `@user <text>` vouches and `?v @user` count queries |

### Configuration

Set `POEXCHANGE_API_URL` and optionally `POEXCHANGE_API_KEY` in `.env`. For local development, run the mock server:

```bash
yarn workspace @pollux/pollux mock:poexchange
```

The mock server returns error responses when `messageContent` contains "fail" or `voucherId` is "unknown".

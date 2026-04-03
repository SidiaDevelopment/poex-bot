# `@pollux/discord`

Discord.js integration module for Pollux. Manages the bot client lifecycle, guild interactions, and event handling as Pollux services.

## Installation

```sh
yarn add @pollux/discord
```

## Key Exports

- `DiscordModule` — Pollux module that registers all Discord services
- `DiscordService` — manages the Discord.js `Client` lifecycle (login, ready)
- `DiscordEventService` — registers and dispatches Discord gateway events
- `DiscordGuildService` — helpers for guild-related operations

# `@pollux/discord-command`

Slash command framework for Discord bots built with Pollux. Handles command registration, routing, and execution with built-in i18n support.

## Installation

```sh
yarn add @pollux/discord-command
```

## Key Exports

- `DiscordCommandModule` — Pollux module that wires up command handling
- `DiscordCommand` — base class for slash commands
- `DiscordCommandController` — controller for registering command classes
- `@command` — decorator for declaring a slash command and its metadata
- `DiscordCommandService` — routes incoming interactions to the correct handler
- `DiscordUpdateCommandsService` — syncs registered commands with the Discord API
- `IDiscordCommandOption` / `IDiscordCommandData` — option and command metadata types

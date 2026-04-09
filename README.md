# pollux-framework

[![CI](https://github.com/SidiaDevelopment/poex-bot/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/SidiaDevelopment/poex-bot/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/github/license/SidiaDevelopment/poex-bot)](LICENSE)
![Last commit](https://img.shields.io/github/last-commit/SidiaDevelopment/poex-bot)

A modular TypeScript framework for building Discord bots with a service-oriented architecture.

## Packages

| Package | Description |
|---|---|
| [`@pollux/core`](packages/core) | Module system, context management, and lifecycle events |
| [`@pollux/config`](packages/config) | Configuration management with deep merge support |
| [`@pollux/logging`](packages/logging) | Structured logging with configurable strategies |
| [`@pollux/service`](packages/service) | Service dependency injection and lifecycle management |
| [`@pollux/database`](packages/database) | TypeORM-based database integration |
| [`@pollux/api`](packages/api) | REST API framework for exposing module endpoints |
| [`@pollux/discord`](packages/discord) | Discord.js integration module |
| [`@pollux/discord-command`](packages/discord-command) | Slash command framework for Discord |
| [`@pollux/i18n`](packages/i18n) | Internationalization and localization support |
| [`@pollux/settings`](packages/settings) | Persistent per-guild settings management |
| [`@pollux/utils`](packages/utils) | Shared TypeScript utility types and event primitives |

## Getting Started

```sh
yarn install
yarn turbo
```

## Development

```sh
yarn turbo:dev
```

## Linting

```sh
yarn lint
```

## Repository

[github.com/SidiaDevelopment/poex-bot](https://github.com/SidiaDevelopment/poex-bot)

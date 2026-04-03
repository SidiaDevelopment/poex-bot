# `@pollux/database`

TypeORM-based database integration module for Pollux. Manages the data source lifecycle as a Pollux service.

## Installation

```sh
yarn add @pollux/database
```

SQLite support (optional):

```sh
yarn add sqlite3
```

## Key Exports

- `DatabaseModule` — Pollux module that registers the database service
- `DatabaseService` — service wrapping the TypeORM `DataSource`
- `@autoLoadEntity` — decorator to automatically register an entity with the data source

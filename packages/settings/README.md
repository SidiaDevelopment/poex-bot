# `@pollux/settings`

Persistent settings management for Pollux bots. Modules declare their settings with typed keys and default values. Values are stored in the database and exposed via three built-in Discord slash commands.

## Installation

```sh
yarn add @pollux/settings
```

Requires `@pollux/database` (with SQLite or another TypeORM driver) to be configured in your app.

## Usage

### 1. Register the module

```ts
import {SettingsModule} from "@pollux/settings"

core.setup({
    modules: [DatabaseModule, SettingsModule, ...]
})
```

`DatabaseModule` must be listed before `SettingsModule` so the database is ready when settings are loaded.

### 2. Declare setting keys (in `MyModuleDeclaration.ts`)

```ts
export const SETTING_WELCOME_CHANNEL = "myModule.welcomeChannel"
export const SETTING_PREFIX = "myModule.prefix"
```

### 3. Register settings with defaults (in `MyModule.ts`)

```ts
import {IModule} from "@pollux/core/types"
import {SETTING_WELCOME_CHANNEL, SETTING_PREFIX} from "./MyModuleDeclaration"

export class MyModule implements IModule {
    public name = "myModule"
    public settings = [
        {key: SETTING_WELCOME_CHANNEL, defaultValue: "", description: "myModule.settings.welcomeChannel"},
        {key: SETTING_PREFIX, defaultValue: "!", description: "myModule.settings.prefix"}
    ]
}
```

### 4. Read settings at runtime

```ts
import {useSetting} from "@pollux/settings"
import {SETTING_PREFIX} from "./MyModuleDeclaration"

const prefix = useSetting(SETTING_PREFIX) // returns stored value or default
```

## Discord Commands

| Command | Description |
|---|---|
| `/settings set key value` | Set a setting to a new value |
| `/settings get key` | Read the current value of a setting |
| `/settings list module` | List all settings for a module with their current and default values |

## Key Exports

- `SettingsModule` — Pollux module that registers the service and commands
- `IModuleSetting` — interface for declaring a setting (`key`, `defaultValue`, `description`)
- `SettingsController` — tracks all registered setting definitions (available via `ControllerContext`)
- `SettingsService` — service that reads/writes values to the database
- `useSetting(key)` — hook for reading a setting value at runtime

# `@pollux/config`

Configuration management for Pollux modules. Supports deep merging of default and user-provided configs via the `@defaultConfig` decorator and exposes config through the `ConfigContext`.

## Installation

```sh
yarn add @pollux/config
```

## Key Exports

- `Config` — base config class
- `ConfigContext` — context for accessing the current module config
- `defaultConfig` — decorator for defining default configuration values

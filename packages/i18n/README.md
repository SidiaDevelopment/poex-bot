# `@pollux/i18n`

Internationalization and localization support for Pollux bots. Provides a controller for registering translation namespaces and a `translate` hook for resolving strings at runtime.

## Installation

```sh
yarn add @pollux/i18n
```

## Key Exports

- `LocalizationController` — registers and merges locale namespaces
- `translate` — hook for translating a key within a namespace
- `ILocalization` — interface for defining a locale namespace

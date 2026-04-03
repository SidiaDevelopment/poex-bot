# `@pollux/core`

Core of the Pollux framework. Provides the module system, typed context management, and the `Core` lifecycle (`setup` / `start`) that all other packages build on.

## Installation

```sh
yarn add @pollux/core
```

## Key Exports

- `Core` — main class with `setup()` and `start()` lifecycle methods and static `onSetup` / `onStart` events
- `ModuleController` — manages module registration and initialization
- `Context` / `Contexts` — typed context system for sharing data between modules
- `useContext` / `createContext` / `addContextData` — context hooks
- `ControllerContext` / `IControllerContext` — built-in controller context

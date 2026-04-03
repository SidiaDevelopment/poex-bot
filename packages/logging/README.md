# `@pollux/logging`

Structured logging system for Pollux with configurable log strategies, log levels, and decorators.

## Installation

```sh
yarn add @pollux/logging
```

## Key Exports

- `LogLevel` — enum of available log levels
- `LoggingController` — controller for managing active log strategies
- `LogStrategy` / `ILogStrategy` — base class and interface for custom strategies
- `ConsoleLogStrategy` — built-in console output strategy
- `LoggingConfig` / `ILoggingConfig` — configuration schema for logging
- `@log` — method decorator for automatic call logging
- `@logger` — class decorator to attach a logger instance

# `@pollux/service`

Service dependency injection and lifecycle management for Pollux modules. Services are registered per module and initialized at startup.

## Installation

```sh
yarn add @pollux/service
```

## Key Exports

- `Service` — abstract base class for all services (requires `init()` implementation)
- `ServiceController` — manages service registration, resolution, and initialization
- `@injectService` — decorator for injecting a service instance into a class property

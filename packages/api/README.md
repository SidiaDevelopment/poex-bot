# `@pollux/api`

REST API framework for exposing module endpoints with Pollux. Mounts Express routes from registered controllers and wires them into the Pollux service lifecycle.

## Installation

```sh
yarn add @pollux/api
```

## Key Exports

- `ApiModule` — Pollux module that registers the Express HTTP server
- `ApiService` — service that starts and manages the Express app
- `ApiController` — controller for registering route handlers from modules
- `ApiHandler` — base class for route handler implementations
- `@route` — decorator for declaring HTTP route metadata on a handler
- `IApiRouteConfig` / `IApiRequestData` / `IApiControllerData` — route configuration and request data types

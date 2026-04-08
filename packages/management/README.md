# `@pollux/management`

Management schema types and entity handler infrastructure for Pollux modules. Modules declare their management UI schema (sections, fields, tables) via the `management` property, which is consumed by the web interface.

## Installation

```sh
yarn add @pollux/management
```

## Key Exports

- `IManagementPage` / `IManagementSection` / `IManagementTable` — schema interfaces for declaring module management UI
- `IManagementField` / `IManagementTableColumn` — field and column descriptors with type support (`string`, `boolean`, `channel`, `role`, `number`)
- `ManagementEntityController` — controller that tracks registered entity handlers
- `ManagementEntityHandler` — base class for entity CRUD handlers
- `@managementEntity` — decorator to register an entity handler class

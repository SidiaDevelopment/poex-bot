# `@pollux/utils`

Shared TypeScript utility types and event primitives used across the Pollux framework.

## Installation

```sh
yarn add @pollux/utils
```

## Key Exports

- `Ctor<T>` — constructor type helper
- `PartialRecursive<T>` — deeply partial type
- `RequiredRecursive<T>` — deeply required type
- `Leaves<T>` — union of all leaf key paths in a type
- `CallbackEvent<T>` — typed pub/sub event primitive

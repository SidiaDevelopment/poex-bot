export type Ctor<T> = { new (...args: unknown[]): T }
export type Ctors<T> = Ctor<T>[]

export type RequiredRecursive<T> = Required<{
    [P in keyof T]: NonNullable<T[P]> extends (infer Q)[]
        ? Array<Q>
        : NonNullable<T[P]> extends object
            ? RequiredRecursive<T[P]>
            : T[P]
}>;

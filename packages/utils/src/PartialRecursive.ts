export type PartialRecursive<T> = {
    [P in keyof T]?:
    NonNullable<T[P]> extends (infer U)[] ? PartialRecursive<U>[] :
        NonNullable<T[P]> extends object ? PartialRecursive<T[P]> : T[P]
}

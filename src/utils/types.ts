export type RequiredOnly<T extends object> = Pick<T, {
    [K in keyof T]: undefined extends T[K] ? never : K
}[keyof T]>

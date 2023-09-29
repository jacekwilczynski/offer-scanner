import { PartialDeep } from 'type-fest';

/**
 * A TypeScript cheat for unit tests. Lets you can create objects that TS sees as complete,
 * without specifying properties that don't matter in the current scenario.
 *
 * @example resulting type inferred from usage
 * type User = {
 *     id: string
 *     name: string
 * }
 *
 * const user: User = fromPartial({ id: '123' });
 *
 * declare function acceptUser(user: User): void;
 * acceptUser(fromPartial({ name: 'someone' }));
 *
 * @example resulting type not inferrable from usage - must be specified explicitly
 * const user = fromPartial<User>({ id: '123' });
 */
export function fromPartial<T extends object>(partial: PartialDeep<NoInfer<T>>) {
    return partial as T;
}

/**
 * Got it from here: https://www.youtube.com/watch?v=HyqHhjKMnyE, no idea why it works XDDD, but it makes it possible
 * to use `fromPartial` without explicit `<ExpectedType>` in places where the expected type is known.
 */
type NoInfer<T> = [T][T extends any ? 0 : never]

type Service = unknown;
type Factory = () => Promise<Service>;

const cache = new Map<Factory, Service>();

/**
 * Guarantees that any time a service is requested, the same instance will be provided.
 */
export function shared<F extends Factory>(factory: F) {
    return async () => {
        if (!cache.has(factory)) {
            cache.set(factory, await factory());
        }

        return cache.get(factory) as Awaited<ReturnType<F>>;
    };
}

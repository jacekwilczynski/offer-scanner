type Service = unknown;
type Factory = () => Promise<Service>;

const cache = new Map<Factory, Service>();

export function shared<F extends Factory>(factory: F) {
    return async () => {
        if (!cache.has(factory)) {
            cache.set(factory, await factory());
        }

        return cache.get(factory) as Awaited<ReturnType<F>>;
    };
}

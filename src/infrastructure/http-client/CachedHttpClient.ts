import { Cache } from 'src/infrastructure/cache/Cache';
import { HttpClient } from 'src/application/interfaces/HttpClient';

/**
 * Decorator for development purposes, to reduce the number of requests to third party websites.
 */
export class CachedHttpClient implements HttpClient {
    private static readonly TTL_SECONDS = 600;

    constructor(
        private readonly inner: HttpClient,
        private readonly cache: Cache,
    ) {
    }

    async fetchText(url: string) {
        const dataFromCache = await this.cache.get(url);

        if (dataFromCache) {
            return dataFromCache;
        }

        const freshData = await this.inner.fetchText(url);

        // no await because we don't need confirmation
        this.cache.set(url, freshData, CachedHttpClient.TTL_SECONDS);

        return freshData;
    }
}

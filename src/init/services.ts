import { RealHttpClient } from 'src/http-client/RealHttpClient';
import { Cache } from 'src/cache/Cache';
import { CachedHttpClient } from 'src/http-client/CachedHttpClient';
import { HttpClient } from 'src/http-client/HttpClient';
import * as redis from 'redis';

export const cache = new Cache(redis.createClient({ url: process.env.REDIS_URL }));

export let httpClient: HttpClient = new RealHttpClient();
if (process.env.HTTP_CLIENT_CACHE) {
    httpClient = new CachedHttpClient(httpClient, cache);
}

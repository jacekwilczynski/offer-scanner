import { drizzle } from 'drizzle-orm/postgres-js';
import * as redis from 'redis';
import { RealHttpClient } from 'src/http-client/RealHttpClient';
import { Cache } from 'src/cache/Cache';
import { CachedHttpClient } from 'src/http-client/CachedHttpClient';
import { env } from 'src/init/env';
import { HttpClient } from 'src/http-client/HttpClient';
import * as postgres from 'postgres';
import * as schema from 'src/schema';

export const cache = new Cache(redis.createClient({ url: env.REDIS_URL }));

export const db = drizzle(postgres(env.DATABASE_URL), { schema });

export let httpClient: HttpClient = new RealHttpClient();
if (env.HTTP_CLIENT_CACHE) {
    httpClient = new CachedHttpClient(httpClient, cache);
}

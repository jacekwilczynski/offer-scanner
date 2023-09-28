import { env } from 'src/init/env';
import * as redis from 'redis';
import { PrismaClient } from '@prisma/client';
import { Cache } from 'src/cache/Cache';
import { HttpClient } from 'src/http-client/HttpClient';
import { CachedHttpClient } from 'src/http-client/CachedHttpClient';
import { RealHttpClient } from 'src/http-client/RealHttpClient';

export const cache = new Cache(redis.createClient({ url: env.REDIS_URL }));

export const prisma = new PrismaClient();

export let httpClient: HttpClient = new RealHttpClient();
if (env.HTTP_CLIENT_CACHE) {
    httpClient = new CachedHttpClient(httpClient, cache);
}

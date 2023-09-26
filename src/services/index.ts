import 'reflect-metadata';
import * as redis from 'redis';
import { RealHttpClient } from 'src/http-client/RealHttpClient';
import { Cache } from 'src/cache/Cache';
import { CachedHttpClient } from 'src/http-client/CachedHttpClient';
import { env } from 'src/services/env';
import { shared } from 'src/services/di-utils';
import { dataSource } from 'src/services/database';
import { Offer } from 'src/entity/Offer';

export const cache = shared(async () =>
    new Cache(redis.createClient({ url: env.REDIS_URL })),
);

export const db = shared(() => dataSource.initialize());

export const offerRepository = shared(async () => {
    const dbInitialized = await db();

    return dbInitialized.getRepository(Offer);
});

export const httpClient = shared(async () => {
    let httpClient = new RealHttpClient();

    if (env.HTTP_CLIENT_CACHE) {
        httpClient = new CachedHttpClient(httpClient, await cache());
    }

    return httpClient;
});

import { env } from 'src/services/env';
import * as redis from 'redis';
import { PrismaClient } from 'prisma/client';
import { Cache } from 'src/cache/Cache';
import { HttpClient } from 'src/http-client/HttpClient';
import { CachedHttpClient } from 'src/http-client/CachedHttpClient';
import { RealHttpClient } from 'src/http-client/RealHttpClient';
import { shared } from 'src/services/di-utils';

class Container {
    cache = shared(async () => new Cache(await this.redisClient()));

    httpClient = shared(async () => {
        let httpClient: HttpClient = new RealHttpClient();
        if (env.HTTP_CLIENT_CACHE) {
            httpClient = new CachedHttpClient(httpClient, await this.cache());
        }

        return httpClient;
    });

    prisma = shared(async () => new PrismaClient());

    redisClient = shared(async () =>
        // type assertion because the type appears to be correct
        // - there were no errors when redisClient was inlined in cache constructor call,
        // and there is no obvious alternative
        redis.createClient({ url: env.REDIS_URL }) as redis.RedisClientType,
    );
}

export const services = new Container();

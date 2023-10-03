import * as redis from 'redis';
import { PrismaClient } from 'prisma/client';
import { env } from 'src/infrastructure/dependency-injection/env';
import { Cache } from 'src/infrastructure/cache/Cache';
import { HttpClient } from 'src/application/interfaces/HttpClient';
import { CachedHttpClient } from 'src/infrastructure/http-client/CachedHttpClient';
import { RealHttpClient } from 'src/infrastructure/http-client/RealHttpClient';
import { shared } from 'src/infrastructure/dependency-injection/di-utils';
import { PrismaListingRepository } from 'src/infrastructure/repositories/PrismaListingRepository';

class Container {
    cache = shared(async () => new Cache(await this.redisClient()));

    httpClient = shared(async () => {
        let httpClient: HttpClient = new RealHttpClient();
        if (env.HTTP_CLIENT_CACHE) {
            httpClient = new CachedHttpClient(httpClient, await this.cache());
        }

        return httpClient;
    });

    listingRepository = shared(async () => new PrismaListingRepository(await this.prisma()));

    prisma = shared(async () => new PrismaClient());

    redisClient = shared(async () =>
        // type assertion because the type appears to be correct
        // - there were no errors when redisClient was inlined in cache constructor call,
        // and there is no obvious alternative
        redis.createClient({ url: env.REDIS_URL }) as redis.RedisClientType,
    );
}

export const services = new Container();

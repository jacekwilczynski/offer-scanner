import * as redis from 'redis';
import { PrismaClient } from 'prisma/client';
import * as config from 'src/dependency-injection/offer-sources';
import { shared } from 'src/dependency-injection/di-utils';
import { env } from 'src/dependency-injection/env';
import { Cache } from 'src/infrastructure/cache/Cache';
import { HttpClient } from 'src/application/interfaces/HttpClient';
import { CachedHttpClient } from 'src/infrastructure/http-client/CachedHttpClient';
import { RealHttpClient } from 'src/infrastructure/http-client/RealHttpClient';
import { PrismaListingRepository } from 'src/infrastructure/repositories/PrismaListingRepository';
import { OfferFetcher } from 'src/application/services/offer-importer/OfferFetcher';
import { DomOverHttpSource } from 'src/application/services/offer-importer/sources/DomOverHttpSource';
import { OfferImporter } from 'src/application/services/offer-importer/OfferImporter';
import { Refresh } from 'src/application/use-cases/Refresh';
import { SinchSmsSender } from 'src/infrastructure/notifier/sms-sender/SinchSmsSender';
import { SmsNotifier } from 'src/infrastructure/notifier/SmsNotifier';
import { StdoutFakeSmsSender } from 'src/infrastructure/notifier/sms-sender/StdoutFakeSmsSender';
import { PrismaOfferRepository } from 'src/infrastructure/repositories/PrismaOfferRepository';
import { TwilioSmsSender } from 'src/infrastructure/notifier/sms-sender/TwilioSmsSender';

class Container {
    cache = shared(async () => new Cache(await this.redisClient()));

    httpClient = shared(async () => {
        let httpClient: HttpClient = new RealHttpClient();
        if (env.HTTP_CLIENT_CACHE) {
            httpClient = new CachedHttpClient(httpClient, await this.cache());
        }

        return httpClient;
    });

    listingRepository = shared(async () =>
        new PrismaListingRepository(await this.prisma()),
    );

    notifier = shared(async () => new SmsNotifier(
        await this.smsSender(),
        {
            from: env.SMS_FROM || 'n/a (using fake transport)',
            to: env.SMS_TO || 'n/a (using fake transport)',
        },
    ));

    offerFetcher = shared(async () => {
        const httpClient = await this.httpClient();
        const sources = Object.values(config.offerSources)
            .map(config => new DomOverHttpSource(httpClient, config));

        return new OfferFetcher(sources);
    });

    offerImporter = shared(async () => new OfferImporter(
        await this.listingRepository(),
        await this.offerFetcher(),
    ));

    offerRepository = shared(async () =>
        new PrismaOfferRepository(await this.prisma()),
    );

    prisma = shared(async () => new PrismaClient());

    redisClient = shared(async () => {
        const client: redis.RedisClientType = redis.createClient({ url: env.REDIS_URL });
        toExecuteBeforeShutdown.push(() => client.disconnect());

        return client;
    });

    refresh = shared(async () => new Refresh(
        await this.offerImporter(),
        await this.listingRepository(),
        await this.offerRepository(),
        await this.notifier(),
    ));

    smsSender = shared(async () => {
        if (env.SINCH_URL && env.SINCH_JWT) {
            return new SinchSmsSender(env.SINCH_URL, env.SINCH_JWT);
        } else if (env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN) {
            return new TwilioSmsSender(require('twilio')(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN));
        } else {
            return new StdoutFakeSmsSender();
        }
    });
}

export const container: Readonly<Container> = new Container();

export type ServiceCollection<TKeys extends keyof Container> = { [K in TKeys]: Awaited<ReturnType<Container[K]>> }

export async function runWithServices<TKeys extends keyof Container>(
    keys: TKeys[],
    callback: (services: ServiceCollection<TKeys>) => Promise<void>,
) {
    const servicesToInject = await getServices(keys);
    await callback(servicesToInject);
    await Promise.allSettled(toExecuteBeforeShutdown.map(action => action()));
}

type PreShutdownAction = () => void | Promise<void>;
const toExecuteBeforeShutdown: PreShutdownAction[] = [];

async function getServices<TKeys extends keyof Container>(keys: TKeys[]) {
    const entryPromises = keys.map(async (key) => {
        const service = await container[key]();
        return [key, service];
    });

    const entries = await Promise.all(entryPromises);

    return Object.fromEntries(entries) as ServiceCollection<TKeys>;
}

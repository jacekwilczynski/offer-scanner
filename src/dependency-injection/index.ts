import * as config from 'src/dependency-injection/offer-sources';
import { AppEventEmitter } from 'src/application/EventMap';
import { AsyncEventEmitter } from 'src/utils/EventEmitter';
import { BufferedNotifier } from 'src/infrastructure/notifier/BufferedNotifier';
import { DomOverHttpSource } from 'src/application/services/offer-importer/sources/DomOverHttpSource';
import { eager, shared } from 'src/dependency-injection/di-utils';
import { env } from 'src/dependency-injection/env';
import { MarkOffersAsNotifiedAboutSubscriber } from 'src/application/services/MarkOffersAsNotifiedAboutSubscriber';
import { OfferFetcher } from 'src/application/services/offer-importer/OfferFetcher';
import { OfferImporter } from 'src/application/services/offer-importer/OfferImporter';
import { PrismaClient } from 'prisma/client';
import { PrismaListingRepository } from 'src/infrastructure/repositories/PrismaListingRepository';
import { PrismaOfferRepository } from 'src/infrastructure/repositories/PrismaOfferRepository';
import { FetchHttpClient } from 'src/infrastructure/http-client/FetchHttpClient';
import { Refresh } from 'src/application/use-cases/Refresh';
import { Server } from 'src/server';
import { SinchSmsSender } from 'src/infrastructure/notifier/sms-sender/SinchSmsSender';
import { SkipFirstNotificationNotifier } from 'src/application/services/SkipFirstNotificationNotifier';
import { SmsNotifier } from 'src/infrastructure/notifier/SmsNotifier';
import { StdoutFakeSmsSender } from 'src/infrastructure/notifier/sms-sender/StdoutFakeSmsSender';
import { TwilioSmsSender } from 'src/infrastructure/notifier/sms-sender/TwilioSmsSender';

class Container {
    bufferedNotifier = shared(async () => new BufferedNotifier());

    eventEmitter = shared(async () => new AsyncEventEmitter() as AppEventEmitter);

    httpClient = shared(async () => new FetchHttpClient());

    listingRepository = shared(async () =>
        new PrismaListingRepository(await this.prisma()),
    );

    markOffersAsNotifiedAboutSubscriber = eager(shared(async () =>
        new MarkOffersAsNotifiedAboutSubscriber(
            await this.eventEmitter(),
            await this.offerRepository(),
        ),
    ));

    notifier = shared(async () => new SkipFirstNotificationNotifier(
        env.NOTIFICATION_CHANNEL === 'sms'
            ? await this.smsNotifier()
            : await this.bufferedNotifier(),
        await this.offerRepository(),
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

    refresh = shared(async () => new Refresh(
        await this.offerImporter(),
        await this.listingRepository(),
        await this.notifier(),
        await this.eventEmitter(),
    ));

    server = shared(async () => new Server(env.PROJECT_DIR));

    smsNotifier = shared(async () => new SmsNotifier(
        await this.smsSender(),
        {
            from: env.SMS_FROM || 'n/a (using fake transport)',
            to: env.SMS_TO || 'n/a (using fake transport)',
        },
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

export async function runWithServices<TKeys extends keyof Container, TReturn>(
    keys: TKeys[],
    callback: (services: ServiceCollection<TKeys>) => TReturn,
) {
    const servicesToInject = await getServices(keys);
    try {
        return callback(servicesToInject);
    } finally {
        await Promise.allSettled(toExecuteBeforeShutdown.map(action => action()));
    }
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

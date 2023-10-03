import { SavedListingWithOffers } from 'src/model/Listing';
import { Notifier } from 'src/application/interfaces/Notifier';
import { Sms, SmsSender } from 'src/infrastructure/notifier/sms-sender/SmsSender';

export class SmsNotifier implements Notifier {
    constructor(
        private readonly smsSender: SmsSender,
        private readonly config: SmsNotifierConfig,
    ) {
    }

    async notifyAboutNewOffers(listings: SavedListingWithOffers[]) {
        let body = 'New offers!';

        body += listings.flatMap(({ offers }) =>
            offers.map(offer => `${offer.title}: ${offer.url}`),
        );

        await this.smsSender.send({ ...this.config, body });
    }
}

export type SmsNotifierConfig = Pick<Sms, 'from' | 'to'>

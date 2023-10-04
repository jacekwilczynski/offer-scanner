import { SavedListingWithOffers } from 'src/model/Listing';
import { Notifier } from 'src/application/interfaces/Notifier';
import { Sms, SmsSender } from 'src/infrastructure/notifier/sms-sender/SmsSender';

export class SmsNotifier implements Notifier {
    private static readonly MAX_OFFERS_PER_LISTING = 2;

    constructor(
        private readonly smsSender: SmsSender,
        private readonly config: SmsNotifierConfig,
    ) {
    }

    async notifyAboutNewOffers(listings: SavedListingWithOffers[]) {
        let body = 'New offers!';

        for (const listing of listings) {
            for (const offer of listing.offers.slice(0, SmsNotifier.MAX_OFFERS_PER_LISTING)) {
                body += `\n\n${offer.url}`;
            }

            if (listing.offers.length > SmsNotifier.MAX_OFFERS_PER_LISTING) {
                body += '\n\n... and more';
            }
        }

        await this.smsSender.send({ ...this.config, body });
    }
}

export type SmsNotifierConfig = Pick<Sms, 'from' | 'to'>

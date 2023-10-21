import { ListingToNotifyAbout, Notifier } from 'src/application/interfaces/Notifier';
import { OfferRepository } from 'src/application/interfaces/OfferRepository';

/**
 * A decorator that prevents sending a huge notification with all imported offers on the first run.
 */
export class SkipFirstNotificationNotifier implements Notifier {
    constructor(
        private readonly inner: Notifier,
        private readonly offerRepository: OfferRepository,
    ) {
    }

    async notifyAboutNewOffers(listings: ListingToNotifyAbout[]): Promise<void> {
        if (await this.offerRepository.hasAnyNotifiedAbout()) {
            this.inner.notifyAboutNewOffers(listings);
        }
    }
}

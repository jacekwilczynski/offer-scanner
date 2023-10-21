import { AppEventEmitter } from 'src/application/EventMap';
import { OfferRepository } from 'src/application/interfaces/OfferRepository';
import { ListingToNotifyAbout } from 'src/application/interfaces/Notifier';

export class MarkOffersAsNotifiedAboutSubscriber {
    constructor(
        eventEmitter: AppEventEmitter,
        private readonly offerRepository: OfferRepository,
    ) {
        eventEmitter.on('notification sent', this.onNotificationSent);
    }

    onNotificationSent = async (listings: ListingToNotifyAbout[]) => {
        const offers = listings.flatMap(({ offers }) => offers);
        await this.offerRepository.markNotified(...offers);
    };
}

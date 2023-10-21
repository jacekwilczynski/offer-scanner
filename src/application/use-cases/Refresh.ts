import { OfferImporter } from 'src/application/services/offer-importer/OfferImporter';
import { ListingRepository } from 'src/application/interfaces/ListingRepository';
import { Notifier } from 'src/application/interfaces/Notifier';
import { AppEventEmitter } from 'src/application/EventMap';

export class Refresh {
    constructor(
        private readonly offerImporter: OfferImporter,
        private readonly listingRepository: ListingRepository,
        private readonly notifier: Notifier,
        private readonly eventEmitter: AppEventEmitter,
    ) {
    }

    async execute() {
        await this.offerImporter.import();

        const listings = await this.listingRepository.findAllWatchedWithNewOffers();

        if (listings.length === 0) {
            console.debug('No new offers.');
            return;
        }

        await this.notifier.notifyAboutNewOffers(listings);
        await this.eventEmitter.emitAsync('notification sent', listings);
    }
}

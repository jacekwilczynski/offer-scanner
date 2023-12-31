import { OfferImporter } from 'src/application/services/offer-importer/OfferImporter';
import { ListingRepository } from 'src/application/interfaces/ListingRepository';
import { OfferRepository } from 'src/application/interfaces/OfferRepository';
import { Notifier } from 'src/application/interfaces/Notifier';
import { SavedListingWithOffers } from 'src/model/Listing';

export class Refresh {
    constructor(
        private readonly offerImporter: OfferImporter,
        private readonly listingRepository: ListingRepository,
        private readonly offerRepository: OfferRepository,
        private readonly notifier: Notifier,
    ) {
    }

    async execute() {
        await this.offerImporter.import();

        const listings = await this.listingRepository.findAllWatchedWithNewOffers();

        if (listings.length === 0) {
            console.debug('No new offers.');
            return;
        }

        const isFirstRun = !await this.offerRepository.hasAnyNotifiedAbout();
        if (!isFirstRun) {
            console.debug('Notifying about new listings.', listings);
            await this.notifier.notifyAboutNewOffers(listings);
        } else {
            console.debug('First run - skipping notification.');
        }

        await this.markNotified(listings);
    }

    private async markNotified(listings: SavedListingWithOffers[]) {
        const offers = listings.flatMap(({ offers }) => offers);
        await this.offerRepository.markNotified(...offers);
    }
}

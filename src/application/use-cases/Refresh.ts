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
        await this.notifier.notifyAboutNewOffers(listings);
        await this.markNotified(listings);
    }

    private async markNotified(listings: SavedListingWithOffers[]) {
        const offers = listings.flatMap(({ offers }) => offers);
        await this.offerRepository.markNotified(...offers);
    }
}

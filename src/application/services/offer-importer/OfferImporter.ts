import { ListingRepository } from 'src/application/interfaces/ListingRepository';
import { OfferFetcher } from 'src/application/services/offer-importer/OfferFetcher';

export class OfferImporter {
    constructor(
        private readonly listingRepository: ListingRepository,
        private readonly offerFetcher: OfferFetcher,
    ) {
    }

    async import() {
        const listings = await this.listingRepository.findAllWatched();

        for (const listing of listings) {
            const offers = await this.offerFetcher.fetchOffers(listing.url);
            this.listingRepository.addOffers(listing, offers);
        }
    }
}

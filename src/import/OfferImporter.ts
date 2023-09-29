import { ListingRepository } from 'src/model/Listing';
import { OfferFetcher } from 'src/import/OfferFetcher';

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

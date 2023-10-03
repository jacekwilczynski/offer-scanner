import { OfferImporter } from 'src/application/services/OfferImporter/OfferImporter';
import { ListingRepository } from 'src/application/interfaces/ListingRepository';
import { Notifier } from 'src/application/interfaces/Notifier';

export class Refresh {
    constructor(
        private readonly offerImporter: OfferImporter,
        private readonly listingRepository: ListingRepository,
        private readonly notifier: Notifier,
    ) {
    }

    async execute() {
        await this.offerImporter.import();
        const listings = await this.listingRepository.findAllWatchedWithNewOffers();
        await this.notifier.notifyAboutNewOffers(listings);
    }
}

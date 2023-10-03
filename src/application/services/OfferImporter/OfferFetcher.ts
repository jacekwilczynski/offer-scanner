import { Offer } from 'src/model/Offer';
import { OfferSource } from 'src/application/services/OfferImporter/sources/OfferSource';

export class OfferFetcher {
    constructor(
        private readonly sources: OfferSource[],
    ) {
    }

    fetchOffers(url: string): Promise<Offer[]> {
        for (const source of this.sources) {
            if (source.supports(url)) {
                return source.fetchOffers(url);
            }
        }

        throw new Error(`URL ${url} is not supported.`);
    }
}

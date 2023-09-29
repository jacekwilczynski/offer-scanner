import { Offer } from 'src/model/Offer';

export abstract class OfferSource {
    protected abstract _fetchOffers(listingUrl: string): Promise<Offer[]>

    abstract supports(listingUrl: string): boolean

    fetchOffers(listingUrl: string): Promise<Offer[]> {
        if (!this.supports(listingUrl)) {
            throw new Error(`URL ${listingUrl} not supported by ${this}.`);
        }

        return this._fetchOffers(listingUrl);
    }

    /**
     * Used in error message if trying to fetch from unsupported URL.
     */
    toString(): string {
        return this.constructor.name;
    }
}

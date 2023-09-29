import { Offer } from 'src/model/Offer';

export interface OfferFetcher {
    fetchOffers(url: string): Promise<Offer[]>;
}

export abstract class OfferSource implements OfferFetcher {
    abstract supports(url: string): boolean

    fetchOffers(url: string): Promise<Offer[]> {
        if (!this.supports(url)) {
            throw new Error(`URL ${url} not supported by ${this.constructor.name}.`);
        }

        return this._fetchOffers(url);
    }

    protected abstract _fetchOffers(url: string): Promise<Offer[]>
}

import { Offer } from 'src/model/Offer';

export interface OfferRepository {
    markNotified(...offers: Pick<Offer, 'url'>[]): Promise<void>;
}

import { Offer } from 'src/model/Offer';

export interface OfferRepository {
    hasAnyNotifiedAbout(): Promise<boolean>;

    markNotified(...offers: Pick<Offer, 'url'>[]): Promise<void>;
}

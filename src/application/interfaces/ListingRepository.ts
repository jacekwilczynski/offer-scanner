import { Offer } from 'src/model/Offer';
import { Listing, SavedListing } from 'src/model/Listing';

export interface ListingRepository {
    findAllWatched(): Promise<SavedListing[]>;

    addOffers(listing: Listing, offers: Offer[]): Promise<void>;
}

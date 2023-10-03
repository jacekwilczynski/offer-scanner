import { Offer } from 'src/model/Offer';
import { Listing, SavedListing, SavedListingWithOffers } from 'src/model/Listing';

export interface ListingRepository {
    findAllWatched(): Promise<SavedListing[]>;

    findAllWatchedWithNewOffers(): Promise<SavedListingWithOffers[]>

    addOffers(listing: Listing, offers: Offer[]): Promise<void>;
}

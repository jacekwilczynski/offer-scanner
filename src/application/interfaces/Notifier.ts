import { SavedListingWithOffers } from 'src/model/Listing';

export interface Notifier {
    notifyAboutNewOffers(listing: SavedListingWithOffers[]): Promise<void>;
}

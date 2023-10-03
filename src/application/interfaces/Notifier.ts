import { Offer } from 'src/model/Offer';

export interface Notifier {
    notifyAboutNewOffers(listings: ListingToNotifyAbout[]): Promise<void>;
}

export type ListingToNotifyAbout = {
    url: string;
    offers: Offer[];
}

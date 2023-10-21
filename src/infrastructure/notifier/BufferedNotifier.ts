import { ListingToNotifyAbout, Notifier } from 'src/application/interfaces/Notifier';

export class BufferedNotifier implements Notifier {
    private _listings: ListingToNotifyAbout[] = [];

    async notifyAboutNewOffers(listings: ListingToNotifyAbout[]) {
        this._listings.push(...listings);
    }

    get listings(): ListingToNotifyAbout[] {
        return this._listings;
    }
}

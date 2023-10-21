import { mock } from 'jest-mock-extended';
import { fromPartial } from 'src/utils/testing/types';
import { OfferImporter } from 'src/application/services/offer-importer/OfferImporter';
import { ListingRepository } from 'src/application/interfaces/ListingRepository';
import { Notifier } from 'src/application/interfaces/Notifier';
import { Refresh } from 'src/application/use-cases/Refresh';
import { SavedListingWithOffers } from 'src/model/Listing';
import { AppEventEmitter } from 'src/application/EventMap';

describe(Refresh.name, () => {
    const offerImporter = mock<OfferImporter>();
    const listingRepository = mock<ListingRepository>();
    const notifier = mock<Notifier>();
    const eventEmitter = mock<AppEventEmitter>();
    const refresh = new Refresh(offerImporter, listingRepository, notifier, eventEmitter);

    it('should not notify if no new offers', async () => {
        // given
        listingRepository.findAllWatchedWithNewOffers.mockResolvedValueOnce([]);

        // when
        await refresh.execute();

        // then
        expect(notifier.notifyAboutNewOffers).not.toHaveBeenCalled();
        expect(eventEmitter.emitAsync).not.toHaveBeenCalled();
    });

    it('should execute import and notify about new offers', async () => {
        // given
        const listings: SavedListingWithOffers[] = [
            fromPartial({
                url: 'https://abc.com',
                offers: [
                    {
                        url: 'https://abc.com/one',
                        title: 'ABC one',
                    },
                    {
                        url: 'https://abc.com/two',
                        title: 'ABC two',
                    },
                ],
            }),
            fromPartial({
                url: 'https://def.com',
                offers: [
                    {
                        url: 'https://def.com/one',
                        title: 'DEF one',
                    },
                ],
            }),
        ];

        listingRepository.findAllWatchedWithNewOffers.mockResolvedValueOnce(listings);

        // when
        await refresh.execute();

        // then
        expect(offerImporter.import).toHaveBeenCalledTimes(1);
        expect(listingRepository.findAllWatchedWithNewOffers).toHaveBeenCalledTimes(1);

        expect(notifier.notifyAboutNewOffers).toHaveBeenCalledTimes(1);
        expect(notifier.notifyAboutNewOffers).toHaveBeenCalledWith(listings);

        expect(eventEmitter.emitAsync).toHaveBeenCalledTimes(1);
        expect(eventEmitter.emitAsync).toHaveBeenCalledWith('notification sent', listings);
    });
});

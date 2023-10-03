import { mock } from 'jest-mock-extended';
import { OfferImporter } from 'src/application/services/offer-importer/OfferImporter';
import { ListingRepository } from 'src/application/interfaces/ListingRepository';
import { OfferRepository } from 'src/application/interfaces/OfferRepository';
import { Notifier } from 'src/application/interfaces/Notifier';
import { Refresh } from 'src/application/use-cases/Refresh';
import { fromPartial } from 'src/utils/testing/types';
import { SavedListingWithOffers } from 'src/model/Listing';

describe(Refresh.name, () => {
    const offerImporter = mock<OfferImporter>();
    const listingRepository = mock<ListingRepository>();
    const offerRepository = mock<OfferRepository>();
    const notifier = mock<Notifier>();
    const refresh = new Refresh(offerImporter, listingRepository, offerRepository, notifier);

    it('executes import and notifies about new offers', async () => {
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

        listingRepository.findAllWatchedWithNewOffers.mockImplementationOnce(() => Promise.resolve(listings));

        // when
        await refresh.execute();

        // then
        expect(offerImporter.import).toHaveBeenCalledTimes(1);
        expect(listingRepository.findAllWatchedWithNewOffers).toHaveBeenCalledTimes(1);
        expect(notifier.notifyAboutNewOffers).toHaveBeenCalledTimes(1);

        expect(offerRepository.markNotified).toHaveBeenCalledTimes(1);
        const markNotifiedCall = offerRepository.markNotified.mock.calls[0]!;
        expect(markNotifiedCall[0]).toHaveProperty('url', 'https://abc.com/one');
        expect(markNotifiedCall[1]).toHaveProperty('url', 'https://abc.com/two');
        expect(markNotifiedCall[2]).toHaveProperty('url', 'https://def.com/one');
    });
});

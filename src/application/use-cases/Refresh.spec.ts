import { mock } from 'jest-mock-extended';
import { OfferImporter } from 'src/application/services/OfferImporter/OfferImporter';
import { ListingRepository } from 'src/application/interfaces/ListingRepository';
import { Notifier } from 'src/application/interfaces/Notifier';
import { Refresh } from 'src/application/use-cases/Refresh';
import { fromPartial } from 'src/utils/testing/types';
import { SavedListingWithOffers } from 'src/model/Listing';

describe(Refresh.name, () => {
    const offerImporter = mock<OfferImporter>();
    const listingRepository = mock<ListingRepository>();
    const notifier = mock<Notifier>();
    const refresh = new Refresh(offerImporter, listingRepository, notifier);

    it('executes import and notifies about new offers', async () => {
        // given
        const listings: SavedListingWithOffers[] = [
            fromPartial({
                url: 'https://offers.com',
                offers: [
                    {
                        url: 'https://offers.com/offer',
                        title: 'Offer',
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
        expect(notifier.notifyAboutNewOffers).toHaveBeenCalledWith(listings);
    });
});

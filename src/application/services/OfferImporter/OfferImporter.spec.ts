import { mock } from 'jest-mock-extended';
import { fromPartial } from 'src/utils/testing/types';
import { SavedListing } from 'src/model/Listing';
import { ListingRepository } from 'src/application/interfaces/ListingRepository';
import { OfferFetcher } from 'src/application/services/OfferImporter/OfferFetcher';
import { Offer } from 'src/model/Offer';
import { OfferImporter } from 'src/application/services/OfferImporter/OfferImporter';

describe(OfferImporter.name, () => {
    const listingRepository = mock<ListingRepository>();
    const offerFetcher = mock<OfferFetcher>();
    const offerImporter = new OfferImporter(listingRepository, offerFetcher);

    it('should do nothing if no watched listings', async () => {
        // given
        listingRepository.findAllWatched.mockResolvedValueOnce([]);

        // when
        await offerImporter.import();

        expect(listingRepository.findAllWatched).toHaveBeenCalled();
        expect(offerFetcher.fetchOffers).not.toHaveBeenCalled();
        expect(listingRepository.addOffers).not.toHaveBeenCalled();
    });

    it('should fetch and save offers', async () => {
        // given
        const aListing = fromPartial<SavedListing>({ url: 'https://a.com/' });
        const bListing = fromPartial<SavedListing>({ url: 'https://b.com/' });
        const aOffer1 = fromPartial<Offer>({ url: 'https://a.com/1' });
        const aOffer2 = fromPartial<Offer>({ url: 'https://a.com/2' });
        const bOffer1 = fromPartial<Offer>({ url: 'https://b.com/1' });
        const bOffer2 = fromPartial<Offer>({ url: 'https://b.com/2' });

        listingRepository
            .findAllWatched
            .mockResolvedValueOnce([aListing, bListing]);

        offerFetcher
            .fetchOffers
            .calledWith('https://a.com/')
            .mockResolvedValueOnce([aOffer1, aOffer2]);

        offerFetcher
            .fetchOffers
            .calledWith('https://b.com/')
            .mockResolvedValueOnce([bOffer1, bOffer2]);

        // when
        await offerImporter.import();

        // then
        expect(listingRepository.addOffers).toHaveBeenCalledTimes(2);
        expect(listingRepository.addOffers).toHaveBeenCalledWith(aListing, [aOffer1, aOffer2]);
        expect(listingRepository.addOffers).toHaveBeenCalledWith(bListing, [bOffer1, bOffer2]);
    });
});

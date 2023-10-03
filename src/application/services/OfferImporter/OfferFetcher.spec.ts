import { mock } from 'jest-mock-extended';
import { fromPartial } from 'src/utils/testing/types';
import { OfferFetcher } from 'src/application/services/OfferImporter/OfferFetcher';
import { OfferSource } from 'src/application/services/OfferImporter/sources/OfferSource';
import { Offer } from 'src/model/Offer';

describe(OfferFetcher.name, () => {
    const url = 'https://offers.com/';
    const firstSource = mock<OfferSource>();
    const secondSource = mock<OfferSource>();
    const thirdSource = mock<OfferSource>();
    const offerFetcher = new OfferFetcher([firstSource, secondSource, thirdSource]);

    it('should use the source that supports the given URL', async () => {
        // given
        const expectedOffers = [fromPartial<Offer>({ url: 'https://offers.com/xyz' })];
        firstSource.supports.mockReturnValueOnce(false);
        secondSource.supports.mockReturnValueOnce(true);
        secondSource.fetchOffers.mockResolvedValueOnce(expectedOffers);

        // when
        const returnedOffers = await offerFetcher.fetchOffers(url);

        // then
        expect(firstSource.supports).toHaveBeenCalledTimes(1);
        expect(firstSource.fetchOffers).not.toHaveBeenCalled();

        expect(secondSource.supports).toHaveBeenCalledTimes(1);
        expect(secondSource.fetchOffers).toHaveBeenCalledTimes(1);

        expect(thirdSource.supports).not.toHaveBeenCalled();
        expect(thirdSource.fetchOffers).not.toHaveBeenCalled();

        expect(returnedOffers).toBe(expectedOffers);
    });

    it('should throw error if URL not supported', async () => {
        // given
        firstSource.supports.mockReturnValueOnce(false);
        secondSource.supports.mockReturnValueOnce(false);
        thirdSource.supports.mockReturnValueOnce(false);

        // then
        await expect(() => offerFetcher.fetchOffers(url)).toThrow(url);
    });
});

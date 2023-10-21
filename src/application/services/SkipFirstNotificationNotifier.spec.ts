import { mock } from 'jest-mock-extended';
import { fromPartial } from 'src/utils/testing/types';
import { ListingToNotifyAbout, Notifier } from 'src/application/interfaces/Notifier';
import { OfferRepository } from '../interfaces/OfferRepository';
import { SkipFirstNotificationNotifier } from 'src/application/services/SkipFirstNotificationNotifier';

describe(SkipFirstNotificationNotifier.name, () => {
    const inner = mock<Notifier>();
    const offerRepository = mock<OfferRepository>();
    const outer = new SkipFirstNotificationNotifier(inner, offerRepository);
    const listings: ListingToNotifyAbout[] = [fromPartial({})];

    it('should not notify if this is the first notification ever', async () => {
        // given
        offerRepository.hasAnyNotifiedAbout.mockResolvedValueOnce(false);

        // when
        await outer.notifyAboutNewOffers(listings);

        // then
        expect(inner.notifyAboutNewOffers).not.toHaveBeenCalled();
    });

    it('should notify on subsequent calls', async () => {
        // given
        offerRepository.hasAnyNotifiedAbout.mockResolvedValueOnce(true);

        // when
        await outer.notifyAboutNewOffers(listings);

        // then
        expect(inner.notifyAboutNewOffers).toHaveBeenCalledTimes(1);
        expect(inner.notifyAboutNewOffers).toHaveBeenCalledWith(listings);
    });
});

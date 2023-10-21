import { mock } from 'jest-mock-extended';
import { MarkOffersAsNotifiedAboutSubscriber } from 'src/application/services/MarkOffersAsNotifiedAboutSubscriber';
import { AppEventEmitter } from 'src/application/EventMap';
import { OfferRepository } from 'src/application/interfaces/OfferRepository';
import { ListingToNotifyAbout } from 'src/application/interfaces/Notifier';
import { AsyncEventEmitter } from 'src/utils/EventEmitter';

describe(MarkOffersAsNotifiedAboutSubscriber.name, () => {
    const eventEmitter = new AsyncEventEmitter() as AppEventEmitter;
    const offerRepository = mock<OfferRepository>();
    new MarkOffersAsNotifiedAboutSubscriber(eventEmitter, offerRepository);

    it('should mark offers as notified about', async () => {
        // given
        const listings: ListingToNotifyAbout[] = [
            {
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
            },
            {
                url: 'https://def.com',
                offers: [
                    {
                        url: 'https://def.com/one',
                        title: 'DEF one',
                    },
                ],
            },
        ];

        // when
        await eventEmitter.emitAsync('notification sent', listings);

        // then
        expect(offerRepository.markNotified).toHaveBeenCalledTimes(1);
        const markNotifiedCallArgs = offerRepository.markNotified.mock.calls[0]!;
        expect(markNotifiedCallArgs[0]).toHaveProperty('url', 'https://abc.com/one');
        expect(markNotifiedCallArgs[1]).toHaveProperty('url', 'https://abc.com/two');
        expect(markNotifiedCallArgs[2]).toHaveProperty('url', 'https://def.com/one');
    });
});

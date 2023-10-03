import { useDatabase } from 'src/utils/testing/composables';
import { PrismaOfferRepository } from 'src/infrastructure/repositories/PrismaOfferRepository';
import { Offer } from 'src/model/Offer';
import { OfferRepository } from 'src/application/interfaces/OfferRepository';
import { services } from 'src/dependency-injection';

const prisma = useDatabase();

describe(PrismaOfferRepository.name, () => {
    let offerRepository: OfferRepository;

    beforeEach(async () => {
        offerRepository = await services.offerRepository();
    });

    it('can record notification', async () => {
        // given
        await theFollowingOffers(
            { url: 'https://one.com/', title: 'one' },
            { url: 'https://two.com/', title: 'two' },
        );

        // when
        await offerRepository.markNotified({ url: 'https://one.com/' });

        // then
        const offers = await findAllOffers();
        expect(offers).toHaveLength(2);
        const offerOne = offers.find(({ url }) => url === 'https://one.com/')!;
        const offerTwo = offers.find(({ url }) => url === 'https://two.com/')!;
        expect(offerOne.notifiedAboutAt).toBeInstanceOf(Date);
        expect(offerTwo.notifiedAboutAt).toBeNull();
    });
});

async function theFollowingOffers(...offers: Offer[]) {
    await prisma.offer.createMany({ data: offers });
}

async function findAllOffers() {
    return prisma.offer.findMany();
}

import { useDatabase } from 'src/utils/testing/composables';
import { PrismaOfferRepository } from 'src/infrastructure/repositories/PrismaOfferRepository';
import { OfferRepository } from 'src/application/interfaces/OfferRepository';
import { container } from 'src/dependency-injection';
import { Prisma } from 'prisma/client';
import OfferCreateInput = Prisma.OfferCreateInput;

const prisma = useDatabase();

describe(PrismaOfferRepository.name, () => {
    let offerRepository: OfferRepository;

    beforeEach(async () => {
        offerRepository = await container.offerRepository();
    });

    it('can when there are offers with notifications', async () => {
        await theFollowingOffers({ url: 'https://one.com/', notifiedAboutAt: new Date() });
        expect(await offerRepository.hasAnyNotifiedAbout()).toBe(true);
    });

    it('can when there are no offers with notifications', async () => {
        await theFollowingOffers({ url: 'https://one.com/' });
        expect(await offerRepository.hasAnyNotifiedAbout()).toBe(false);
    });

    it('can record notification', async () => {
        // given
        await theFollowingOffers(
            { url: 'https://one.com/' },
            { url: 'https://two.com/' },
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

type PartialOfferInput = Pick<OfferCreateInput, 'url' | 'notifiedAboutAt'>;

async function theFollowingOffers(...partials: PartialOfferInput[]) {
    const data = partials.map(o => ({ ...o, title: o.url, content: o.url }));
    await prisma.offer.createMany({ data });
}

async function findAllOffers() {
    return prisma.offer.findMany();
}

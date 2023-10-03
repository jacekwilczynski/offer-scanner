import { Prisma } from 'prisma/client';
import { useDatabase } from 'src/utils/testing/composables';
import { services } from 'src/infrastructure/dependency-injection';
import { PrismaListingRepository } from 'src/infrastructure/repositories/PrismaListingRepository';

const prisma = useDatabase();

describe(PrismaListingRepository.name, () => {
    let listingRepository: PrismaListingRepository;

    beforeEach(async () => {
        listingRepository = await services.listingRepository();
    });

    it('can find all watched listings', async () => {
        // given
        await theFollowingListings(
            { url: 'https://abc.com', isWatched: true },
            { url: 'https://def.com', isWatched: false },
            { url: 'https://ghi.com' }, // default true
        );

        // when
        const retrievedListings = await listingRepository.findAllWatched();

        // then
        expect(retrievedListings).toHaveLength(2);
        expect(retrievedListings[0]!).toHaveProperty('url', 'https://abc.com');
        expect(retrievedListings[1]!).toHaveProperty('url', 'https://ghi.com');
    });

    it('can add new offers to existing listing', async () => {
        // given
        await prisma.listing.create({
            data: {
                url: 'https://abc.com',
                offers: {
                    create: [
                        {
                            url: 'https://abc.com/1',
                            title: 'Jeden',
                        },
                        {
                            url: 'https://abc.com/2',
                            title: 'Dwa',
                        },
                    ],
                },
            },
        });

        // when
        await listingRepository.addOffers(
            { url: 'https://abc.com' },
            [
                {
                    url: 'https://abc.com/2',
                    title: 'Dwa',
                },
                {
                    url: 'https://abc.com/3',
                    title: 'Trzy',
                },
            ],
        );

        // then
        const listings = await findAllListings();

        expect(listings).toHaveLength(1);
        expect(listings[0]!).toHaveProperty('url', 'https://abc.com');
        expect(listings[0]!.offers).toHaveLength(3);
    });
});

async function theFollowingListings(...data: Prisma.ListingCreateInput[]) {
    await prisma.listing.createMany({ data });
}

function findAllListings() {
    return prisma.listing.findMany({
        select: {
            url: true,
            offers: {
                select: {
                    url: true,
                    title: true,
                },
            },
        },
    });
}

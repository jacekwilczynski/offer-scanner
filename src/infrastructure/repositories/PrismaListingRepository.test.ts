import { useDatabase } from 'src/utils/testing/composables';
import { Prisma } from 'prisma/client';
import { container } from 'src/dependency-injection';
import { PrismaListingRepository } from 'src/infrastructure/repositories/PrismaListingRepository';

const prisma = useDatabase();

describe(PrismaListingRepository.name, () => {
    let listingRepository: PrismaListingRepository;

    beforeEach(async () => {
        listingRepository = await container.listingRepository();
    });

    it('can find all watched listings', async () => {
        // given
        await theFollowingListings(
            { url: 'https://abc.com', isWatched: true },
            { url: 'https://def.com', isWatched: false },
            { url: 'https://ghi.com' }, // default true
        );

        // when
        const listings = await listingRepository.findAllWatched();

        // then
        expect(listings).toHaveLength(2);
        expect(listings[0]!).toHaveProperty('url', 'https://abc.com');
        expect(listings[1]!).toHaveProperty('url', 'https://ghi.com');
    });

    it('can find all watched listings with new offers', async () => {
        // given
        await theFollowingListings(
            {
                url: 'https://unwatched-with-new-offers.com',
                isWatched: false,
                offers: {
                    create: [{
                        url: 'https://unwatched-with-new-offers.com/one',
                        title: 'New offer in unwatched listing',
                        content: '<p>New offer in unwatched listing</p>',
                    }],
                },
            },
            {
                url: 'https://watched-with-new-offers.com',
                isWatched: true,
                offers: {
                    create: [
                        {
                            url: 'https://watched-with-new-offers.com/old-offer',
                            title: 'Old offer in watched listing that has new offers',
                            content: '<p>Old offer in watched listing that has new offers</p>',
                            notifiedAboutAt: new Date(),
                        },
                        {
                            url: 'https://watched-with-new-offers.com/new-offer',
                            title: 'New offer in watched listing',
                            content: '<p>New offer in watched listing</p>',
                        },
                    ],
                },
            },
            {
                url: 'https://watched-without-new-offers.com',
                isWatched: true,
                offers: {
                    create: [
                        {
                            url: 'https://watched-without-new-offers.com/old-offer',
                            title: 'Old offer in watched listing that does not have new offers',
                            content: '<p>Old offer in watched listing that does not have new offers</p>',
                            notifiedAboutAt: new Date(),
                        },
                    ],
                },
            },
        );

        // when
        const listings = await listingRepository.findAllWatchedWithNewOffers();

        // then
        expect(listings).toHaveLength(1);
        expect(listings[0]!).toHaveProperty('url', 'https://watched-with-new-offers.com');
        expect(listings[0]!.offers).toHaveLength(1);
        expect(listings[0]!.offers[0]!).toHaveProperty('url', 'https://watched-with-new-offers.com/new-offer');
        expect(listings[0]!.offers[0]!).toHaveProperty('title', 'New offer in watched listing');
        expect(listings[0]!.offers[0]!).toHaveProperty('content', '<p>New offer in watched listing</p>');
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
                            content: '<p>Jeden</p>',
                        },
                        {
                            url: 'https://abc.com/2',
                            title: 'Dwa',
                            content: '<p>Dwa</p>',
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
                    title: 'DwaModified',
                    content: '<p>DwaModified</p>',
                },
                {
                    url: 'https://abc.com/3',
                    title: 'Trzy',
                    content: '<p>Trzy</p>',
                },
            ],
        );

        // then
        const listings = await findAllListings();

        expect(listings).toHaveLength(1);
        expect(listings[0]!).toHaveProperty('url', 'https://abc.com');
        expect(listings[0]!.offers).toHaveLength(3);
        expect(listings[0]!.offers[1]!).toHaveProperty('title', 'DwaModified');
        expect(listings[0]!.offers[1]!).toHaveProperty('content', '<p>DwaModified</p>');
    });
});

async function theFollowingListings(...listings: Prisma.ListingCreateInput[]) {
    for (const listing of listings) {
        await prisma.listing.create({ data: listing });
    }
}

function findAllListings() {
    return prisma.listing.findMany({
        select: {
            url: true,
            offers: {
                select: {
                    url: true,
                    title: true,
                    content: true,
                },
            },
        },
    });
}

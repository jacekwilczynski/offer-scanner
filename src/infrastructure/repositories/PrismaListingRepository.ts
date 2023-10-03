import { PrismaClient } from 'prisma/client';
import { Offer } from 'src/model/Offer';
import { Listing } from 'src/model/Listing';
import { ListingRepository } from 'src/application/interfaces/ListingRepository';

export class PrismaListingRepository implements ListingRepository {
    constructor(
        private readonly prisma: PrismaClient,
    ) {
    }

    findAllWatched() {
        return this.prisma.listing.findMany({ where: { isWatched: true } });
    }

    findAllWatchedWithNewOffers() {
        return this.prisma.listing.findMany({
            where: {
                isWatched: true,
                offers: {
                    some: {
                        notifiedAboutAt: null,
                    },
                },
            },
            include: {
                offers: {
                    where: {
                        notifiedAboutAt: null,
                    },
                },
            },
        });
    }

    async addOffers(listing: Listing, offers: Offer[]) {
        await this.prisma.listing.update({
            where: { url: listing.url },
            data: {
                offers: {
                    connectOrCreate: offers.map(offer => ({
                        create: offer,
                        where: { url: offer.url },
                    })),
                },
            },
        });
    }
}

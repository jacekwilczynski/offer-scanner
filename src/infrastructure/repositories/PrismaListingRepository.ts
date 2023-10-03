import { PrismaClient } from 'prisma/client';
import { Offer } from 'src/model/Offer';
import { Listing, SavedListing } from 'src/model/Listing';
import { ListingRepository } from 'src/application/interfaces/ListingRepository';

export class PrismaListingRepository implements ListingRepository {
    constructor(
        private readonly prisma: PrismaClient,
    ) {
    }

    findAllWatched(): Promise<SavedListing[]> {
        return this.prisma.listing.findMany({ where: { isWatched: true } });
    }

    async addOffers(listing: Listing, offers: Offer[]): Promise<void> {
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

import { OfferRepository } from 'src/application/interfaces/OfferRepository';
import { Offer } from 'src/model/Offer';
import { PrismaClient } from 'prisma/client';

export class PrismaOfferRepository implements OfferRepository {
    constructor(
        private readonly prisma: PrismaClient,
    ) {
    }

    async markNotified(...offers: Pick<Offer, 'url'>[]): Promise<void> {
        await this.prisma.offer.updateMany({
            data: { notifiedAboutAt: new Date() },
            where: {
                url: { in: offers.map(({ url }) => url) },
            },
        });
    }
}

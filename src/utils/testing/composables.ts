import { PrismaClient } from 'prisma/client';

export function useDatabase() {
    const prisma = new PrismaClient();

    beforeEach(async () => {
        await Promise.all([
            prisma.offer.deleteMany(),
            prisma.listing.deleteMany(),
        ]);
    });

    return prisma;
}

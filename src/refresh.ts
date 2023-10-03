import * as util from 'util';
import { services } from 'src/infrastructure/dependency-injection';

(async function () {
    const prisma = await services.prisma();

    await prisma.offer.deleteMany();
    await prisma.listing.deleteMany();

    await prisma.offer.createMany({
        data: [
            {
                url: 'https://offers.com/1',
                title: 'One',
            },
            {
                url: 'https://offers.com/2',
                title: 'Two',
            },
        ],
    });

    await prisma.listing.create({
        data: {
            url: 'https://offers.com/',
            offers: {
                connect: [
                    { url: 'https://offers.com/1' },
                    { url: 'https://offers.com/2' },
                ],
            },
        },
    });

    const listing = await prisma.listing.findMany({ include: { offers: true } });

    util.inspect.defaultOptions.depth = 5;
    console.log(listing);

    process.exit();
})();

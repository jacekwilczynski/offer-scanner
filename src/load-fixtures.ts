import { services } from 'src/dependency-injection';

(async function () {
    const prisma = await services.prisma();
    await prisma.offer.deleteMany();
    await prisma.listing.deleteMany();

    await prisma.listing.createMany({
        data: [
            { url: 'https://www.olx.pl/nieruchomosci/mieszkania/' },
            { url: 'https://www.otodom.pl/pl/wyniki/sprzedaz/mieszkanie/cala-polska?viewType=listing/' },
        ],
    });

    process.exit();
})();

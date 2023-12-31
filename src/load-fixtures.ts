import { runWithServices } from 'src/dependency-injection';

runWithServices(['prisma'], async ({ prisma }) => {
    if (process.argv.includes('--reset')) {
        await prisma.offer.deleteMany();
        await prisma.listing.deleteMany();
    }

    await prisma.listing.createMany({
        data: [
            { url: 'https://www.olx.pl/nieruchomosci/mieszkania/' },
            { url: 'https://www.otodom.pl/pl/wyniki/sprzedaz/mieszkanie/cala-polska?viewType=listing/' },
        ],
        skipDuplicates: true,
    });
});

import { db } from 'src/init/services';
import { listing, listingToOffer, offer } from 'src/schema';

(async function () {
    await db.delete(listingToOffer);
    await db.delete(listing);
    await db.delete(offer);

    const l = await db.insert(listing).values({ url: 'https://offers.com/' }).returning();
    const o = await db.insert(offer).values([
        { url: 'https://offers.com/1', title: 'one' },
        { url: 'https://offers.com/2', title: 'two' },
    ]).returning();

    await db.insert(listingToOffer).values([
        { listingId: l[0]!.id, offerId: o[0]!.id },
        { listingId: l[0]!.id, offerId: o[1]!.id },
    ]);

    const result = await db.query.listing.findMany({
        with: { listingToOffer: { with: { offer: true } } },
    });

    console.log(JSON.stringify(result, null, 4));

    process.exit();
})();

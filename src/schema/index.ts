import { integer, pgTable, primaryKey, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export type Listing = typeof listing.$inferSelect;
export type ListingInput = typeof listing.$inferInsert;
export const listing = pgTable(
    'listing',
    {
        id: serial('id').primaryKey(),
        url: text('url').unique().notNull(),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
);
export const listingRelations = relations(listing, ({ many }) => ({
    listingToOffer: many(listingToOffer),
}));

export const listingToOffer = pgTable(
    'listing_to_offer',
    {
        listingId: integer('listing_id').notNull().references(() => listing.id),
        offerId: integer('offer_id').notNull().references(() => offer.id),
    },
    t => ({
        pk: primaryKey(t.listingId, t.offerId),
    }),
);
export const listingToOfferRelations = relations(listingToOffer, ({ one }) => ({
    listing: one(listing, {
        fields: [listingToOffer.listingId],
        references: [listing.id],
    }),
    offer: one(offer, {
        fields: [listingToOffer.offerId],
        references: [offer.id],
    }),
}));

export type Offer = typeof offer.$inferSelect;
export type OfferInput = typeof offer.$inferInsert;
export const offer = pgTable(
    'offer',
    {
        id: serial('id').primaryKey(),
        url: text('url').unique().notNull(),
        title: text('title').notNull(),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
);
export const offerRelations = relations(offer, ({ many }) => ({
    listingToOffer: many(listingToOffer),
}));

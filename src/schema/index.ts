import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

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

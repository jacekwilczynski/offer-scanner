import { index, pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export type ExistingOffer = typeof offer.$inferSelect;
export type NewOffer = typeof offer.$inferInsert;
export const offer = pgTable(
    'offer',
    {
        id: serial('id').primaryKey(),
        url: text('url').unique().notNull(),
        hash: uuid('hash').unique().notNull(),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    table => ({
        hashIndex: index('hash_idx').on(table.hash),
    }),
);

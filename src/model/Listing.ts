import { Listing as PrismaListing, Prisma } from 'prisma/client';
import { RequiredOnly } from 'src/utils/types';
import { Offer } from 'src/model/Offer';
import ListingCreateInput = Prisma.ListingCreateInput;

export type SavedListing = PrismaListing
export type SavedListingWithOffers = PrismaListing & { offers: Offer[] }
export type Listing = RequiredOnly<ListingCreateInput>

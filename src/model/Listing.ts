import { Listing as PrismaListing, Prisma } from 'prisma/client';
import { RequiredOnly } from 'src/utils/types';
import ListingCreateInput = Prisma.ListingCreateInput;

export type SavedListing = PrismaListing
export type Listing = RequiredOnly<ListingCreateInput>

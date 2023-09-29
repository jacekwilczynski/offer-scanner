import { Listing as PrismaListing, Prisma } from 'prisma/client';
import { RequiredOnly } from 'src/utils/types';
import { Offer } from 'src/model/Offer';
import ListingCreateInput = Prisma.ListingCreateInput;

export type SavedListing = PrismaListing
export type Listing = RequiredOnly<ListingCreateInput>

export interface ListingRepository {
    findAllWatched(): Promise<SavedListing[]>;

    addOffers(listing: Listing, offers: Offer[]): Promise<void>;
}

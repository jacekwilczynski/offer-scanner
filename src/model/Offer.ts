import { Offer as PrismaOffer, Prisma } from 'prisma/client';
import OfferCreateInput = Prisma.OfferCreateInput;
import { RequiredOnly } from 'src/utils/types';

export type SavedOffer = PrismaOffer
export type Offer = RequiredOnly<OfferCreateInput>

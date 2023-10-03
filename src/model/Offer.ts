import { Prisma } from 'prisma/client';
import { RequiredOnly } from 'src/utils/types';
import OfferCreateInput = Prisma.OfferCreateInput;

export type Offer = RequiredOnly<OfferCreateInput>

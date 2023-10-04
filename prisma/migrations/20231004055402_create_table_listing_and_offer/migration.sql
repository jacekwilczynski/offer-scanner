-- CreateTable
CREATE TABLE "Listing" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "isWatched" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "notifiedAboutAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ListingToOffer" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Listing_url_key" ON "Listing"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Offer_url_key" ON "Offer"("url");

-- CreateIndex
CREATE UNIQUE INDEX "_ListingToOffer_AB_unique" ON "_ListingToOffer"("A", "B");

-- CreateIndex
CREATE INDEX "_ListingToOffer_B_index" ON "_ListingToOffer"("B");

-- AddForeignKey
ALTER TABLE "_ListingToOffer" ADD CONSTRAINT "_ListingToOffer_A_fkey" FOREIGN KEY ("A") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListingToOffer" ADD CONSTRAINT "_ListingToOffer_B_fkey" FOREIGN KEY ("B") REFERENCES "Offer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

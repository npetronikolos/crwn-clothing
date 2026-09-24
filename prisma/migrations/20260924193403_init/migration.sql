-- CreateTable
CREATE TABLE "Collection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "routeName" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "priceInCents" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "collectionId" INTEGER NOT NULL,
    CONSTRAINT "Item_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Section" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "size" TEXT,
    "linkUrl" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Collection_title_key" ON "Collection"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_routeName_key" ON "Collection"("routeName");

-- CreateIndex
CREATE INDEX "Item_collectionId_idx" ON "Item"("collectionId");

-- CreateIndex
CREATE UNIQUE INDEX "Section_title_key" ON "Section"("title");

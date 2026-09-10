-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_nftTokenId_key" ON "Asset"("nftTokenId");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_fileHash_key" ON "Asset"("fileHash");

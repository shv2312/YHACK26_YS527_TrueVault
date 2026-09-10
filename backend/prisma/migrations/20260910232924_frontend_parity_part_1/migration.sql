-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "fileHash" TEXT,
ADD COLUMN     "nftTokenId" TEXT,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'document';

-- AlterTable
ALTER TABLE "AuditEvent" ADD COLUMN     "assetId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "walletAddress" TEXT;

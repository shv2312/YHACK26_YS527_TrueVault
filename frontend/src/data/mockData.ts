export const mockUser = {
  id: 'usr_123',
  username: 'demo_owner',
  role: 'OWNER',
  walletAddress: '0x1234...5678',
};

export const mockAssets = [
  {
    id: 'ast_1',
    name: 'Property Deed',
    type: 'document',
    ownerId: 'usr_123',
    ownerWallet: '0x1234...5678',
    nftTokenId: '1042',
    fileHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    accessStatus: 'OWNER',
    blockchainStatus: 'CONFIRMED',
  },
  {
    id: 'ast_2',
    name: 'Identity Verification',
    type: 'identity',
    ownerId: 'usr_123',
    ownerWallet: '0x1234...5678',
    nftTokenId: '1043',
    fileHash: 'f4d0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    accessStatus: 'SHARED',
    blockchainStatus: 'PENDING',
  },
];

export const mockAuditLogs = [
  { id: 'log_1', action: 'Identity verified', timestamp: '2026-09-10T10:00:00Z', assetId: null },
  { id: 'log_2', action: 'Asset uploaded (Property Deed)', timestamp: '2026-09-10T10:30:00Z', assetId: 'ast_1' },
  { id: 'log_3', action: 'NFT minted (Token #1042)', timestamp: '2026-09-10T10:35:00Z', assetId: 'ast_1' },
  { id: 'log_4', action: 'Access granted to VERIFIER', timestamp: '2026-09-10T11:00:00Z', assetId: 'ast_1' },
];

export const mockRoles = ['ADMIN', 'OWNER', 'OFFICIAL', 'VERIFIER'];

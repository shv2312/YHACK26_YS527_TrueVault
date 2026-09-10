export interface IBlockchainAdapter {
  getHealth(): Promise<string>;
  mintOwnership(assetId: string, ownerId: string): Promise<{ txHash: string; status: string }>;
  getOwner(assetId: string): Promise<string | null>;
  grantPermission(assetId: string, granteeId: string): Promise<{ txHash: string; status: string }>;
  verifyIntegrity(assetId: string, fileHash: string): Promise<boolean>;
}

export class MockBlockchainAdapter implements IBlockchainAdapter {
  async getHealth(): Promise<string> {
    return 'MOCK';
  }

  async mintOwnership(assetId: string, ownerId: string): Promise<{ txHash: string; status: string }> {
    console.log(`[Mock Blockchain] Minting ownership for asset ${assetId} to ${ownerId}`);
    return {
      txHash: `mock_tx_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      status: 'DEMO'
    };
  }

  async getOwner(assetId: string): Promise<string | null> {
    console.log(`[Mock Blockchain] Checking owner for asset ${assetId}`);
    return null; // Mock does not store state
  }

  async grantPermission(assetId: string, granteeId: string): Promise<{ txHash: string; status: string }> {
    console.log(`[Mock Blockchain] Granting permission for asset ${assetId} to ${granteeId}`);
    return {
      txHash: `mock_tx_grant_${Date.now()}`,
      status: 'DEMO'
    };
  }

  async verifyIntegrity(assetId: string, fileHash: string): Promise<boolean> {
    console.log(`[Mock Blockchain] Verifying integrity for asset ${assetId} with hash ${fileHash}`);
    return true; // Assume true for mock
  }
}

export const blockchainAdapter = new MockBlockchainAdapter();

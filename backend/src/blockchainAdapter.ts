import { RealBlockchainAdapter } from './blockchain/RealBlockchainAdapter';

export interface IBlockchainAdapter {
  getHealth(): Promise<string>;
  isVerified(walletAddress: string): Promise<boolean>;
  registerIdentity(walletAddress: string): Promise<{ txHash: string; status: string }>;
  mintOwnership(assetId: string, ownerWallet: string, assetHashHex: string): Promise<{ txHash: string; status: string; tokenId: string }>;
  getOwner(assetId: string): Promise<string | null>;
  grantPermission(assetId: string, granteeWallet: string): Promise<{ txHash: string; status: string }>;
  verifyIntegrity(assetId: string, fileHash: string): Promise<boolean>;
}

export class MockBlockchainAdapter implements IBlockchainAdapter {
  async getHealth(): Promise<string> {
    return 'MOCK';
  }

  async isVerified(walletAddress: string): Promise<boolean> {
    return true; // Assume true for mock
  }

  async registerIdentity(walletAddress: string): Promise<{ txHash: string; status: string }> {
    console.log(`[Mock Blockchain] Registering identity for ${walletAddress}`);
    return {
      txHash: `mock_tx_ident_${Date.now()}`,
      status: 'DEMO'
    };
  }

  async mintOwnership(assetId: string, ownerWallet: string, assetHashHex: string): Promise<{ txHash: string; status: string; tokenId: string }> {
    console.log(`[Mock Blockchain] Minting ownership for asset ${assetId} to ${ownerWallet} with hash ${assetHashHex}`);
    return {
      txHash: `mock_tx_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      status: 'DEMO',
      tokenId: `mock_token_${Date.now()}`
    };
  }

  async getOwner(assetId: string): Promise<string | null> {
    console.log(`[Mock Blockchain] Checking owner for asset ${assetId}`);
    return null; // Mock does not store state
  }

  async grantPermission(assetId: string, granteeWallet: string): Promise<{ txHash: string; status: string }> {
    console.log(`[Mock Blockchain] Granting permission for asset ${assetId} to ${granteeWallet}`);
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

// Export the appropriate adapter based on environment variables
let adapter: IBlockchainAdapter;

if (process.env.BLOCKCHAIN_MODE === 'mock') {
  adapter = new MockBlockchainAdapter();
} else if (process.env.BLOCKCHAIN_MODE === 'real') {
  if (!process.env.BLOCKCHAIN_RPC_URL || !process.env.CONTRACT_ADDRESS || !process.env.BACKEND_PRIVATE_KEY) {
    throw new Error('BLOCKCHAIN_MODE is "real" but required blockchain environment variables are missing.');
  }
  adapter = new RealBlockchainAdapter(
    process.env.BLOCKCHAIN_RPC_URL,
    process.env.CONTRACT_ADDRESS,
    process.env.BACKEND_PRIVATE_KEY
  );
} else {
  throw new Error('BLOCKCHAIN_MODE must be explicitly set to "real" or "mock". Silent fallback is disabled.');
}

export const blockchainAdapter: IBlockchainAdapter = adapter;

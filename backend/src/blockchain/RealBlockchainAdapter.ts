import { ethers } from 'ethers';
import { IBlockchainAdapter } from '../blockchainAdapter';

const CONTRACT_ABI = [
  "function registerIdentity(address user) external",
  "function isVerified(address user) view returns (bool)",
  "function mintAsset(address to, uint256 tokenId, bytes32 assetHash) external",
  "function getAssetHash(uint256 tokenId) view returns (bytes32)",
  "function grantAccess(uint256 tokenId, address user) external",
  "function revokeAccess(uint256 tokenId, address user) external",
  "function checkAccess(uint256 tokenId, address user) view returns (bool)"
];

export class RealBlockchainAdapter implements IBlockchainAdapter {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;

  constructor(rpcUrl: string, contractAddress: string, privateKey: string) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
    this.contract = new ethers.Contract(contractAddress, CONTRACT_ABI, this.wallet);
  }

  async getHealth(): Promise<string> {
    try {
      // Check RPC connection
      const network = await this.provider.getNetwork();
      // Check contract code exists
      const code = await this.provider.getCode(await this.contract.getAddress());
      if (code === '0x') {
        return 'RPC Reachable, Contract Missing';
      }
      return 'AVAILABLE';
    } catch (e) {
      return 'RPC Unavailable';
    }
  }

  async isVerified(walletAddress: string): Promise<boolean> {
    return this.contract.isVerified(walletAddress);
  }

  async registerIdentity(walletAddress: string): Promise<{ txHash: string; status: string }> {
    try {
      const tx = await this.contract.registerIdentity(walletAddress);
      const receipt = await tx.wait();
      return { txHash: receipt.hash, status: 'CONFIRMED' };
    } catch (e: any) {
      console.error('[Blockchain] registerIdentity failed:', e.message);
      throw new Error(`Transaction failed: ${e.message}`);
    }
  }

  async mintOwnership(assetId: string, ownerWallet: string, assetHashHex: string): Promise<{ txHash: string; status: string; tokenId: string }> {
    try {
      // Ensure the wallet is verified before minting
      const verified = await this.isVerified(ownerWallet);
      if (!verified) {
        throw new Error('Wallet is not verified for minting');
      }

      // Convert the string UUID to a tokenId (hash it to uint256)
      const tokenIdStr = BigInt(ethers.keccak256(ethers.toUtf8Bytes(assetId))).toString();
      
      const tx = await this.contract.mintAsset(ownerWallet, tokenIdStr, `0x${assetHashHex}`);
      const receipt = await tx.wait();
      return { txHash: receipt.hash, status: 'CONFIRMED', tokenId: tokenIdStr };
    } catch (e: any) {
      console.error('[Blockchain] mintOwnership failed:', e.message);
      throw new Error(`Minting failed: ${e.message}`);
    }
  }

  async getOwner(assetId: string): Promise<string | null> {
    // Contract doesn't expose ownerOf directly in our simple ABI, but it inherits ERC721.
    // If we want to check owner, we can add ownerOf(uint256) to the ABI array.
    try {
      const tokenIdStr = BigInt(ethers.keccak256(ethers.toUtf8Bytes(assetId))).toString();
      const contractWithERC721 = new ethers.Contract(await this.contract.getAddress(), [...CONTRACT_ABI, "function ownerOf(uint256) view returns (address)"], this.provider);
      return await contractWithERC721.ownerOf(tokenIdStr);
    } catch (e) {
      return null;
    }
  }

  async grantPermission(assetId: string, granteeWallet: string): Promise<{ txHash: string; status: string }> {
    try {
      const tokenIdStr = BigInt(ethers.keccak256(ethers.toUtf8Bytes(assetId))).toString();
      const tx = await this.contract.grantAccess(tokenIdStr, granteeWallet);
      const receipt = await tx.wait();
      return { txHash: receipt.hash, status: 'CONFIRMED' };
    } catch (e: any) {
      console.error('[Blockchain] grantPermission failed:', e.message);
      throw new Error(`Granting permission failed: ${e.message}`);
    }
  }

  async verifyIntegrity(assetId: string, fileHash: string): Promise<boolean> {
    try {
      const tokenIdStr = BigInt(ethers.keccak256(ethers.toUtf8Bytes(assetId))).toString();
      const onChainHash = await this.contract.getAssetHash(tokenIdStr);
      return onChainHash === `0x${fileHash}`;
    } catch (e) {
      return false;
    }
  }
}

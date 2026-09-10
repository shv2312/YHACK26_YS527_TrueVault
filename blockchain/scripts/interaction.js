import { ethers } from "hardhat";

export async function registerIdentity(contractAddress: string, userAddress: string) {
  const TrueVaultAsset = await ethers.getContractAt("TrueVaultAsset", contractAddress);
  const tx = await TrueVaultAsset.registerIdentity(userAddress);
  await tx.wait();
  console.log(`Identity registered for ${userAddress}`);
}

export async function mintAsset(contractAddress: string, toAddress: string, tokenId: number, assetHash: string) {
  const TrueVaultAsset = await ethers.getContractAt("TrueVaultAsset", contractAddress);
  const hashBytes = ethers.keccak256(ethers.toUtf8Bytes(assetHash));
  const tx = await TrueVaultAsset.mintAsset(toAddress, tokenId, hashBytes);
  await tx.wait();
  console.log(`Asset ${tokenId} minted to ${toAddress}`);
}

export async function grantAccess(contractAddress: string, tokenId: number, userAddress: string) {
  const TrueVaultAsset = await ethers.getContractAt("TrueVaultAsset", contractAddress);
  const tx = await TrueVaultAsset.grantAccess(tokenId, userAddress);
  await tx.wait();
  console.log(`Access granted for token ${tokenId} to ${userAddress}`);
}

export async function revokeAccess(contractAddress: string, tokenId: number, userAddress: string) {
  const TrueVaultAsset = await ethers.getContractAt("TrueVaultAsset", contractAddress);
  const tx = await TrueVaultAsset.revokeAccess(tokenId, userAddress);
  await tx.wait();
  console.log(`Access revoked for token ${tokenId} from ${userAddress}`);
}

export async function checkAccess(contractAddress: string, tokenId: number, userAddress: string) {
  const TrueVaultAsset = await ethers.getContractAt("TrueVaultAsset", contractAddress);
  const hasAccess = await TrueVaultAsset.checkAccess(tokenId, userAddress);
  console.log(`User ${userAddress} has access to token ${tokenId}: ${hasAccess}`);
  return hasAccess;
}

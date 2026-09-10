const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const TrueVaultAsset = await ethers.getContractFactory("TrueVaultAsset");
  const trueVaultAsset = await TrueVaultAsset.deploy();
  await trueVaultAsset.waitForDeployment();

  const contractAddress = await trueVaultAsset.getAddress();
  console.log("TrueVaultAsset deployed to:", contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

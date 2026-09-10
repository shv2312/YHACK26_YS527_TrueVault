const hre = require("hardhat");
const { ethers } = hre;

async function main() {
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const TrueVaultAsset = await ethers.getContractFactory("TrueVaultAsset");
    const contract = TrueVaultAsset.attach(contractAddress);

    const [deployer, backendServiceAccount] = await ethers.getSigners();
    
    const VERIFIER_ROLE = await contract.VERIFIER_ROLE();
    const OFFICIAL_ROLE = await contract.OFFICIAL_ROLE();

    // Grant roles
    console.log("Granting VERIFIER_ROLE...");
    const tx1 = await contract.grantRole(VERIFIER_ROLE, backendServiceAccount.address);
    const receipt1 = await tx1.wait();
    console.log("VERIFIER_ROLE granted. Tx:", receipt1.hash);

    console.log("Granting OFFICIAL_ROLE...");
    const tx2 = await contract.grantRole(OFFICIAL_ROLE, backendServiceAccount.address);
    const receipt2 = await tx2.wait();
    console.log("OFFICIAL_ROLE granted. Tx:", receipt2.hash);

    console.log("Service Account Address:", backendServiceAccount.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

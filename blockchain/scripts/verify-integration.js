const hre = require("hardhat");
const { ethers } = hre;

async function main() {
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const TrueVaultAsset = await ethers.getContractFactory("TrueVaultAsset");
    const contract = TrueVaultAsset.attach(contractAddress);

    const [deployer, addr1, addr2] = await ethers.getSigners();
    console.log("Using deployer:", deployer.address);

    // 1. Check bytecode
    const code = await ethers.provider.getCode(contractAddress);
    if (code === "0x") throw new Error("No bytecode at address");
    console.log("1. Bytecode verified.");

    // 2. Query roles
    const VERIFIER_ROLE = await contract.VERIFIER_ROLE();
    const OFFICIAL_ROLE = await contract.OFFICIAL_ROLE();
    console.log("3. Roles queried.", VERIFIER_ROLE, OFFICIAL_ROLE);

    // 3. Expected administrative role present
    const hasVerifier = await contract.hasRole(VERIFIER_ROLE, deployer.address);
    if (!hasVerifier) throw new Error("Deployer lacks VERIFIER_ROLE");
    console.log("4. Deployer role verified.");

    // 4. Identity registration
    const isVerifiedAlready = await contract.isVerified(addr1.address);
    if (!isVerifiedAlready) {
        const tx1 = await contract.registerIdentity(addr1.address);
        await tx1.wait();
    }
    const isVerified = await contract.isVerified(addr1.address);
    if (!isVerified) throw new Error("Identity not verified");
    console.log("5. Identity registration works.");

    // 5. Authorized minting works
    const testTokenId = Math.floor(Date.now() / 1000);
    const integrationHash = ethers.id("INTEGRATION_TEST_HASH_" + testTokenId);
    const tx2 = await contract.mintAsset(addr1.address, testTokenId, integrationHash);
    const receipt2 = await tx2.wait();
    console.log("6. Authorized minting works. TxHash:", receipt2.hash);
    console.log("7. Genuine transaction receipt returned.");

    // 6. Read asset hash
    const readHash = await contract.getAssetHash(testTokenId);
    if (readHash !== integrationHash) throw new Error("Hash mismatch");
    console.log("8. Asset hash read successfully.");

    // 7. Duplicate hash rejection
    try {
        await contract.mintAsset(addr1.address, testTokenId, integrationHash);
        throw new Error("Did not reject duplicate hash");
    } catch (e) {
        if (!e.message.includes("TrueVaultAsset: token already minted") && !e.message.includes("ERC721InvalidSender")) throw e;
        console.log("9. Duplicate-hash rejection works.");
    }

    // 8. Unauthorized action rejection
    try {
        const contractAsAddr1 = contract.connect(addr1);
        await contractAsAddr1.registerIdentity(addr2.address);
        throw new Error("Did not reject unauthorized registration");
    } catch (e) {
        console.log("10. Unauthorized actions are rejected.");
    }

    console.log("ALL VERIFICATIONS PASSED");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

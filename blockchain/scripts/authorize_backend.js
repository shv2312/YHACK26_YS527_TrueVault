const { ethers } = require("hardhat");

async function main() {
    const backendWallet = "0x704ed04d239a9e73FeD5b4EBe16ECecc694476b0";
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    
    // 1. Validation
    const isValid = ethers.isAddress(backendWallet);
    console.log(`Address Validation: ${isValid}`);
    if (!isValid) throw new Error("Invalid address");

    // 2. Check current balance
    const provider = ethers.provider;
    const initialBalanceWei = await provider.getBalance(backendWallet);
    const initialBalance = ethers.formatEther(initialBalanceWei);
    console.log(`Initial Balance: ${initialBalance} ETH`);

    // 3. Fund with 10 ETH
    const [admin] = await ethers.getSigners();
    const fundAmount = ethers.parseEther("10.0");
    const txFund = await admin.sendTransaction({
        to: backendWallet,
        value: fundAmount
    });
    const receiptFund = await txFund.wait();
    console.log(`Funding Tx: ${receiptFund.hash}`);

    const newBalanceWei = await provider.getBalance(backendWallet);
    const newBalance = ethers.formatEther(newBalanceWei);
    console.log(`New Balance: ${newBalance} ETH`);

    // 4. Connect to contract
    const TrueVaultAsset = await ethers.getContractFactory("TrueVaultAsset");
    const contract = TrueVaultAsset.attach(contractAddress);

    // 5. Grant roles
    const VERIFIER_ROLE = await contract.VERIFIER_ROLE();
    const OFFICIAL_ROLE = await contract.OFFICIAL_ROLE();
    const DEFAULT_ADMIN_ROLE = await contract.DEFAULT_ADMIN_ROLE();

    const txVerifier = await contract.grantRole(VERIFIER_ROLE, backendWallet);
    const receiptVerifier = await txVerifier.wait();
    console.log(`Verifier Grant Tx: ${receiptVerifier.hash}`);

    const txOfficial = await contract.grantRole(OFFICIAL_ROLE, backendWallet);
    const receiptOfficial = await txOfficial.wait();
    console.log(`Official Grant Tx: ${receiptOfficial.hash}`);

    // 6. Verify roles
    const hasVerifier = await contract.hasRole(VERIFIER_ROLE, backendWallet);
    const hasOfficial = await contract.hasRole(OFFICIAL_ROLE, backendWallet);
    const hasAdmin = await contract.hasRole(DEFAULT_ADMIN_ROLE, backendWallet);

    console.log(`Has VERIFIER_ROLE: ${hasVerifier}`);
    console.log(`Has OFFICIAL_ROLE: ${hasOfficial}`);
    console.log(`Has DEFAULT_ADMIN_ROLE: ${hasAdmin}`);
}

main().catch(console.error);

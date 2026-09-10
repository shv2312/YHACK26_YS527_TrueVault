# Blockchain LAN Integration Node Guide

This guide contains the non-secret connection information for the TrueVault backend (Shri Hari) to connect to Parthiban's local Hardhat blockchain node.

## Node Startup
- **Requirement:** Laptops must be connected to a shared, trusted **Private** network. Do NOT run this on a Public Wi-Fi network.
- **Port Used:** `8545` (TCP)
- **Node Start Command:** `npx hardhat node --hostname 0.0.0.0 --port 8545`
- **Deployment Command:** `npx hardhat run scripts/deploy.js --network localhost` (After a restart, you MUST redeploy the contract to generate a new address).

## Connection Information
- **RPC URL:** `http://172.168.77.10:8545` (Replace with current IPv4 if network reconnects).
- **Chain ID:** `31337`
- **Current Contract Address:** `0x5FbDB2315678afecb367f032d93F642f64180aa3` (Temporary! Will reset if Hardhat restarts).
- **ABI Location:** `blockchain/artifacts/contracts/TrueVaultAsset.sol/TrueVaultAsset.json`

## Backend Integration Requirements
The backend must supply these environment variables in its own `.env` file (DO NOT commit them):
- `BLOCKCHAIN_RPC_URL`
- `CONTRACT_ADDRESS`
- `BACKEND_PRIVATE_KEY`

### Backend Service Account Roles
- **Public Address:** `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
- **Granted Roles:** `VERIFIER_ROLE`, `OFFICIAL_ROLE`
- **Warning:** Hardhat deterministic accounts are publicly known. Do NOT use this private key on a real mainnet.

## Status Summary
- **Verification:** Local node successfully started, contract deployed, bytecode verified, duplicate/access integration test cases executed and passed.
- **Remote Connectivity Status:** Local node and deployment verified; remote LAN connectivity pending.
- **Security Limitations:** Node runs in-memory; state resets upon closure. Port 8545 is exposed on `0.0.0.0` to the local `Private` LAN. No Public exposure permitted.

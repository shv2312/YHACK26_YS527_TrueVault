# TrueVaultAsset Smart Contract Interface

## Contract Information
- **Contract Name:** TrueVaultAsset
- **Solidity Version:** ^0.8.20 (Compiled with 0.8.24)
- **Network:** Local Hardhat Network
- **Chain ID:** 31337
- **Deployment Command:** `npx.cmd hardhat run scripts/deploy.js --network localhost`
- **Contract Address (Latest Deployment):** `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0` (Temporary Local Address)

### Constructor Parameters
- `TrueVaultAsset()` has no constructor parameters. It inherits from ERC721 and AccessControl, initializing the token name to "TrueVaultAsset" and symbol to "TVA". It assigns `DEFAULT_ADMIN_ROLE`, `VERIFIER_ROLE`, and `OFFICIAL_ROLE` to `msg.sender`.

### Role Identifiers
- `VERIFIER_ROLE`: Used to verify identities (KYC).
- `OFFICIAL_ROLE`: Used to mint assets.

## Available Functions

### `registerIdentity(address user)`
- **Description:** Registers a verified wallet identity. Restricted to `VERIFIER_ROLE`.
- **Parameters:** 
  - `user`: The address of the user to be verified.

### `isVerified(address user)`
- **Description:** Checks if a given address is a verified identity.
- **Parameters:**
  - `user`: Address to check.
- **Returns:** `bool`

### `mintAsset(address to, uint256 tokenId, bytes32 assetHash)`
- **Description:** Mints a new NFT representing a digital asset. Restricted to `OFFICIAL_ROLE`.
- **Parameters:**
  - `to`: The verified recipient address.
  - `tokenId`: Unique identifier for the NFT.
  - `assetHash`: SHA-256 hash or commitment of the digital asset file.

### `getAssetHash(uint256 tokenId)`
- **Description:** Returns the associated asset hash for a given token ID.
- **Parameters:**
  - `tokenId`: The NFT token ID.
- **Returns:** `bytes32`

### `grantAccess(uint256 tokenId, address user)`
- **Description:** Grants access permissions to a file/asset for another user. Restricted to token owner.
- **Parameters:**
  - `tokenId`: The NFT token ID.
  - `user`: The address to grant access to.

### `revokeAccess(uint256 tokenId, address user)`
- **Description:** Revokes access permissions from a file/asset for another user. Restricted to token owner.
- **Parameters:**
  - `tokenId`: The NFT token ID.
  - `user`: The address to revoke access from.

### `checkAccess(uint256 tokenId, address user)`
- **Description:** Checks whether a user has been granted access to an asset. Returns true if the user is the owner or explicitly granted access.
- **Parameters:**
  - `tokenId`: The NFT token ID.
  - `user`: The address to check.
- **Returns:** `bool`

## Events

- `IdentityRegistered(address indexed user, address indexed verifier)`
- `AssetMinted(uint256 indexed tokenId, address indexed owner, bytes32 assetHash)`
- `AccessGranted(uint256 indexed tokenId, address indexed user)`
- `AccessRevoked(uint256 indexed tokenId, address indexed user)`

## Frontend Integration Steps
1. Include `ethers.js` in the frontend project.
2. Ensure the user connects their wallet using an injected provider (e.g., MetaMask).
3. Import the `TrueVaultAsset.json` ABI from `blockchain/artifacts/contracts/TrueVaultAsset.sol/TrueVaultAsset.json`.
4. Instantiate the contract: `const contract = new ethers.Contract(contractAddress, abi, signer)`.
5. For read operations, use `contract.isVerified(user)`. For writes, handle the transaction promise and listen for the relevant events.

## Backend Integration Steps
1. **Dedicated Service Account:** Use one dedicated development service account/wallet for backend operations.
2. **Environment Variables Needed:** 
   - `BACKEND_PRIVATE_KEY` (never committed to the repo, loaded from a secure `.env` or secret manager).
   - `RPC_URL` (e.g., `http://127.0.0.1:8545` for local).
3. The backend should operate with this wallet, which must be granted `VERIFIER_ROLE` and `OFFICIAL_ROLE` by the admin.
4. When a user completes KYC, the backend calls `registerIdentity(address)` to approve them.
5. When a user uploads a file, the backend hashes the file, stores it (IPFS/S3), and calls `mintAsset(userAddress, tokenId, hash)`.

## Transaction States
- **Pending:** The transaction is broadcast to the network but not yet mined.
- **Success:** The transaction is mined, and the relevant event (e.g., `AssetMinted`) is emitted.
- **Reverted:** The transaction failed (e.g., user is unverified, caller lacks role, asset already exists).
> **Note:** Do not instruct the backend to store private keys belonging to individual OFFICIAL or VERIFIER users. Users must control their own wallet keys. The backend should strictly use its own service account.

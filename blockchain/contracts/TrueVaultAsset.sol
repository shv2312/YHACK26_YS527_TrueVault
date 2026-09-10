// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract TrueVaultAsset is ERC721, AccessControl {
    bytes32 public constant OFFICIAL_ROLE = keccak256("OFFICIAL_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    mapping(address => bool) private _isVerifiedIdentity;
    mapping(uint256 => bytes32) private _assetHashes;
    mapping(uint256 => mapping(address => bool)) private _hasAccess;

    event IdentityRegistered(address indexed user, address indexed verifier);
    event AssetMinted(uint256 indexed tokenId, address indexed owner, bytes32 assetHash);
    event AccessGranted(uint256 indexed tokenId, address indexed user);
    event AccessRevoked(uint256 indexed tokenId, address indexed user);

    constructor() ERC721("TrueVaultAsset", "TVA") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(OFFICIAL_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
    }

    modifier onlyVerified(address account) {
        require(_isVerifiedIdentity[account], "TrueVaultAsset: identity not verified");
        _;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev Registers a verified wallet identity.
     * Can only be called by an account with VERIFIER_ROLE.
     */
    function registerIdentity(address user) external onlyRole(VERIFIER_ROLE) {
        require(!_isVerifiedIdentity[user], "TrueVaultAsset: identity already registered");
        _isVerifiedIdentity[user] = true;
        emit IdentityRegistered(user, msg.sender);
    }

    /**
     * @dev Checks if an identity is verified.
     */
    function isVerified(address user) external view returns (bool) {
        return _isVerifiedIdentity[user];
    }

    /**
     * @dev Creates an NFT for a digital asset.
     * Can only be called by an account with OFFICIAL_ROLE.
     * Requires the receiver `to` to be a verified identity.
     */
    function mintAsset(address to, uint256 tokenId, bytes32 assetHash) external onlyRole(OFFICIAL_ROLE) onlyVerified(to) {
        require(assetHash != bytes32(0), "TrueVaultAsset: invalid asset hash");
        require(_assetHashes[tokenId] == bytes32(0), "TrueVaultAsset: token already minted");
        
        _assetHashes[tokenId] = assetHash;
        _safeMint(to, tokenId);
        
        emit AssetMinted(tokenId, to, assetHash);
    }

    /**
     * @dev Returns the hash of the digital asset associated with `tokenId`.
     */
    function getAssetHash(uint256 tokenId) external view returns (bytes32) {
        _requireOwned(tokenId);
        return _assetHashes[tokenId];
    }

    /**
     * @dev Grants access to a specific file/asset to another user.
     * Can only be called by the asset owner.
     */
    function grantAccess(uint256 tokenId, address user) external {
        require(ownerOf(tokenId) == msg.sender, "TrueVaultAsset: only owner can grant access");
        require(user != msg.sender, "TrueVaultAsset: owner already has access");
        require(!_hasAccess[tokenId][user], "TrueVaultAsset: access already granted");
        
        _hasAccess[tokenId][user] = true;
        emit AccessGranted(tokenId, user);
    }

    /**
     * @dev Revokes access to a specific file/asset from another user.
     * Can only be called by the asset owner.
     */
    function revokeAccess(uint256 tokenId, address user) external {
        require(ownerOf(tokenId) == msg.sender, "TrueVaultAsset: only owner can revoke access");
        require(_hasAccess[tokenId][user], "TrueVaultAsset: access not granted");
        
        _hasAccess[tokenId][user] = false;
        emit AccessRevoked(tokenId, user);
    }

    /**
     * @dev Checks whether a user has access to a specific asset.
     */
    function checkAccess(uint256 tokenId, address user) external view returns (bool) {
        _requireOwned(tokenId);
        return ownerOf(tokenId) == user || _hasAccess[tokenId][user];
    }

    /**
     * @dev Hook that is called before any token transfer.
     * This ensures that NFTs can only be transferred to verified identities.
     * It also invalidates the previous owner's access permissions.
     */
    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        
        // If it's a transfer (not minting or burning), require receiver to be verified
        if (from != address(0) && to != address(0)) {
            require(_isVerifiedIdentity[to], "TrueVaultAsset: receiver not verified");
            
            // Invalidate the previous owner's explicitly granted access permissions if any
            if (_hasAccess[tokenId][from]) {
                _hasAccess[tokenId][from] = false;
                emit AccessRevoked(tokenId, from);
            }
        }

        return super._update(to, tokenId, auth);
    }
}

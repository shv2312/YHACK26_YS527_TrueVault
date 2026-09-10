const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TrueVaultAsset", function () {
  let trueVaultAsset;
  let admin;
  let verifier;
  let official;
  let owner1;
  let owner2;
  let user1;

  const VERIFIER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("VERIFIER_ROLE"));
  const OFFICIAL_ROLE = ethers.keccak256(ethers.toUtf8Bytes("OFFICIAL_ROLE"));
  const ASSET_HASH_1 = ethers.keccak256(ethers.toUtf8Bytes("ASSET_1"));
  const ASSET_HASH_2 = ethers.keccak256(ethers.toUtf8Bytes("ASSET_2"));

  beforeEach(async function () {
    [admin, verifier, official, owner1, owner2, user1] = await ethers.getSigners();

    const TrueVaultAssetFactory = await ethers.getContractFactory("TrueVaultAsset");
    trueVaultAsset = await TrueVaultAssetFactory.deploy();
    await trueVaultAsset.waitForDeployment();

    await trueVaultAsset.grantRole(VERIFIER_ROLE, verifier.address);
    await trueVaultAsset.grantRole(OFFICIAL_ROLE, official.address);
  });

  describe("Identity Registration", function () {
    it("Should register a verified identity", async function () {
      await expect(trueVaultAsset.connect(verifier).registerIdentity(owner1.address))
        .to.emit(trueVaultAsset, "IdentityRegistered")
        .withArgs(owner1.address, verifier.address);

      expect(await trueVaultAsset.isVerified(owner1.address)).to.be.true;
    });

    it("Should revert unauthorized identity registration", async function () {
      await expect(
        trueVaultAsset.connect(user1).registerIdentity(owner2.address)
      ).to.be.revertedWithCustomError(trueVaultAsset, "AccessControlUnauthorizedAccount");
    });
  });

  describe("Asset Management", function () {
    beforeEach(async function () {
      await trueVaultAsset.connect(verifier).registerIdentity(owner1.address);
      await trueVaultAsset.connect(verifier).registerIdentity(owner2.address);
    });

    it("Should create an asset and check NFT ownership", async function () {
      await expect(
        trueVaultAsset.connect(official).mintAsset(owner1.address, 1, ASSET_HASH_1)
      )
        .to.emit(trueVaultAsset, "AssetMinted")
        .withArgs(1, owner1.address, ASSET_HASH_1);

      expect(await trueVaultAsset.ownerOf(1)).to.equal(owner1.address);
    });

    it("Should verify asset hash", async function () {
      await trueVaultAsset.connect(official).mintAsset(owner1.address, 1, ASSET_HASH_1);
      expect(await trueVaultAsset.getAssetHash(1)).to.equal(ASSET_HASH_1);
    });

    it("Should handle duplicate asset creation gracefully", async function () {
      await trueVaultAsset.connect(official).mintAsset(owner1.address, 1, ASSET_HASH_1);
      await expect(
        trueVaultAsset.connect(official).mintAsset(owner2.address, 1, ASSET_HASH_2)
      ).to.be.revertedWith("TrueVaultAsset: token already minted");
    });

    it("Should not allow asset creation for unverified identity", async function () {
      await expect(
        trueVaultAsset.connect(official).mintAsset(user1.address, 1, ASSET_HASH_1)
      ).to.be.revertedWith("TrueVaultAsset: identity not verified");
    });
  });

  describe("Access Control", function () {
    beforeEach(async function () {
      await trueVaultAsset.connect(verifier).registerIdentity(owner1.address);
      await trueVaultAsset.connect(verifier).registerIdentity(owner2.address);
      await trueVaultAsset.connect(official).mintAsset(owner1.address, 1, ASSET_HASH_1);
    });

    it("Should grant access", async function () {
      await expect(trueVaultAsset.connect(owner1).grantAccess(1, user1.address))
        .to.emit(trueVaultAsset, "AccessGranted")
        .withArgs(1, user1.address);

      expect(await trueVaultAsset.checkAccess(1, user1.address)).to.be.true;
    });

    it("Should revoke access", async function () {
      await trueVaultAsset.connect(owner1).grantAccess(1, user1.address);
      await expect(trueVaultAsset.connect(owner1).revokeAccess(1, user1.address))
        .to.emit(trueVaultAsset, "AccessRevoked")
        .withArgs(1, user1.address);

      expect(await trueVaultAsset.checkAccess(1, user1.address)).to.be.false;
    });

    it("Should revert unauthorized access granting", async function () {
      await expect(
        trueVaultAsset.connect(owner2).grantAccess(1, user1.address)
      ).to.be.revertedWith("TrueVaultAsset: only owner can grant access");
    });
  });

  describe("Ownership Transfer and Permission Invalidation", function () {
    beforeEach(async function () {
      await trueVaultAsset.connect(verifier).registerIdentity(owner1.address);
      await trueVaultAsset.connect(verifier).registerIdentity(owner2.address);
      await trueVaultAsset.connect(official).mintAsset(owner1.address, 1, ASSET_HASH_1);
      
      await trueVaultAsset.connect(owner1).grantAccess(1, user1.address);
    });

    it("Should transfer ownership to verified identity", async function () {
      await trueVaultAsset.connect(owner1).transferFrom(owner1.address, owner2.address, 1);
      expect(await trueVaultAsset.ownerOf(1)).to.equal(owner2.address);
    });

    it("Should not transfer ownership to unverified identity", async function () {
      await expect(
        trueVaultAsset.connect(owner1).transferFrom(owner1.address, user1.address, 1)
      ).to.be.revertedWith("TrueVaultAsset: receiver not verified");
    });

    it("Should invalidate previous owner's explicit permissions after transfer", async function () {
      await trueVaultAsset.connect(owner1).transferFrom(owner1.address, owner2.address, 1);
      await trueVaultAsset.connect(owner2).grantAccess(1, owner1.address);
      expect(await trueVaultAsset.checkAccess(1, owner1.address)).to.be.true;

      await trueVaultAsset.connect(verifier).registerIdentity(official.address);
      await trueVaultAsset.connect(owner2).transferFrom(owner2.address, official.address, 1);

      expect(await trueVaultAsset.checkAccess(1, owner2.address)).to.be.false;
    });
  });
});

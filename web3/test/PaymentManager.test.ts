import { expect } from "chai";
import { ethers } from "hardhat";
import { PaymentManager } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("PaymentManager", function () {
  let paymentManager: PaymentManager;
  let owner: SignerWithAddress;
  let creator: SignerWithAddress;
  let buyer: SignerWithAddress;
  
  beforeEach(async function () {
    [owner, creator, buyer] = await ethers.getSigners();
    
    const PaymentManagerFactory = await ethers.getContractFactory("PaymentManager");
    paymentManager = await PaymentManagerFactory.deploy();
    await paymentManager.waitForDeployment();
  });
  
  describe("Content Creation", function () {
    it("Should create content successfully", async function () {
      const contentId = "content-001";
      const price = ethers.parseEther("0.001");
      
      await expect(
        paymentManager.connect(creator).createContent(contentId, price)
      ).to.emit(paymentManager, "ContentCreated")
        .withArgs(contentId, creator.address, price);
      
      const content = await paymentManager.getContent(contentId);
      expect(content.creator).to.equal(creator.address);
      expect(content.price).to.equal(price);
      expect(content.isActive).to.be.true;
    });
    
    it("Should fail if content already exists", async function () {
      const contentId = "content-001";
      const price = ethers.parseEther("0.001");
      
      await paymentManager.connect(creator).createContent(contentId, price);
      
      await expect(
        paymentManager.connect(creator).createContent(contentId, price)
      ).to.be.revertedWith("Content already exists");
    });
  });
  
  describe("Content Purchase", function () {
    const contentId = "content-001";
    const price = ethers.parseEther("0.001");
    
    beforeEach(async function () {
      await paymentManager.connect(creator).createContent(contentId, price);
    });
    
    it("Should purchase access successfully", async function () {
      const initialCreatorBalance = await ethers.provider.getBalance(creator.address);
      
      await expect(
        paymentManager.connect(buyer).purchaseAccess(contentId, { value: price })
      ).to.emit(paymentManager, "PaymentMade")
        .withArgs(buyer.address, contentId, price)
        .and.to.emit(paymentManager, "AccessGranted")
        .withArgs(buyer.address, contentId);
      
      const hasAccess = await paymentManager.checkAccess(buyer.address, contentId);
      expect(hasAccess).to.be.true;
      
      const finalCreatorBalance = await ethers.provider.getBalance(creator.address);
      const platformFee = (price * 500n) / 10000n; // 5%
      const expectedPayment = price - platformFee;
      
      expect(finalCreatorBalance - initialCreatorBalance).to.equal(expectedPayment);
    });
    
    it("Should fail with insufficient payment", async function () {
      const insufficientPayment = ethers.parseEther("0.0005");
      
      await expect(
        paymentManager.connect(buyer).purchaseAccess(contentId, { value: insufficientPayment })
      ).to.be.revertedWith("Insufficient payment");
    });
    
    it("Should fail if already has access", async function () {
      await paymentManager.connect(buyer).purchaseAccess(contentId, { value: price });
      
      await expect(
        paymentManager.connect(buyer).purchaseAccess(contentId, { value: price })
      ).to.be.revertedWith("Already has access");
    });
  });
  
  describe("Platform Fee Management", function () {
    it("Should update platform fee", async function () {
      const newFee = 1000; // 10%
      
      await paymentManager.connect(owner).updatePlatformFee(newFee);
      expect(await paymentManager.platformFeePercentage()).to.equal(newFee);
    });
    
    it("Should fail if fee exceeds 20%", async function () {
      const excessiveFee = 2100; // 21%
      
      await expect(
        paymentManager.connect(owner).updatePlatformFee(excessiveFee)
      ).to.be.revertedWith("Fee cannot exceed 20%");
    });
    
    it("Should only allow owner to update fee", async function () {
      await expect(
        paymentManager.connect(creator).updatePlatformFee(1000)
      ).to.be.revertedWithCustomError(paymentManager, "OwnableUnauthorizedAccount");
    });
  });
});
import { ethers } from "hardhat";

async function main() {
  console.log("Starting deployment...");
  
  // Deploy PaymentManager
  console.log("Deploying PaymentManager...");
  const PaymentManager = await ethers.getContractFactory("PaymentManager");
  const paymentManager = await PaymentManager.deploy();
  await paymentManager.waitForDeployment();
  const paymentManagerAddress = await paymentManager.getAddress();
  console.log("PaymentManager deployed to:", paymentManagerAddress);
  
  // Mock EntryPoint address for testing
  // In production, this would be the actual ERC-4337 EntryPoint address
  const ENTRY_POINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
  
  // Deploy AccountFactory
  console.log("Deploying AccountFactory...");
  const AccountFactory = await ethers.getContractFactory("AccountFactory");
  const accountFactory = await AccountFactory.deploy(ENTRY_POINT_ADDRESS);
  await accountFactory.waitForDeployment();
  const accountFactoryAddress = await accountFactory.getAddress();
  console.log("AccountFactory deployed to:", accountFactoryAddress);
  
  // Deploy a sample SimpleAccount for testing
  const [deployer] = await ethers.getSigners();
  console.log("Creating sample account for:", deployer.address);
  
  const salt = ethers.id("SAMPLE_ACCOUNT_001");
  const tx = await accountFactory.createAccount(deployer.address, salt);
  await tx.wait();
  
  const accountAddress = await accountFactory.getAddress(deployer.address, salt);
  console.log("Sample account created at:", accountAddress);
  
  console.log("\nDeployment Summary:");
  console.log("===================");
  console.log("PaymentManager:", paymentManagerAddress);
  console.log("AccountFactory:", accountFactoryAddress);
  console.log("Sample Account:", accountAddress);
  console.log("EntryPoint:", ENTRY_POINT_ADDRESS);
  
  // Save deployment addresses
  const fs = require("fs");
  const deploymentInfo = {
    network: "hardhat",
    contracts: {
      PaymentManager: paymentManagerAddress,
      AccountFactory: accountFactoryAddress,
      SampleAccount: accountAddress,
      EntryPoint: ENTRY_POINT_ADDRESS
    },
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync(
    "./deployments.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("\nDeployment info saved to deployments.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
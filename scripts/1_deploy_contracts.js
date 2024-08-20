const hre = require("hardhat");
const { storeAddress, getFirstFileInBuildInfo } = require("./utils");
const fs = require("fs").promises;

async function main() {
  console.log("Compiling contracts...");
  await hre.run("compile");
  console.log("Contracts compiled successfully.");

  // console.log("Fetching fee data...");
  // const feeData = await hre.ethers.provider.getFeeData();
  // console.log("Fee data fetched ", feeData);

  console.log("Deploying MetaCoin contract...");
  const Contract = await hre.ethers.getContractFactory("MetaCoin");
  let MetaCoin;
  let deploymentSuccessful = false;
  let retryCount = 0;
  const DEPLOY_TIMEOUT = 300000;
  const MAX_RETRY = 5;

  // Sometimes deployment fails
  while (!deploymentSuccessful && retryCount < MAX_RETRY) {
    console.log(`Deployment attempt ${retryCount + 1} of ${MAX_RETRY}`);
    try {
      const baseContract = await Contract.deploy();
      const deployTx = await baseContract.deploymentTransaction();
      console.log(`Deploying contract with tx: ${deployTx.hash}`);
      const deployPromise = baseContract.waitForDeployment();

      const timeoutPromise = new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error("Deployment timed out after 5 minutes")), DEPLOY_TIMEOUT);
      });

      MetaCoin = await Promise.race([deployPromise, timeoutPromise]);
      deploymentSuccessful = true;
      console.log("MetaCoin contract deployed successfully.");
    } catch (error) {
      console.error("Deployment failed:", error);
      retryCount++;
    }
  }
  if (!deploymentSuccessful) {
    throw new Error(`Deployment failed or timed out after ${retryCount} attempts.`);
  }

  const address = await MetaCoin.target;
  console.log(`MetaCoin contract address: ${address}`);

  console.log("Fetching build info filename...");
  const buildInfoFilename = await getFirstFileInBuildInfo();
  console.log(`Build info filename: ${buildInfoFilename}`);

  await storeAddress("./MetaCoin.json", hre.network.config.chainId, address, buildInfoFilename);
  console.log(`MetaCoin deployed at ${address} and information stored successfully.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

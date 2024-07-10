const hre = require("hardhat");
const fs = require("fs").promises;
const { storeAddress, getFirstFileInBuildInfo } = require("./utils");

async function appendTimestamp(file) {
  try {
    // Current timestamp
    let timestamp = new Date().toISOString();

    // Content to append
    let content = `/* ${timestamp} */\n`;

    // Appending the content to the end of the file
    await fs.appendFile(file, content);

    console.log(`Timestamp added to the end of file: ${file}`);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

async function main() {
  await appendTimestamp("contracts/MetaCoinSalted.sol");

  console.log("Compiling contracts...");
  await hre.run("compile");
  console.log("Contracts compiled successfully.");

  console.log("Fetching fee data...");
  const feeData = await hre.ethers.provider.getFeeData();
  console.log("Fee data fetched ", feeData);

  console.log("Deploying MetaCoinSalted contract...");
  const Contract = await hre.ethers.getContractFactory("MetaCoinSalted");
  let MetaCoinSalted;
  let deploymentSuccessful = false;
  let retryCount = 0;
  const DEPLOY_TIMEOUT = 300000;
  const MAX_RETRY = 5;

  // Sometimes deployment fails
  while (!deploymentSuccessful && retryCount < MAX_RETRY) {
    try {
      const deployPromise = Contract.deploy({
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
        maxFeePerGas: feeData.maxFeePerGas,
        type: 2,
      }).then((instance) => instance.waitForDeployment());

      const timeoutPromise = new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error("Deployment timed out after 5 minutes")), DEPLOY_TIMEOUT);
      });

      MetaCoinSalted = await Promise.race([deployPromise, timeoutPromise]);
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

  const address = await MetaCoinSalted.target;
  console.log(`MetaCoinSalted contract address: ${address}`);

  console.log("Fetching build info filename...");
  const buildInfoFilename = await getFirstFileInBuildInfo();
  console.log(`Build info filename: ${buildInfoFilename}`);

  console.log("Storing MetaCoinSalted contract address and build info...");
  await storeAddress("./MetaCoinSalted.json", hre.network.config.chainId, address, buildInfoFilename);
  console.log(`MetaCoinSalted deployed at ${address} and information stored successfully.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

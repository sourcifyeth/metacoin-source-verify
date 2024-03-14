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

  // To make sure the unsalted one does not get picked up
  await fs.unlink("contracts/MetaCoin.sol");

  console.log("Compiling contracts...");
  await hre.run("compile");
  console.log("Contracts compiled successfully.");

  console.log("Fetching fee data...");
  const feeData = await hre.ethers.provider.getFeeData();
  console.log("Fee data fetched ", feeData);

  console.log("Deploying MetaCoinSalted contract...");
  const Contract = await hre.ethers.getContractFactory("MetaCoinSalted");
  const MetaCoinSalted = await Contract.deploy({
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
    maxFeePerGas: feeData.maxFeePerGas,
    type: 2,
  });
  await MetaCoinSalted.waitForDeployment();
  console.log("MetaCoinSalted contract deployed successfully.");

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

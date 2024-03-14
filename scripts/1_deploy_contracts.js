const hre = require("hardhat");
const { storeAddress, getFirstFileInBuildInfo } = require("./utils");
const fs = require("fs").promises;

async function main() {
  // To make sure the salted one does not get picked up
  await fs.unlink("contracts/MetaCoinSalted.sol");
  console.log("Compiling contracts...");
  await hre.run("compile");
  console.log("Contracts compiled successfully.");

  console.log("Fetching fee data...");
  const feeData = await hre.ethers.provider.getFeeData();
  console.log("Fee data fetched ", feeData);

  console.log("Deploying MetaCoin contract...");
  const Contract = await hre.ethers.getContractFactory("MetaCoin");
  const MetaCoin = await Contract.deploy({
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
    maxFeePerGas: feeData.maxFeePerGas,
    type: 2,
  });
  await MetaCoin.waitForDeployment();
  console.log("MetaCoin contract deployed successfully.");

  const address = await MetaCoin.target;
  console.log(`MetaCoinSalted contract address: ${address}`);

  console.log("Fetching build info filename...");
  const buildInfoFilename = await getFirstFileInBuildInfo();
  console.log(`Build info filename: ${buildInfoFilename}`);

  await storeAddress("./MetaCoin.json", hre.network.config.chainId, address, buildInfoFilename);
  console.log(`MetaCoinSalted deployed at ${address} and information stored successfully.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

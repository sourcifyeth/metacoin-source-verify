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
  await fs.unlink("contracts/MetaCoin.sol");
  await hre.run("compile");

  const feeData = await hre.ethers.provider.getFeeData();
  const Contract = await hre.ethers.getContractFactory("MetaCoinSalted");
  const MetaCoinSalted = await Contract.deploy({
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
    maxFeePerGas: feeData.maxFeePerGas,
    type: 2,
  });
  await MetaCoinSalted.waitForDeployment();

  const address = await MetaCoinSalted.target;
  const buildInfoFilename = await getFirstFileInBuildInfo();

  await storeAddress(
    "./MetaCoinSalted.json",
    hre.network.config.chainId,
    address,
    buildInfoFilename
  );
  console.log(`MetaCoinSalted deployed at ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

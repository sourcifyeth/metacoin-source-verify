const hre = require("hardhat");
const { storeAddress, getFirstFileInBuildInfo } = require("./utils");

async function main() {
  const feeData = await hre.ethers.provider.getFeeData();
  const Contract = await hre.ethers.getContractFactory("MetaCoin");
  const MetaCoin = await Contract.deploy({
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
    maxFeePerGas: feeData.maxFeePerGas,
    type: 2,
  });
  await MetaCoin.waitForDeployment();
  const address = await MetaCoin.target;
  const buildInfoFilename = await getFirstFileInBuildInfo();
  await storeAddress(
    "./MetaCoin.json",
    hre.network.config.chainId,
    address,
    buildInfoFilename
  );
  console.log(`MetaCoin deployed at ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

const privateKey = process.env.PRIVATE_KEY;

const goerliURL = `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`;
const sepoliaURL = `https://rpc.sepolia.org`;

const config = {
  networks: {
    goerli: {
      provider: () => new HDWalletProvider(privateKey, goerliURL),
      network_id: 5,
      chain_id: 5,
      maxFreePerGas: 500000000000, // 500 Gwei
      maxPriorityFeePerGas: 2000000000, // 2 Gwei
      gas: 500000, // Deployment normally takes 281135 gas
      skipDryRun: true,
    },
    sepolia: {
      provider: () => new HDWalletProvider(privateKey, sepoliaURL),
      network_id: 11155111,
      chain_id: 11155111,
      maxFreePerGas: 500000000000, // 500 Gwei
      maxPriorityFeePerGas: 2000000000, // 2 Gwei
      gas: 500000, // Deployment normally takes 281135 gas
      skipDryRun: true,
    },
  },
  compilers: {
    solc: {
      version: "0.6.2",
    },
  },
};

module.exports = config;

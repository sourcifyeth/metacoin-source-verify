require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

const privateKey = process.env.PRIVATE_KEY;
console.log("Parsing GAS_PRICE variable:", process.env.GAS_PRICE);
const gasPrice = parseInt(process.env.GAS_PRICE) || 50e9;
console.log("Gas price", gasPrice);

const ropstenURL = `https://eth-ropsten.alchemyapi.io/v2/${process.env.ALCHEMY_ID}`;

const rinkebyURL = `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_ID}`;

const goerliURL = `https://eth-goerli.alchemyapi.io/v2/${process.env.ALCHEMY_ID}`;

const config = {
  networks: {
    ropsten: {
      provider: () => new HDWalletProvider(privateKey, ropstenURL),
      network_id: 3,
      gas: 500000,
      gasPrice,
      skipDryRun: true,
    },
    rinkeby: {
      provider: () => new HDWalletProvider(privateKey, rinkebyURL),
      network_id: 4,
      gas: 500000,
      gasPrice,
      skipDryRun: true,
    },
    goerli: {
      provider: () => new HDWalletProvider(privateKey, goerliURL),
      network_id: 5,
      gas: 500000,
      gasPrice,
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

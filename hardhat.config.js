require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const privateKey = process.env.PRIVATE_KEY;

const goerliURL = `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_ID || process.env.ALCHEMY_API_KEY}`;
const sepoliaURL = `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_ID || process.env.ALCHEMY_API_KEY} `;
const holeskyURL = `https://holesky.infura.io/v3/${process.env.INFURA_API_KEY}`;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.6.2",
  networks: {
    sepolia: {
      chainId: 11155111,
      url: sepoliaURL,
      accounts: [privateKey],
    },
    goerli: {
      chainId: 5,
      url: goerliURL,
      accounts: [privateKey],
    },
    holesky: {
      chainId: 17000,
      url: holeskyURL,
      accounts: [privateKey],
    },
  },
};

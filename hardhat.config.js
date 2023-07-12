require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const privateKey = process.env.PRIVATE_KEY;

const goerliURL = `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`;
const sepoliaURL = `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`;

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
  },
};

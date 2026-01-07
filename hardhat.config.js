require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const privateKey = process.env.PRIVATE_KEY;

const sepoliaURL = `https://${process.env.QUICKNODE_SUBDOMAIN}.ethereum-sepolia.quiknode.pro/${process.env.QUICKNODE_API_KEY}`;
const hoodiURL = `https://${process.env.QUICKNODE_SUBDOMAIN}.ethereum-hoodi.quiknode.pro/${process.env.QUICKNODE_API_KEY}`;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.6.2",
  networks: {
    sepolia: {
      chainId: 11155111,
      url: sepoliaURL,
      accounts: [privateKey],
    },
    hoodi: {
      chainId: 560048,
      url: hoodiURL,
      accounts: [privateKey],
    },
  },
};

const MetaCoinSalted = artifacts.require("MetaCoinSalted");

module.exports = function(deployer) {
  deployer.deploy(MetaCoinSalted);
};

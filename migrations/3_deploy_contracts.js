var Coinflip = artifacts.require("./Coinflip.sol");

module.exports = function(deployer) {
  deployer.deploy(Coinflip);
};
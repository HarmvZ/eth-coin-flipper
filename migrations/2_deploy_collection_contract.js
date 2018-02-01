var CoinflipCollection = artifacts.require("./CoinflipCollection.sol");

module.exports = function(deployer) {
  deployer.deploy(CoinflipCollection);
};
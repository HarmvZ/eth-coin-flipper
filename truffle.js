var HDWalletProvider = require("truffle-hdwallet-provider");

var infura_apikey = "6hfKKe2tZUTHMCY5YTBT";
var mnemonic = "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!

  networks: {
    development: {
      host: "192.168.100.125",
      port: 9545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/"+infura_apikey),
      network_id: 3,
      gas: 4600000
    }
  }
};

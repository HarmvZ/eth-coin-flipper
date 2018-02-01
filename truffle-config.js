module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!

  networks: {
    development: {
      host: "192.168.100.125",
      port: 9545,
      network_id: "*" // Match any network id
    }
  }
};

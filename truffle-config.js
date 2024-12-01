module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545, // Ganache GUI default port
      network_id: "5777", // Ganache GUI default network id
      gas: 6721975, // Gas limit
      from: undefined, // Let Truffle use the first available account
    },
  },
  compilers: {
    solc: {
      version: "0.8.21",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
};

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: 5777,
      websockets: true,
      timeoutBlocks: 200,
      networkCheckTimeout: 100000,
      gas: 9000000,
      gasPrice: 20000000000,
    },
  },
  compilers: {
    solc: {
      version: "0.8.19",
      settings: {
        viaIR: true,
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
};

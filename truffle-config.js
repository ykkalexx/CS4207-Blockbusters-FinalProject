// truffle-config.js
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Localhost
      port: 7545, // Standard Ganache GUI port
      network_id: "5777", // Ganache GUI default network ID
    },
  },
  compilers: {
    solc: {
      version: "0.8.21",
    },
  },
};

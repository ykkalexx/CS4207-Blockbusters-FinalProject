const Web3 = require("web3");
const ganache = require("ganache");
const contract = require("@truffle/contract");
const StudentRegistryArtifact = require("../../build/contracts/StudentRegistry.json");

const provider = ganache.provider();
const web3 = new Web3(provider);

const StudentRegistry = contract(StudentRegistryArtifact);
StudentRegistry.setProvider(provider);

module.exports = {
  web3,
  StudentRegistry,
  provider,
};

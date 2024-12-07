const StudentRegistry = artifacts.require("StudentRegistry");
const InterviewShare = artifacts.require("InterviewShare");
const CVShare = artifacts.require("CVShare");
const PeerNetwork = artifacts.require("PeerNetwork");

module.exports = async function (deployer, network, accounts) {
  try {
    // Deploy StudentRegistry with explicit gas
    await deployer.deploy(StudentRegistry, { gas: 5000000 });
    const registry = await StudentRegistry.deployed();
    console.log("StudentRegistry deployed at:", registry.address);

    // Deploy remaining contracts if StudentRegistry succeeds
    if (registry.address) {
      await deployer.deploy(InterviewShare, registry.address, { gas: 5000000 });
      console.log("InterviewShare deployed at:", (await InterviewShare.deployed()).address);

      await deployer.deploy(CVShare, registry.address, { gas: 5000000 });
      console.log("CVShare deployed at:", (await CVShare.deployed()).address);

      // Deploy PeerNetwork contract
      await deployer.deploy(PeerNetwork, { gas: 5000000 });
      console.log("PeerNetwork deployed at:", (await PeerNetwork.deployed()).address);
    }
  } catch (error) {
    console.error("Deployment error:", error);
    throw error;
  }
};

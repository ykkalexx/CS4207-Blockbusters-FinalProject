const StudentRegistry = artifacts.require("StudentRegistry");
const InterviewShare = artifacts.require("InterviewShare");
const CVShare = artifacts.require("CVShare");
const Mentor = artifacts.require("MentorshipProgram");


module.exports = async function (deployer, network, accounts) {
  try {
    // Deploy StudentRegistry with explicit gas
    await deployer.deploy(StudentRegistry, { gas: 5000000 });
    const registry = await StudentRegistry.deployed();
    console.log("StudentRegistry deployed at:", registry.address);

    // Deploy remaining contracts if StudentRegistry succeeds
    if (registry.address) {
      await deployer.deploy(InterviewShare, registry.address, { gas: 5000000 });
      await deployer.deploy(CVShare, registry.address, { gas: 5000000 });
    }

      // Deploy Mentor contract, passing the StudentRegistry address
      if (registry.address) {
        await deployer.deploy(Mentor, registry.address, { gas: 5000000 });
        const mentor = await Mentor.deployed();
        console.log("Mentor contract deployed at:", mentor.address);
      }

  } catch (error) {
    console.error("Deployment error:", error);
    throw error;
  }

  
};

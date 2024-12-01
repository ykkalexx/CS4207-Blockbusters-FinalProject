const StudentRegistry = artifacts.require("StudentRegistry");
const InterviewShare = artifacts.require("InterviewShare");
const CVShare = artifacts.require("CVShare");

module.exports = async function (deployer) {
  await deployer.deploy(StudentRegistry);
  await deployer.deploy(InterviewShare, StudentRegistry.address);
  await deployer.deploy(CVShare, StudentRegistry.address);
};

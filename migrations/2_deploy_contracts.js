const StudentRegistry = artifacts.require("StudentRegistry");

module.exports = function (deployer) {
  deployer.deploy(StudentRegistry);
};

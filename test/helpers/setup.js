const Web3 = require("web3");
const ganache = require("ganache");
const contract = require("@truffle/contract");
const StudentRegistryArtifact = require("../../build/contracts/StudentRegistry.json");
const InterviewShareArtifact = require("../../build/contracts/InterviewShare.json");
const CVShareArtifact = require("../../build/contracts/CVShare.json");
const MentorshipProgramArtifact = require("../../build/contracts/MentorshipProgram.json");

const provider = ganache.provider();
const web3 = new Web3(provider);

const StudentRegistry = contract(StudentRegistryArtifact);
const InterviewShare = contract(InterviewShareArtifact);
const CVShare = contract(CVShareArtifact);
const MentorshipProgram = contract(MentorshipProgramArtifact);

StudentRegistry.setProvider(provider);
InterviewShare.setProvider(provider);
CVShare.setProvider(provider);
MentorshipProgram.setProvider(provider);

module.exports = {
  web3,
  StudentRegistry,
  InterviewShare,
  CVShare,
  MentorshipProgram,
  provider,
};

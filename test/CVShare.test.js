const StudentRegistry = artifacts.require("StudentRegistry");
const CVShare = artifacts.require("CVShare");
const { assert } = require("chai");

contract("CVShare Contract", (accounts) => {
  let studentRegistry;
  let cvShare;

  before(async () => {
    // Deploy StudentRegistry and CVShare contracts
    studentRegistry = await StudentRegistry.new({ from: accounts[0] });
    assert(studentRegistry.address, "StudentRegistry deployment failed");

    cvShare = await CVShare.new(studentRegistry.address, { from: accounts[0] });
    assert(cvShare.address, "CVShare deployment failed");
  });

  describe("CV Sharing", () => {
    it("should allow students to share CV", async () => {
      const ipfsHash = "QmTest123";

      // Share a CV
      await cvShare.shareCV(ipfsHash, true, { from: accounts[0] });

      // Retrieve the CV
      const cv = await cvShare.studentCVs(accounts[0]);

      // Assertions
      assert.equal(cv.ipfsHash, ipfsHash, "IPFS hash should match");
      assert.equal(cv.isPublic, true, "CV should be public");
      assert.equal(cv.owner, accounts[0], "Owner should match the sender");
    });

    it("should not allow empty IPFS hash", async () => {
      try {
        // Attempt to share an empty IPFS hash
        await cvShare.shareCV("", true, { from: accounts[0] });
        assert.fail("Expected error was not thrown");
      } catch (error) {
        assert.include(error.message, "Invalid IPFS hash", "Error message should mention 'Invalid IPFS hash'");
      }
    });

    it("should respect CV privacy settings", async () => {
      const ipfsHash = "QmPrivate123";

      // Share a private CV
      await cvShare.shareCV(ipfsHash, false, { from: accounts[0] });

      // Retrieve the CV
      const cv = await cvShare.studentCVs(accounts[0]);

      // Assertions
      assert.equal(cv.isPublic, false, "CV should be private");
    });
  });
});

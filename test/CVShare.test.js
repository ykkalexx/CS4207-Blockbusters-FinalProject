const { web3, StudentRegistry, CVShare } = require("./helpers/setup");

describe("CVShare Contract", () => {
  let studentRegistry;
  let cvShare;
  let accounts;

  beforeAll(async () => {
    accounts = await web3.eth.getAccounts();
  });

  beforeEach(async () => {
    studentRegistry = await StudentRegistry.new({ from: accounts[0] });
    cvShare = await CVShare.new(studentRegistry.address, { from: accounts[0] });

    await studentRegistry.registerStudent("Test Student", 12345, 3, {
      from: accounts[0],
    });
  });

  describe("CV Sharing", () => {
    it("should allow students to share CV", async () => {
      const ipfsHash = "QmTest123";
      await cvShare.shareCV(ipfsHash, true, { from: accounts[0] });

      const cv = await cvShare.studentCVs(accounts[0]);
      expect(cv.ipfsHash).toBe(ipfsHash);
      expect(cv.isPublic).toBe(true);
      expect(cv.owner).toBe(accounts[0]);
    });

    it("should not allow empty IPFS hash", async () => {
      try {
        await cvShare.shareCV("", true, { from: accounts[0] });
        fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).toContain("Invalid IPFS hash");
      }
    });

    it("should respect CV privacy settings", async () => {
      const ipfsHash = "QmPrivate123";
      await cvShare.shareCV(ipfsHash, false, { from: accounts[0] });

      const cv = await cvShare.studentCVs(accounts[0]);
      expect(cv.isPublic).toBe(false);
    });
  });
});

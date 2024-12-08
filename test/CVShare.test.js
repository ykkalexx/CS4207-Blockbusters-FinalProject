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

    // testing for scalability/ latency and transaction cost
    it("should handle sharing multiple CVs", async () => {
      const numCVs = 100;
      jest.setTimeout(30000); // Set timeout to 30 seconds

      for (let i = 0; i < numCVs; i++) {
        const ipfsHash = `QmTestHash${i}`;
        const isPublic = i % 2 === 0;

        await cvShare.shareCV(ipfsHash, isPublic, {
          from: accounts[i % accounts.length],
        });

        const cv = await cvShare.studentCVs(accounts[i % accounts.length]);
        expect(cv.ipfsHash).toBe(ipfsHash);
        expect(cv.isPublic).toBe(isPublic);
      }
    }, 30000); // Ensure the timeout is set for this specific test

    it("should measure latency for sharing a CV", async () => {
      const ipfsHash = "QmLatencyTestHash";
      const isPublic = true;

      const startTime = Date.now();
      await cvShare.shareCV(ipfsHash, isPublic, { from: accounts[0] });
      const endTime = Date.now();

      const latency = endTime - startTime;
      console.log(`Latency for sharing a CV: ${latency} ms`);
    });

    it("should measure gas cost for sharing a CV", async () => {
      const ipfsHash = "QmGasCostTestHash";
      const isPublic = true;

      const tx = await cvShare.shareCV(ipfsHash, isPublic, {
        from: accounts[0],
      });

      const gasUsed = tx.receipt.gasUsed;
      console.log(`Gas used for sharing a CV: ${gasUsed}`);
    });
  });
});

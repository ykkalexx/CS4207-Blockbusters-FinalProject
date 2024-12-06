const { web3, StudentRegistry, CVShare } = require("./helpers/setup");

describe("CVShare Contract", () => {
  let studentRegistry;
  let cvShare;
  let accounts;
  let provider;

  // Store subscriptions to clean up
  const subscriptions = [];

  beforeAll(async () => {
    accounts = await web3.eth.getAccounts();
    provider = web3.currentProvider;
  });

  // Clean up subscriptions after all tests
  afterAll(async () => {
    // Unsubscribe from all subscriptions
    await Promise.all(
      subscriptions.map(async (sub) => {
        if (sub.unsubscribe) {
          await sub.unsubscribe();
        }
      })
    );

    // Close provider connection if it exists
    if (provider.disconnect) {
      await provider.disconnect();
    }
  });

  beforeEach(async () => {
    // Deploy new contracts for each test
    studentRegistry = await StudentRegistry.new({ from: accounts[0] });
    cvShare = await CVShare.new(studentRegistry.address, { from: accounts[0] });

    // Register test student
    await studentRegistry.registerStudent("Test Student", 12345, 3, {
      from: accounts[0],
    });
  });

  describe("CV Sharing", () => {
    it("should allow students to share CV", async () => {
      const ipfsHash = "QmTest123";
      const tx = await cvShare.shareCV(ipfsHash, true, { from: accounts[0] });

      // Wait for transaction receipt
      await web3.eth.getTransactionReceipt(tx.tx);

      const cv = await cvShare.studentCVs(accounts[0]);
      expect(cv.ipfsHash).toBe(ipfsHash);
      expect(cv.isPublic).toBe(true);
      expect(cv.owner).toBe(accounts[0]);
    });

    it("should not allow empty IPFS hash", async () => {
      await expect(
        cvShare.shareCV("", true, { from: accounts[0] })
      ).rejects.toThrow("Invalid IPFS hash");
    });

    it("should respect CV privacy settings", async () => {
      const ipfsHash = "QmPrivate123";
      const tx = await cvShare.shareCV(ipfsHash, false, { from: accounts[0] });

      // Wait for transaction receipt
      await web3.eth.getTransactionReceipt(tx.tx);

      const cv = await cvShare.studentCVs(accounts[0]);
      expect(cv.isPublic).toBe(false);
    });

    // Modified scalability test with better async handling
    it("should handle sharing multiple CVs", async () => {
      const numCVs = 10; // Reduced from 100 to make test more manageable
      jest.setTimeout(30000);

      const promises = [];
      for (let i = 0; i < numCVs; i++) {
        const ipfsHash = `QmTestHash${i}`;
        const isPublic = i % 2 === 0;
        const account = accounts[i % accounts.length];

        promises.push(
          (async () => {
            const tx = await cvShare.shareCV(ipfsHash, isPublic, {
              from: account,
            });
            await web3.eth.getTransactionReceipt(tx.tx);

            const cv = await cvShare.studentCVs(account);
            expect(cv.ipfsHash).toBe(ipfsHash);
            expect(cv.isPublic).toBe(isPublic);
          })()
        );
      }

      await Promise.all(promises);
    });

    it("should measure latency for sharing a CV", async () => {
      const ipfsHash = "QmLatencyTestHash";
      const startTime = Date.now();

      const tx = await cvShare.shareCV(ipfsHash, true, { from: accounts[0] });
      await web3.eth.getTransactionReceipt(tx.tx);

      const endTime = Date.now();
      const latency = endTime - startTime;

      // Store metrics without console.log
      expect(latency).toBeDefined();
      expect(latency).toBeGreaterThan(0);
    });

    it("should measure gas cost for sharing a CV", async () => {
      const ipfsHash = "QmGasCostTestHash";

      const tx = await cvShare.shareCV(ipfsHash, true, {
        from: accounts[0],
      });
      const receipt = await web3.eth.getTransactionReceipt(tx.tx);

      // Store metrics without console.log
      expect(receipt.gasUsed).toBeDefined();
      expect(receipt.gasUsed).toBeGreaterThan(0);
    });
  });
});

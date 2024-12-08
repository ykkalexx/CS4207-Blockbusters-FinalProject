const { web3, PeerNetwork } = require("./helpers/setup");

describe("PeerNetwork Contract", () => {
  let peerNetwork;
  let accounts;

  beforeAll(async () => {
    accounts = await web3.eth.getAccounts();
  });

  beforeEach(async () => {
    peerNetwork = await PeerNetwork.new({ from: accounts[0] });
  });

  it("should add a company to the network", async () => {
    const companyName = "Tech Corp";

    await peerNetwork.addCompany(companyName, { from: accounts[0] });
    const companies = await peerNetwork.getCompanies();

    expect(companies.length).toBe(1);
    expect(companies[0]).toBe(companyName);
  });

  it("should add multiple companies to the network", async () => {
    const companyNames = ["Innovate Inc", "Code Masters"];

    for (const name of companyNames) {
      await peerNetwork.addCompany(name, { from: accounts[0] });
    }
    const companies = await peerNetwork.getCompanies();

    expect(companies.length).toBe(companyNames.length);
    expect(companies).toContain("Innovate Inc");
    expect(companies).toContain("Code Masters");
  });

  it("should link a CV to a company", async () => {
    const companyName = "Tech Corp";
    const cvHash = "QmTestHash";

    await peerNetwork.linkCVToCompany(companyName, cvHash, {
      from: accounts[0],
    });
    const linkedCVs = await peerNetwork.getCVsForCompany(companyName);

    expect(linkedCVs.length).toBe(1);
    expect(linkedCVs[0]).toBe(cvHash);
  });

  it("should link multiple CVs to a company", async () => {
    const companyName = "Tech Corp";
    const cvHashes = ["QmTestHash1", "QmTestHash2"];

    for (const hash of cvHashes) {
      await peerNetwork.linkCVToCompany(companyName, hash, {
        from: accounts[0],
      });
    }
    const linkedCVs = await peerNetwork.getCVsForCompany(companyName);

    expect(linkedCVs.length).toBe(2);
    expect(linkedCVs).toContain("QmTestHash1");
    expect(linkedCVs).toContain("QmTestHash2");
  });

  it("should return an empty list for a company with no CVs", async () => {
    const companyName = "Empty Company";
    const linkedCVs = await peerNetwork.getCVsForCompany(companyName);

    expect(linkedCVs.length).toBe(0);
  });

  // Testing for scalability, latency, and transaction cost
  it("should handle linking multiple CVs to multiple companies", async () => {
    const numCompanies = 10;
    const numCVsPerCompany = 10;
    jest.setTimeout(60000); // Set timeout to 60 seconds

    for (let i = 0; i < numCompanies; i++) {
      const companyName = `Company ${i}`;
      await peerNetwork.addCompany(companyName, { from: accounts[0] });

      for (let j = 0; j < numCVsPerCompany; j++) {
        const cvHash = `QmTestHash${i}_${j}`;
        await peerNetwork.linkCVToCompany(companyName, cvHash, {
          from: accounts[j % accounts.length],
        });

        const linkedCVs = await peerNetwork.getCVsForCompany(companyName);
        expect(linkedCVs).toContain(cvHash);
      }
    }
  }, 60000); // Ensure the timeout is set for this specific test

  it("should measure latency for adding a company", async () => {
    const companyName = "Latency Test Company";

    const startTime = Date.now();
    await peerNetwork.addCompany(companyName, { from: accounts[0] });
    const endTime = Date.now();

    const latency = endTime - startTime;
    console.log(`Latency for adding a company: ${latency} ms`);
  });

  it("should measure gas cost for adding a company", async () => {
    const companyName = "Gas Cost Test Company";

    const tx = await peerNetwork.addCompany(companyName, { from: accounts[0] });
    const gasUsed = tx.receipt.gasUsed;
    console.log(`Gas used for adding a company: ${gasUsed}`);
  });

  it("should measure latency for linking a CV to a company", async () => {
    const companyName = "Latency Test Company";
    const cvHash = "QmLatencyTestHash";

    await peerNetwork.addCompany(companyName, { from: accounts[0] });

    const startTime = Date.now();
    await peerNetwork.linkCVToCompany(companyName, cvHash, {
      from: accounts[0],
    });
    const endTime = Date.now();

    const latency = endTime - startTime;
    console.log(`Latency for linking a CV to a company: ${latency} ms`);
  });

  it("should measure gas cost for linking a CV to a company", async () => {
    const companyName = "Gas Cost Test Company";
    const cvHash = "QmGasCostTestHash";

    await peerNetwork.addCompany(companyName, { from: accounts[0] });

    const tx = await peerNetwork.linkCVToCompany(companyName, cvHash, {
      from: accounts[0],
    });
    const gasUsed = tx.receipt.gasUsed;
    console.log(`Gas used for linking a CV to a company: ${gasUsed}`);
  });
});

const PeerNetwork = artifacts.require("PeerNetwork");

contract("PeerNetwork", (accounts) => {
  let peerNetwork;

  before(async () => {
    peerNetwork = await PeerNetwork.deployed();
  });

  it("should add a company to the network", async () => {
    const companyName = "Tech Corp";

    await peerNetwork.addCompany(companyName, { from: accounts[0] });
    const companies = await peerNetwork.getCompanies();

    assert.equal(companies.length, 1, "Company count should be 1");
    assert.equal(companies[0], companyName, "Company name should match");
  });

  it("should add multiple companies to the network", async () => {
    const companyNames = ["Innovate Inc", "Code Masters"];

    for (const name of companyNames) {
      await peerNetwork.addCompany(name, { from: accounts[0] });
    }
    const companies = await peerNetwork.getCompanies();

    assert.equal(companies.length, 3, "Company count should be 3");
    assert.include(companies, "Innovate Inc", "Companies should include Innovate Inc");
    assert.include(companies, "Code Masters", "Companies should include Code Masters");
  });

  it("should link a CV to a company", async () => {
    const companyName = "Tech Corp";
    const cvHash = "QmTestHash";

    await peerNetwork.linkCVToCompany(companyName, cvHash, { from: accounts[0] });
    const linkedCVs = await peerNetwork.getCVsForCompany(companyName);

    assert.equal(linkedCVs.length, 1, "There should be 1 linked CV");
    assert.equal(linkedCVs[0], cvHash, "Linked CV hash should match");
  });

  it("should link multiple CVs to a company", async () => {
    const companyName = "Tech Corp";
    const cvHashes = ["QmTestHash1", "QmTestHash2"];

    for (const hash of cvHashes) {
      await peerNetwork.linkCVToCompany(companyName, hash, { from: accounts[0] });
    }
    const linkedCVs = await peerNetwork.getCVsForCompany(companyName);

    assert.equal(linkedCVs.length, 3, "There should be 3 linked CVs");
    assert.include(linkedCVs, "QmTestHash1", "Linked CVs should include QmTestHash1");
    assert.include(linkedCVs, "QmTestHash2", "Linked CVs should include QmTestHash2");
  });

  it("should return an empty list for a company with no CVs", async () => {
    const companyName = "Empty Company";
    const linkedCVs = await peerNetwork.getCVsForCompany(companyName);

    assert.equal(linkedCVs.length, 0, "There should be no linked CVs");
  });
});

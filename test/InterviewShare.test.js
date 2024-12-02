const { web3, StudentRegistry, InterviewShare } = require("./helpers/setup");

describe("InterviewShare Contract", () => {
  let studentRegistry;
  let interviewShare;
  let accounts;

  beforeAll(async () => {
    accounts = await web3.eth.getAccounts();
  });

  beforeEach(async () => {
    studentRegistry = await StudentRegistry.new({ from: accounts[0] });
    interviewShare = await InterviewShare.new(studentRegistry.address, {
      from: accounts[0],
    });

    // Register a 4th year student
    await studentRegistry.registerStudent("Senior Student", 12345, 4, {
      from: accounts[0],
    });
  });

  describe("Interview Sharing", () => {
    it("should allow 4th year students to share interview experience", async () => {
      const questions = ["What is X?", "How would you Y?"];

      await interviewShare.shareInterview(
        "Tech Corp",
        questions,
        "Software Engineer",
        { from: accounts[0] }
      );

      const interview = await interviewShare.companyInterviews("Tech Corp", 0);
      expect(interview.companyName).toBe("Tech Corp");
      expect(interview.position).toBe("Software Engineer");
      expect(interview.sharedBy).toBe(accounts[0]);
    });

    it("should not allow non-4th year students to share", async () => {
      await studentRegistry.registerStudent("Junior Student", 54321, 2, {
        from: accounts[1],
      });

      try {
        await interviewShare.shareInterview(
          "Tech Corp",
          ["Question 1"],
          "Developer",
          { from: accounts[1] }
        );
        fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).toContain("Only 4th year students");
      }
    });

    it("should require at least one question", async () => {
      try {
        await interviewShare.shareInterview("Tech Corp", [], "Developer", {
          from: accounts[0],
        });
        fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).toContain("Must provide at least one question");
      }
    });
  });
});

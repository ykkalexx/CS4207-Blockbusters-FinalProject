const StudentRegistry = artifacts.require("StudentRegistry");
const InterviewShare = artifacts.require("InterviewShare");
const { assert } = require("chai");

contract("InterviewShare Contract", (accounts) => {
  let studentRegistry;
  let interviewShare;

  before(async () => {
    // Deploy StudentRegistry and InterviewShare contracts
    studentRegistry = await StudentRegistry.new({ from: accounts[0] });
    interviewShare = await InterviewShare.new(studentRegistry.address, { from: accounts[0] });

    // Register a 4th year student
    await studentRegistry.registerStudent("Senior Student", 12345, 4, { from: accounts[0] });
  });

  describe("Interview Sharing", () => {
    it("should allow 4th year students to share interview experience", async () => {
      const questions = ["What is X?", "How would you Y?"];

      // Share interview experience
      await interviewShare.shareInterview("Tech Corp", questions, "Software Engineer", {
        from: accounts[0],
      });

      // Retrieve the interview
      const interview = await interviewShare.companyInterviews("Tech Corp", 0);

      // Assertions
      assert.equal(interview.companyName, "Tech Corp", "Company name should match");
      assert.equal(interview.position, "Software Engineer", "Position should match");
      assert.equal(interview.sharedBy, accounts[0], "SharedBy should match the sender");
    });

    it("should not allow non-4th year students to share", async () => {
      // Register a non-4th year student
      await studentRegistry.registerStudent("Junior Student", 54321, 2, { from: accounts[1] });

      try {
        // Attempt to share interview experience
        await interviewShare.shareInterview("Tech Corp", ["Question 1"], "Developer", {
          from: accounts[1],
        });
        assert.fail("Expected error was not thrown");
      } catch (error) {
        assert.include(error.message, "Only 4th year students", "Error should indicate year restriction");
      }
    });

    it("should require at least one question", async () => {
      try {
        // Attempt to share interview with no questions
        await interviewShare.shareInterview("Tech Corp", [], "Developer", { from: accounts[0] });
        assert.fail("Expected error was not thrown");
      } catch (error) {
        assert.include(error.message, "Must provide at least one question", "Error should indicate missing questions");
      }
    });
  });
});

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

    it("should handle sharing multiple interviews", async () => {
      const numInterviews = 50;
      jest.setTimeout(30000); // Set timeout to 30 seconds

      for (let i = 0; i < numInterviews; i++) {
        const questions = ["What is X?", "How would you Y?"];
        const companyName = `Tech Corp ${i}`;
        const position = `Software Engineer ${i}`;
        const account = accounts[i % accounts.length];

        // Register the student if not already registered
        let studentInfo;
        try {
          studentInfo = await studentRegistry.getStudentInfo(account);
        } catch (error) {
          studentInfo = null;
        }

        if (!studentInfo || !studentInfo.name) {
          await studentRegistry.registerStudent(`Student ${i}`, 10000 + i, 4, {
            from: account,
          });
        }

        await interviewShare.shareInterview(companyName, questions, position, {
          from: account,
        });

        const interview = await interviewShare.companyInterviews(
          companyName,
          0
        );
        expect(interview.companyName).toBe(companyName);
        expect(interview.position).toBe(position);
        expect(interview.sharedBy).toBe(account);
      }
    });

    it("should measure latency for sharing an interview", async () => {
      const questions = ["What is X?", "How would you Y?"];
      const companyName = "Tech Corp";
      const position = "Software Engineer";

      const startTime = Date.now();
      await interviewShare.shareInterview(companyName, questions, position, {
        from: accounts[0],
      });
      const endTime = Date.now();

      const latency = endTime - startTime;
      console.log(`Latency for sharing an interview: ${latency} ms`);
    });

    it("should measure gas cost for sharing an interview", async () => {
      const questions = ["What is X?", "How would you Y?"];
      const companyName = "Tech Corp";
      const position = "Software Engineer";

      const tx = await interviewShare.shareInterview(
        companyName,
        questions,
        position,
        {
          from: accounts[0],
        }
      );

      const gasUsed = tx.receipt.gasUsed;
      console.log(`Gas used for sharing an interview: ${gasUsed}`);
    });
  });
});

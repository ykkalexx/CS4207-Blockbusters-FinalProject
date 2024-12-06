const { web3, StudentRegistry, MentorshipProgram } = require("./helpers/setup");

describe("MentorshipProgram Contract", () => {
  let studentRegistry;
  let mentorshipProgram;
  let accounts;

  beforeAll(async () => {
    accounts = await web3.eth.getAccounts();
  });

  beforeEach(async () => {
    studentRegistry = await StudentRegistry.new({ from: accounts[0] });
    mentorshipProgram = await MentorshipProgram.new(studentRegistry.address, {
      from: accounts[0],
    });

    await studentRegistry.registerStudent("Mentor Student", 12345, 4, {
      from: accounts[0],
    });
    await studentRegistry.registerStudent("Mentee Student", 54321, 2, {
      from: accounts[1],
    });
  });

  describe("Mentor Registration", () => {
    it("should allow 4th year students to register as mentors", async () => {
      const skills = ["Solidity", "Blockchain"];
      const subject = "Smart Contracts";

      await mentorshipProgram.registerAsMentor(skills, subject, {
        from: accounts[0],
      });

      const mentor = await mentorshipProgram.getMentorDetails(accounts[0]);
      expect(mentor.mentorAddress).toBe(accounts[0]);
      expect(mentor.skills).toEqual(skills);
      expect(mentor.subject).toBe(subject);
    });

    it("should not allow non-4th year students to register as mentors", async () => {
      try {
        const skills = ["React", "Frontend"];
        const subject = "UI Development";
        await mentorshipProgram.registerAsMentor(skills, subject, {
          from: accounts[1],
        });
        fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).toContain("Only 4th year students");
      }
    });

    it("should not allow duplicate mentor registration", async () => {
      const skills = ["Solidity", "Blockchain"];
      const subject = "Smart Contracts";

      await mentorshipProgram.registerAsMentor(skills, subject, {
        from: accounts[0],
      });

      try {
        await mentorshipProgram.registerAsMentor(skills, subject, {
          from: accounts[0],
        });
        fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).toContain("already registered as a mentor");
      }
    });

    it("should handle registering multiple mentors", async () => {
      const numMentors = 50;
      jest.setTimeout(30000); // Set timeout to 30 seconds

      for (let i = 0; i < numMentors; i++) {
        const skills = ["Solidity", "Blockchain"];
        const subject = `Smart Contracts ${i}`;
        const account = accounts[i % accounts.length];

        // Check if the student is already registered
        let studentInfo;
        try {
          studentInfo = await studentRegistry.getStudentInfo(account);
        } catch (error) {
          studentInfo = null;
        }

        if (!studentInfo || !studentInfo.name) {
          await studentRegistry.registerStudent(`Mentor ${i}`, 10000 + i, 4, {
            from: account,
          });
        } else if (studentInfo.yearOfStudy.toNumber() !== 4) {
          // Ensure the student is a 4th year
          // AND ONLY 4TH YEAR NOTHING ELSE
          continue;
        }

        // check if student is already a mentor and if it is then continue
        let mentorInfo;
        try {
          mentorInfo = await mentorshipProgram.getMentorDetails(account);
        } catch (error) {
          mentorInfo = null;
        }

        // update this
        if (mentorInfo && mentorInfo.mentorAddress) {
          continue;
        }

        await mentorshipProgram.registerAsMentor(skills, subject, {
          from: account,
        });

        const mentor = await mentorshipProgram.getMentorDetails(account);
        expect(mentor.mentorAddress).toBe(account);
        expect(mentor.skills).toEqual(skills);
        expect(mentor.subject).toBe(subject);
      }
    });

    it("should measure latency for registering a mentor", async () => {
      const skills = ["Solidity", "Blockchain"];
      const subject = "Smart Contracts";

      const startTime = Date.now();
      await mentorshipProgram.registerAsMentor(skills, subject, {
        from: accounts[0],
      });
      const endTime = Date.now();

      const latency = endTime - startTime;
      console.log(`Latency for registering a mentor: ${latency} ms`);
    });

    it("should measure gas cost for registering a mentor", async () => {
      const skills = ["Solidity", "Blockchain"];
      const subject = "Smart Contracts";

      const tx = await mentorshipProgram.registerAsMentor(skills, subject, {
        from: accounts[0],
      });

      const gasUsed = tx.receipt.gasUsed;
      console.log(`Gas used for registering a mentor: ${gasUsed}`);
    });
  });

  describe("Adding Mentees", () => {
    beforeEach(async () => {
      const skills = ["Solidity", "Blockchain"];
      const subject = "Smart Contracts";
      await mentorshipProgram.registerAsMentor(skills, subject, {
        from: accounts[0],
      });
    });

    it("should allow mentors to add a mentee", async () => {
      await mentorshipProgram.addMentee(accounts[1], { from: accounts[0] });

      const mentor = await mentorshipProgram.getMentorDetails(accounts[0]);
      expect(mentor.mentees).toContain(accounts[1]); // mentees
    });

    it("should not allow adding the same mentee twice", async () => {
      await mentorshipProgram.addMentee(accounts[1], { from: accounts[0] });

      try {
        await mentorshipProgram.addMentee(accounts[1], { from: accounts[0] });
        fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).toContain(
          "Mentee is already assigned to a mentor"
        );
      }
    });

    it("should not allow adding a 4th year student as a mentee", async () => {
      try {
        await mentorshipProgram.addMentee(accounts[0], { from: accounts[0] });
        fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).toContain("Only students below 4th year");
      }
    });
  });
});

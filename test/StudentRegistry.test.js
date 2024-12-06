const { web3, StudentRegistry } = require("./helpers/setup");

describe("StudentRegistry Contract", () => {
  let studentRegistry;
  let accounts;

  beforeAll(async () => {
    accounts = await web3.eth.getAccounts();
  });

  beforeEach(async () => {
    studentRegistry = await StudentRegistry.new({ from: accounts[0] });
  });

  describe("Student Registration", () => {
    it("should register a new student", async () => {
      const studentName = "John Doe";
      const studentId = 12345;
      const yearOfStudy = 2;

      await studentRegistry.registerStudent(
        studentName,
        studentId,
        yearOfStudy,
        { from: accounts[0] }
      );

      const student = await studentRegistry.getStudentInfo(accounts[0]);
      expect(student[0]).toBe(studentName);
      expect(student[1].toNumber()).toBe(studentId);
      expect(student[2].toNumber()).toBe(yearOfStudy);
    });

    it("should not allow duplicate registration", async () => {
      await studentRegistry.registerStudent("John Doe", 12345, 2, {
        from: accounts[0],
      });

      try {
        await studentRegistry.registerStudent("John Doe", 12345, 2, {
          from: accounts[0],
        });
        fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).toContain("Student already registered");
      }
    });

    it("should not allow invalid year of study", async () => {
      try {
        await studentRegistry.registerStudent("John Doe", 12345, 5, {
          from: accounts[0],
        });
        fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).toContain("Invalid year of study");
      }
    });

    // testing for scalability/ latency and transaction cost
    it("should handle registering multiple students", async () => {
      const numStudents = 100;
      for (let i = 0; i < numStudents; i++) {
        const studentName = `Student ${i}`;
        const studentId = 10000 + i;
        const yearOfStudy = (i % 4) + 1;

        // Use a unique account for each student
        const account = accounts[i % accounts.length];

        // Check if the student is already registered
        const studentInfo = await studentRegistry
          .getStudentInfo(account)
          .catch(() => null);
        if (studentInfo && studentInfo.name) {
          continue; // Skip if the student is already registered
        }

        await studentRegistry.registerStudent(
          studentName,
          studentId,
          yearOfStudy,
          {
            from: account,
          }
        );

        const student = await studentRegistry.getStudentInfo(account);
        expect(student[0]).toBe(studentName);
        expect(student[1].toNumber()).toBe(studentId);
        expect(student[2].toNumber()).toBe(yearOfStudy);
      }
    });

    it("should measure latency for registering a student", async () => {
      const studentName = "Latency Test Student";
      const studentId = 99999;
      const yearOfStudy = 3;

      const startTime = Date.now();
      await studentRegistry.registerStudent(
        studentName,
        studentId,
        yearOfStudy,
        {
          from: accounts[0],
        }
      );
      const endTime = Date.now();

      const latency = endTime - startTime;
      console.log(`Latency for registering a student: ${latency} ms`);
    });

    it("should measure gas cost for registering a student", async () => {
      const studentName = "Gas Cost Test Student";
      const studentId = 88888;
      const yearOfStudy = 2;

      const tx = await studentRegistry.registerStudent(
        studentName,
        studentId,
        yearOfStudy,
        {
          from: accounts[0],
        }
      );

      const gasUsed = tx.receipt.gasUsed;
      console.log(`Gas used for registering a student: ${gasUsed}`);
    });
  });
});

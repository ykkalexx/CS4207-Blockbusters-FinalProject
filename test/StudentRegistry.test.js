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

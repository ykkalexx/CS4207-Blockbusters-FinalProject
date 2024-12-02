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
  });
});

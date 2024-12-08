const StudentRegistry = artifacts.require("StudentRegistry");
const { assert } = require("chai");

contract("StudentRegistry Contract", (accounts) => {
  let studentRegistry;

  before(async () => {
    // Deploy the StudentRegistry contract
    studentRegistry = await StudentRegistry.new({ from: accounts[0] });
    assert(studentRegistry.address, "StudentRegistry deployment failed");
  });

  describe("Student Registration", () => {
    it("should register a new student", async () => {
      const studentName = "John Doe";
      const studentId = 12345;
      const yearOfStudy = 2;

      // Register a student
      await studentRegistry.registerStudent(studentName, studentId, yearOfStudy, {
        from: accounts[1],
      });

      // Fetch student info
      const student = await studentRegistry.getStudentInfo(accounts[1]);

      // Assertions
      assert.equal(student.name, studentName, "Student name should match");
      assert.equal(student.studentId.toNumber(), studentId, "Student ID should match");
      assert.equal(student.yearOfStudy.toNumber(), yearOfStudy, "Year of study should match");
    });

    it("should not allow duplicate registration", async () => {
      try {
        // Attempt to register the same account again
        await studentRegistry.registerStudent("John Doe", 12345, 2, { from: accounts[1] });
        assert.fail("Expected error was not thrown");
      } catch (error) {
        // Check for expected error message
        assert.include(error.message, "Student already registered", "Error should indicate duplicate registration");
      }
    });

    it("should not allow invalid year of study", async () => {
      try {
        // Attempt to register a student with an invalid year of study
        await studentRegistry.registerStudent("Jane Doe", 12346, 5, { from: accounts[2] });
        assert.fail("Expected error was not thrown");
      } catch (error) {
        // Check for expected error message
        assert.include(
          error.message,
          "Invalid year of study",
          `Error should indicate invalid year of study, but got: ${error.message}`
        );
      }
    });

    it("should not allow empty names", async () => {
      try {
        // Attempt to register a student with an empty name
        await studentRegistry.registerStudent("", 12347, 2, { from: accounts[3] });
        assert.fail("Expected error was not thrown");
      } catch (error) {
        // Check for expected error message
        assert.include(
          error.message,
          "Name cannot be empty",
          `Error should indicate empty name, but got: ${error.message}`
        );
      }
    });

    it("should not allow invalid student IDs", async () => {
      try {
        // Attempt to register a student with an invalid student ID
        await studentRegistry.registerStudent("Jane Smith", 0, 2, { from: accounts[4] });
        assert.fail("Expected error was not thrown");
      } catch (error) {
        // Check for expected error message
        assert.include(
          error.message,
          "Invalid student ID",
          `Error should indicate invalid student ID, but got: ${error.message}`
        );
      }
    });
  });
});

const { web3, StudentRegistry, MentorshipProgram } = require("./helpers/setup");
//explaining thta this is test for mentor contract
describe("MentorshipProgram Contract", () => {
  //defining varaiabels needed for tests
  let studentRegistry;
  let mentorshipProgram;
  let accounts;
//runs once before we do any tests ensurinh accounts is populated 
  beforeAll(async () => {
    accounts = await web3.eth.getAccounts();
  });

  //runs before each test ensureing fresh contracts are created for each test
  beforeEach(async () => {
    // Deploy StudentRegistry and MentorshipProgram contracts
    studentRegistry = await StudentRegistry.new({ from: accounts[0] });
    mentorshipProgram = await MentorshipProgram.new(studentRegistry.address, { from: accounts[0] });

    // Register a 4th year student (mentor) and a 2nd year student (mentee)
    await studentRegistry.registerStudent("Mentor Student", 12345, 4, { from: accounts[0] });
    await studentRegistry.registerStudent("Mentee Student", 54321, 2, { from: accounts[1] });
  });

  //tests cases for mentor registartion
  describe("Mentor Registration", () => {
    //test if mentors can register
    it("should allow 4th year students to register as mentors", async () => {
      const skills = ["Solidity", "Blockchain"];
      const subject = "Smart Contracts";

      await mentorshipProgram.registerAsMentor(skills, subject, { from: accounts[0] });

      const mentor = await mentorshipProgram.getMentorDetails(accounts[0]);
      expect(mentor[0]).toBe(accounts[0]); 
      expect(mentor[1]).toEqual(skills);  
      expect(mentor[2]).toBe(subject);   
    });
    //tests that only 4th years can register as mentors
    it("should not allow non-4th year students to register as mentors", async () => {
      try {
        const skills = ["React", "Frontend"];
        const subject = "UI Development";
        await mentorshipProgram.registerAsMentor(skills, subject, { from: accounts[1] });
        fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).toContain("Only 4th year students");
      }
    });
    //tests that same mentor cant register more than once
    it("should not allow duplicate mentor registration", async () => {
      const skills = ["Solidity", "Blockchain"];
      const subject = "Smart Contracts";

      await mentorshipProgram.registerAsMentor(skills, subject, { from: accounts[0] });

      try {
        await mentorshipProgram.registerAsMentor(skills, subject, { from: accounts[0] });
        fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).toContain("already registered as a mentor");
      }
    });
  });

  //tests for adding mentees to mentor groups
  describe("Adding Mentees", () => {
    //before each test mentor is registred
    beforeEach(async () => {
      // Register mentor
      const skills = ["Solidity", "Blockchain"];
      const subject = "Smart Contracts";
      await mentorshipProgram.registerAsMentor(skills, subject, { from: accounts[0] });
    });
    //tests adding mentees to mentors groups
    it("should allow mentors to add a mentee", async () => {
      await mentorshipProgram.addMentee(accounts[1], { from: accounts[0] });

      const mentor = await mentorshipProgram.getMentorDetails(accounts[0]);
      expect(mentor[3]).toContain(accounts[1]); // mentees
    });
    //test chacking you can only add student once 
    it("should not allow adding the same mentee twice", async () => {
      await mentorshipProgram.addMentee(accounts[1], { from: accounts[0] });

      try {
        await mentorshipProgram.addMentee(accounts[1], { from: accounts[0] });
        fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).toContain("Mentee is already assigned to a mentor");
      }
    });
    //tests if only students who are not in 4th year can join
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

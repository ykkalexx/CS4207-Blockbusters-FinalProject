
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
//Importing IStudentRegistry to interact with student registry and call functions
import "./IStudentRegistry.sol";

//defining new mentorship program contract
//containing all data, functions and events for the functionailty
contract MentorshipProgram {
    //Declaring a IStudentRegistry contract
    IStudentRegistry public studentRegistry;
    //Defining structure of mentor data
    struct Mentor {
        //Stores address of mentor
        address mentorAddress;
        //stores array of mentors skills
        string[] skills;
        //stores the subject of their mentpr group
        string subject;
        //array of the addresses of all the students assigned to the mentor
        address[] mentees;
    }
    //mapping address to mentor
    mapping(address => Mentor) public mentors;
    //mapping student(or mentee) to the mentors address
    mapping(address => address) public menteeToMentor;

    //defining 2 events
    //Logs when mentor is registered
    event MentorRegistered(address indexed mentor, string subject);
    //Loggs when mentee is assigned a mentor
    event MenteeAdded(address indexed mentor, address indexed mentee);

    //ensures only 4th years can register as mentors
    modifier onlyFourthYear() {
        (, , uint256 year) = studentRegistry.getStudentInfo(msg.sender);
        require(year == 4, "Only 4th year students can register as mentors");
        _;
    }
    //ensures non registered mentors can't preform mentor functions
    modifier onlyRegisteredMentor() {
        require(
            mentors[msg.sender].mentorAddress != address(0),
            "You are not a registered mentor"
        );
        _;
    }

    //Initialising the contract with address of the student regiostry contract
    constructor(address _studentRegistry) {
        studentRegistry = IStudentRegistry(_studentRegistry);
    }

    //function that registers a student as a mentor checking if they are a 4th
    //year and they are not already a mentor
    function registerAsMentor(string[] memory _skills, string memory _subject)
        public
        onlyFourthYear
    {
        //checking if they are already a mentor
        require(
            mentors[msg.sender].mentorAddress == address(0),
            "You are already registered as a mentor"
        );
        //creates new mentor struct and stores values
        mentors[msg.sender] = Mentor({
            mentorAddress: msg.sender,
            skills: _skills,
            subject: _subject,
            mentees: new address[](0)
        });
        //logs a new mentor being registered
        emit MentorRegistered(msg.sender, _subject);
    }

    //function to add mentee to a mentors group, ensures only registered mentors can use this 
    function addMentee(address _mentee) public onlyRegisteredMentor {
        //ensureing student is not already assigned to this mentor
        require(
            menteeToMentor[_mentee] == address(0),
            "Mentee is already assigned to a mentor"
        );
        //gets the students info and ensures the mentee is below 4th year
        (, , uint256 menteeYear) = studentRegistry.getStudentInfo(_mentee);
        require(
            menteeYear < 4,
            "Only students below 4th year can be mentees"
        );
        //addes mentee to the mentors list and maps the mentees addres to mentor
        mentors[msg.sender].mentees.push(_mentee);
        menteeToMentor[_mentee] = msg.sender;
        //log new mentee being added to mentor group
        emit MenteeAdded(msg.sender, _mentee);
    }

    //Getter for the mentors data
    function getMentorDetails(address _mentor)
        public
        view
        returns (
            address mentorAddress,
            string[] memory skills,
            string memory subject,
            address[] memory mentees
        )
    {
        Mentor memory mentor = mentors[_mentor];
        return (mentor.mentorAddress, mentor.skills, mentor.subject, mentor.mentees);
    }
}


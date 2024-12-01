// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract StudentRegistry {
    struct Student {
        string name;
        uint256 studentId;
        uint256 yearOfStudy;
        bool isRegistered;
        address studentAddress;
    }
    
    mapping(address => Student) public students;
    mapping(uint256 => address) public studentIdToAddress;
    uint256 public totalStudents;
    address public owner;
    
    event StudentRegistered(address indexed studentAddress, uint256 studentId, string name);
    
    constructor() {
        owner = msg.sender;
        totalStudents = 0;
    }
    
    modifier notRegistered() {
        require(!students[msg.sender].isRegistered, "Student already registered");
        _;
    }
    
    modifier onlyRegistered() {
        require(students[msg.sender].isRegistered, "Student not registered");
        _;
    }

    // Add this function
    function getStudentInfo(address _studentAddress) 
        public 
        view 
        returns (
            string memory name,
            uint256 studentId,
            uint256 yearOfStudy
        ) 
    {
        Student memory student = students[_studentAddress];
        require(student.isRegistered, "Student not found");
        return (
            student.name,
            student.studentId,
            student.yearOfStudy
        );
    }
    
    function registerStudent(
        string memory _name,
        uint256 _studentId,
        uint256 _yearOfStudy
    ) public notRegistered {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(_yearOfStudy > 0 && _yearOfStudy <= 4, "Invalid year of study");
        require(_studentId > 0, "Invalid student ID");
        
        students[msg.sender] = Student({
            name: _name,
            studentId: _studentId,
            yearOfStudy: _yearOfStudy,
            isRegistered: true,
            studentAddress: msg.sender
        });
        
        studentIdToAddress[_studentId] = msg.sender;
        totalStudents++;
        
        emit StudentRegistered(msg.sender, _studentId, _name);
    }
}
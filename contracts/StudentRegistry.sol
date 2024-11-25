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
    
    event StudentRegistered(address indexed studentAddress, uint256 studentId, string name);
    
    modifier notRegistered() {
        require(!students[msg.sender].isRegistered, "Student already registered");
        _;
    }
    
    modifier onlyRegistered() {
        require(students[msg.sender].isRegistered, "Student not registered");
        _;
    }
    
    function registerStudent(
        string memory _name,
        uint256 _studentId,
        uint256 _yearOfStudy
    ) public notRegistered {
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
    
    function updateYearOfStudy(uint256 _newYear) public onlyRegistered {
        require(_newYear > 0 && _newYear <= 4, "Invalid year of study");
        students[msg.sender].yearOfStudy = _newYear;
    }
}
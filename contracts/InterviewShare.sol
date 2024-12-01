pragma solidity ^0.8.21;

import "./StudentRegistry.sol";

contract InterviewShare {
    StudentRegistry public studentRegistry;
    
    struct Interview {
        string companyName;
        string[] questions;
        string position;
        uint256 timestamp;
        address sharedBy;
    }
    
    mapping(string => Interview[]) public companyInterviews;
    
    event InterviewShared(address indexed sharer, string companyName);
    
    modifier onlyFourthYear() {
        (, , uint256 year) = studentRegistry.getStudentInfo(msg.sender);
        require(year == 4, "Only 4th year students can share interviews");
        _;
    }
    
    constructor(address _studentRegistry) {
        studentRegistry = StudentRegistry(_studentRegistry);
    }
    
    function shareInterview(
        string memory _companyName,
        string[] memory _questions,
        string memory _position
    ) public onlyFourthYear {
        require(_questions.length > 0, "Must provide at least one question");
        
        Interview memory interview = Interview({
            companyName: _companyName,
            questions: _questions,
            position: _position,
            timestamp: block.timestamp,
            sharedBy: msg.sender
        });
        
        companyInterviews[_companyName].push(interview);
        emit InterviewShared(msg.sender, _companyName);
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IStudentRegistry.sol";

contract InterviewShare {
    IStudentRegistry public studentRegistry;
    
    struct Interview {
        string companyName;
        string[] questions;
        string position;
        uint256 timestamp;
        address sharedBy;
    }
    
    mapping(string => Interview[]) public companyInterviews;
    string[] public companyList;
    
    event InterviewShared(address indexed sharer, string companyName);
    
    modifier onlyFourthYear() {
        (, , uint256 year) = studentRegistry.getStudentInfo(msg.sender);
        require(year == 4, "Only 4th year students can share interviews");
        _;
    }
    
    constructor(address _studentRegistry) {
        studentRegistry = IStudentRegistry(_studentRegistry);
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
        
        // Add company to list if not already present
        bool companyExists = false;
        for (uint256 i = 0; i < companyList.length; i++) {
            if (keccak256(bytes(companyList[i])) == keccak256(bytes(_companyName))) {
                companyExists = true;
                break;
            }
        }
        if (!companyExists) {
            companyList.push(_companyName);
        }
        
        emit InterviewShared(msg.sender, _companyName);
    }

    // Function to fetch every interview question for all companies
    function getAllInterviews() public view returns (Interview[] memory) {
        uint256 totalInterviews = 0;
        for (uint256 i = 0; i < companyList.length; i++) {
            totalInterviews += companyInterviews[companyList[i]].length;
        }

        Interview[] memory interviews = new Interview[](totalInterviews);
        uint256 index = 0;
        for (uint256 i = 0; i < companyList.length; i++) {
            for (uint256 j = 0; j < companyInterviews[companyList[i]].length; j++) {
                interviews[index] = companyInterviews[companyList[i]][j];
                index++;
            }
        }
        return interviews;
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IStudentRegistry {
    function getStudentInfo(address _studentAddress) 
        external 
        view 
        returns (
            string memory name,
            uint256 studentId,
            uint256 yearOfStudy
        );
}
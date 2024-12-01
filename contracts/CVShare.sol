// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "./StudentRegistry.sol";

contract CVShare {
    StudentRegistry public studentRegistry;
    
    struct CV {
        string ipfsHash;
        bool isPublic;
        uint256 timestamp;
        address owner;
    }
    
    mapping(address => CV) public studentCVs;
    
    event CVShared(address indexed student, string ipfsHash);
    
    constructor(address _studentRegistry) {
        studentRegistry = StudentRegistry(_studentRegistry);
    }
    
    function shareCV(string memory _ipfsHash, bool _isPublic) public {
        require(bytes(_ipfsHash).length > 0, "Invalid IPFS hash");
        
        studentCVs[msg.sender] = CV({
            ipfsHash: _ipfsHash,
            isPublic: _isPublic,
            timestamp: block.timestamp,
            owner: msg.sender
        });
        
        emit CVShared(msg.sender, _ipfsHash);
    }
}
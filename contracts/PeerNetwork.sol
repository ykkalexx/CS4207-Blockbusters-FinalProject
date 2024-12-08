// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./CVShare.sol";

contract PeerNetwork {
    // List of companies for co-op placements
    string[] private companies;
    mapping(string => string[]) private companyCVs; // Map company to list of CV IPFS hashes

    event CompanyAdded(string company);
    event CVLinkedToCompany(string company, string ipfsHash);

    // Add a company to the list
    function addCompany(string memory _company) public {
        companies.push(_company);
        emit CompanyAdded(_company);
    }

    // Retrieve the list of companies
    function getCompanies() public view returns (string[] memory) {
        return companies;
    }

    // Link a CV to a company
    function linkCVToCompany(string memory _company, string memory _ipfsHash) public {
        require(bytes(_company).length > 0, "Invalid company name");
        require(bytes(_ipfsHash).length > 0, "Invalid IPFS hash");
        companyCVs[_company].push(_ipfsHash);
        emit CVLinkedToCompany(_company, _ipfsHash);
    }

    // Retrieve CVs linked to a company
    function getCVsForCompany(string memory _company) public view returns (string[] memory) {
        return companyCVs[_company];
    }
}

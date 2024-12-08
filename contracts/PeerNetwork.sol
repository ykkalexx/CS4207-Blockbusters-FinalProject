// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PeerNetwork {
    // List of companies for co-op placements
    string[] private companies;

    event CompanyAdded(string company);

    // Add a company to the list
    function addCompany(string memory _company) public {
        companies.push(_company);
        emit CompanyAdded(_company);
    }

    // Retrieve the list of companies
    function getCompanies() public view returns (string[] memory) {
        return companies;
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

contract DPDPDocumentSharing {

    address public government;
    uint256 public userCount;
    uint256 public companyCount;
    uint256 public documentCount;
    uint256 public requestCount;

    constructor() {
        government = msg.sender;
    }

    struct User {
        uint256 id;
        string name;
        bool registered;
        bool consentGiven;
    }

    struct Company {
        uint256 id;
        string name;
        bool registered;
    }

    struct Document {
        uint256 id;
        uint256 userId;
        string ipfsHash;
        string docType;
        uint256 timestamp;
    }

    struct DocumentRequest {
        uint256 requestId;
        uint256 userId;
        uint256 documentId;
        uint256 companyId;
        bool approved;
        uint256 timestamp;
    }

    mapping(uint256 => User) public users;
    mapping(uint256 => Company) public companies;
    mapping(uint256 => Document[]) public userDocuments; // userId => documents
    mapping(uint256 => mapping(uint256 => mapping(uint256 => bool))) public documentAccess; 
    // userId => documentId => companyId => access
    mapping(uint256 => DocumentRequest) public requests; // requestId => request

    modifier onlyGovernment() {
        require(msg.sender == government, "Only government allowed");
        _;
    }

    modifier onlyCompany(uint256 _companyId) {
        require(companies[_companyId].registered, "Only registered company can call");
        _;
    }

    // === Registration ===
    function registerUser(string memory _name) external onlyGovernment returns(uint256) {
        userCount++;
        users[userCount] = User(userCount, _name, true, false);
        return userCount;
    }

    function registerCompany(string memory _name) external onlyGovernment returns(uint256) {
        companyCount++;
        companies[companyCount] = Company(companyCount, _name, true);
        return companyCount;
    }

    // === User Consent ===
    function giveConsent(uint256 _userId) external {
        require(users[_userId].registered, "User not registered");
        require(msg.sender == tx.origin, "Contracts cannot give consent");
        users[_userId].consentGiven = true;
    }

    // === Government Upload Document ===
    function uploadDocument(uint256 _userId, string memory _ipfsHash, string memory _docType) external onlyGovernment returns(uint256) {
        require(users[_userId].registered, "User not registered");
        documentCount++;
        userDocuments[_userId].push(Document(documentCount, _userId, _ipfsHash, _docType, block.timestamp));
        return documentCount;
    }

    // === Company Request Document ===
    function requestDocument(uint256 _userId, uint256 _documentId, uint256 _companyId) external onlyCompany(_companyId) returns(uint256) {
        require(users[_userId].registered, "User not registered");
        require(users[_userId].consentGiven, "User has not given consent");

        bool found = false;
        for(uint i = 0; i < userDocuments[_userId].length; i++) {
            if(userDocuments[_userId][i].id == _documentId) {
                found = true;
                break;
            }
        }
        require(found, "Document not found");

        requestCount++;
        requests[requestCount] = DocumentRequest(requestCount, _userId, _documentId, _companyId, false, block.timestamp);
        return requestCount; // returns the requestId
    }

    // === Government Approve Access ===
    function approveRequest(uint256 _requestId) external onlyGovernment {
        DocumentRequest storage req = requests[_requestId];
        require(req.requestId != 0, "Request not found");
        req.approved = true;
        documentAccess[req.userId][req.documentId][req.companyId] = true;
    }

    // === Government Revoke Access ===
    function revokeAccess(uint256 _userId, uint256 _documentId, uint256 _companyId) external onlyGovernment {
        documentAccess[_userId][_documentId][_companyId] = false;
    }

    // === Company Get Document ===
    function getDocument(uint256 _userId, uint256 _documentId, uint256 _companyId) external view returns (Document memory) {
        require(documentAccess[_userId][_documentId][_companyId], "Access not approved");
        for(uint i = 0; i < userDocuments[_userId].length; i++) {
            if(userDocuments[_userId][i].id == _documentId) {
                return userDocuments[_userId][i];
            }
        }
        revert("Document not found");
    }

    // === Get All Documents of User (Listing) ===
    function getUserDocuments(uint256 _userId) external view returns (Document[] memory) {
        return userDocuments[_userId];
    }

    // === Get Request Details ===
    function getRequest(uint256 _requestId) external view returns (DocumentRequest memory) {
        return requests[_requestId];
    }
}

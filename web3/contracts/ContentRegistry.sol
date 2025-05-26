// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ContentRegistry is Ownable {
    struct ContentMetadata {
        string ipfsHash;
        string title;
        string description;
        string contentType;
        uint256 size;
        uint256 version;
        uint256 createdAt;
        uint256 updatedAt;
        bool isActive;
    }
    
    struct ContentVersion {
        string ipfsHash;
        uint256 timestamp;
        string changeNote;
    }
    
    mapping(string => ContentMetadata) public contents;
    mapping(string => ContentVersion[]) public contentVersions;
    mapping(string => address) public contentCreators;
    mapping(address => string[]) public creatorContents;
    mapping(string => mapping(address => bool)) public contentModerators;
    
    uint256 public totalContents;
    
    event ContentRegistered(
        string indexed contentId,
        address indexed creator,
        string ipfsHash
    );
    
    event ContentUpdated(
        string indexed contentId,
        uint256 newVersion,
        string newIpfsHash
    );
    
    event ContentDeactivated(string indexed contentId);
    event ContentReactivated(string indexed contentId);
    event ModeratorAdded(string indexed contentId, address indexed moderator);
    event ModeratorRemoved(string indexed contentId, address indexed moderator);
    
    modifier onlyContentCreator(string memory contentId) {
        require(
            contentCreators[contentId] == msg.sender,
            "Only content creator"
        );
        _;
    }
    
    modifier onlyContentOwnerOrModerator(string memory contentId) {
        require(
            contentCreators[contentId] == msg.sender || 
            contentModerators[contentId][msg.sender] ||
            owner() == msg.sender,
            "Unauthorized"
        );
        _;
    }
    
    constructor() Ownable(msg.sender) {}
    
    function registerContent(
        string memory contentId,
        string memory ipfsHash,
        string memory title,
        string memory description,
        string memory contentType,
        uint256 size
    ) external {
        require(bytes(contentId).length > 0, "Invalid content ID");
        require(bytes(ipfsHash).length > 0, "Invalid IPFS hash");
        require(contentCreators[contentId] == address(0), "Content already exists");
        
        contents[contentId] = ContentMetadata({
            ipfsHash: ipfsHash,
            title: title,
            description: description,
            contentType: contentType,
            size: size,
            version: 1,
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            isActive: true
        });
        
        contentVersions[contentId].push(ContentVersion({
            ipfsHash: ipfsHash,
            timestamp: block.timestamp,
            changeNote: "Initial version"
        }));
        
        contentCreators[contentId] = msg.sender;
        creatorContents[msg.sender].push(contentId);
        totalContents++;
        
        emit ContentRegistered(contentId, msg.sender, ipfsHash);
    }
    
    function updateContent(
        string memory contentId,
        string memory newIpfsHash,
        string memory changeNote
    ) external onlyContentCreator(contentId) {
        require(bytes(newIpfsHash).length > 0, "Invalid IPFS hash");
        require(contents[contentId].isActive, "Content is deactivated");
        
        ContentMetadata storage content = contents[contentId];
        content.ipfsHash = newIpfsHash;
        content.version++;
        content.updatedAt = block.timestamp;
        
        contentVersions[contentId].push(ContentVersion({
            ipfsHash: newIpfsHash,
            timestamp: block.timestamp,
            changeNote: changeNote
        }));
        
        emit ContentUpdated(contentId, content.version, newIpfsHash);
    }
    
    function updateMetadata(
        string memory contentId,
        string memory title,
        string memory description
    ) external onlyContentCreator(contentId) {
        ContentMetadata storage content = contents[contentId];
        
        if (bytes(title).length > 0) {
            content.title = title;
        }
        
        if (bytes(description).length > 0) {
            content.description = description;
        }
        
        content.updatedAt = block.timestamp;
    }
    
    function deactivateContent(string memory contentId) 
        external 
        onlyContentOwnerOrModerator(contentId) 
    {
        require(contents[contentId].isActive, "Already deactivated");
        contents[contentId].isActive = false;
        emit ContentDeactivated(contentId);
    }
    
    function reactivateContent(string memory contentId) 
        external 
        onlyContentCreator(contentId) 
    {
        require(!contents[contentId].isActive, "Already active");
        contents[contentId].isActive = true;
        emit ContentReactivated(contentId);
    }
    
    function addModerator(string memory contentId, address moderator) 
        external 
        onlyContentCreator(contentId) 
    {
        require(moderator != address(0), "Invalid moderator");
        require(!contentModerators[contentId][moderator], "Already moderator");
        
        contentModerators[contentId][moderator] = true;
        emit ModeratorAdded(contentId, moderator);
    }
    
    function removeModerator(string memory contentId, address moderator) 
        external 
        onlyContentCreator(contentId) 
    {
        require(contentModerators[contentId][moderator], "Not a moderator");
        
        contentModerators[contentId][moderator] = false;
        emit ModeratorRemoved(contentId, moderator);
    }
    
    function getContent(string memory contentId) 
        external 
        view 
        returns (ContentMetadata memory) 
    {
        return contents[contentId];
    }
    
    function getContentVersions(string memory contentId) 
        external 
        view 
        returns (ContentVersion[] memory) 
    {
        return contentVersions[contentId];
    }
    
    function getCreatorContents(address creator) 
        external 
        view 
        returns (string[] memory) 
    {
        return creatorContents[creator];
    }
    
    function getLatestIpfsHash(string memory contentId) 
        external 
        view 
        returns (string memory) 
    {
        return contents[contentId].ipfsHash;
    }
    
    function isContentActive(string memory contentId) 
        external 
        view 
        returns (bool) 
    {
        return contents[contentId].isActive;
    }
    
    function getContentCreator(string memory contentId) 
        external 
        view 
        returns (address) 
    {
        return contentCreators[contentId];
    }
}
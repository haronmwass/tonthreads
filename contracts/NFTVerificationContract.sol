// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

contract TONThreadsNFTVerification is Ownable {
    struct NFTRequirement {
        address contractAddress;
        uint256 tokenId; // 0 for any token in collection
        uint256 minAmount; // For ERC1155
        bool isERC1155;
    }
    
    mapping(uint256 => NFTRequirement) public threadNFTRequirements;
    mapping(uint256 => mapping(address => bool)) public verifiedMembers;
    
    event NFTRequirementSet(uint256 indexed threadId, address indexed nftContract, uint256 tokenId, bool isERC1155);
    event MemberVerified(uint256 indexed threadId, address indexed user, address indexed nftContract);
    
    modifier validThread(uint256 threadId) {
        require(threadNFTRequirements[threadId].contractAddress != address(0), "Thread NFT requirement not set");
        _;
    }
    
    function setNFTRequirement(
        uint256 threadId,
        address nftContract,
        uint256 tokenId,
        uint256 minAmount,
        bool isERC1155
    ) external onlyOwner {
        threadNFTRequirements[threadId] = NFTRequirement({
            contractAddress: nftContract,
            tokenId: tokenId,
            minAmount: minAmount,
            isERC1155: isERC1155
        });
        
        emit NFTRequirementSet(threadId, nftContract, tokenId, isERC1155);
    }
    
    function verifyAndJoinThread(uint256 threadId) external validThread(threadId) {
        require(!verifiedMembers[threadId][msg.sender], "Already verified for this thread");
        
        NFTRequirement memory requirement = threadNFTRequirements[threadId];
        
        if (requirement.isERC1155) {
            IERC1155 nftContract = IERC1155(requirement.contractAddress);
            
            if (requirement.tokenId == 0) {
                // Check if user owns any tokens from the collection
                // Note: This is simplified - in practice, you'd need to implement
                // a more sophisticated check for ERC1155 collections
                require(
                    nftContract.balanceOf(msg.sender, 1) >= requirement.minAmount,
                    "Insufficient NFT balance"
                );
            } else {
                require(
                    nftContract.balanceOf(msg.sender, requirement.tokenId) >= requirement.minAmount,
                    "Insufficient NFT balance for specific token"
                );
            }
        } else {
            IERC721 nftContract = IERC721(requirement.contractAddress);
            
            if (requirement.tokenId == 0) {
                // Check if user owns any token from the collection
                require(nftContract.balanceOf(msg.sender) > 0, "No NFTs owned from required collection");
            } else {
                require(nftContract.ownerOf(requirement.tokenId) == msg.sender, "Not owner of required NFT");
            }
        }
        
        verifiedMembers[threadId][msg.sender] = true;
        emit MemberVerified(threadId, msg.sender, requirement.contractAddress);
    }
    
    function isVerifiedMember(uint256 threadId, address user) external view returns (bool) {
        return verifiedMembers[threadId][user];
    }
    
    function getThreadNFTRequirement(uint256 threadId) external view returns (NFTRequirement memory) {
        return threadNFTRequirements[threadId];
    }
    
    function checkNFTOwnership(address user, uint256 threadId) external view returns (bool) {
        NFTRequirement memory requirement = threadNFTRequirements[threadId];
        
        if (requirement.contractAddress == address(0)) {
            return false;
        }
        
        if (requirement.isERC1155) {
            IERC1155 nftContract = IERC1155(requirement.contractAddress);
            
            if (requirement.tokenId == 0) {
                return nftContract.balanceOf(user, 1) >= requirement.minAmount;
            } else {
                return nftContract.balanceOf(user, requirement.tokenId) >= requirement.minAmount;
            }
        } else {
            IERC721 nftContract = IERC721(requirement.contractAddress);
            
            if (requirement.tokenId == 0) {
                return nftContract.balanceOf(user) > 0;
            } else {
                return nftContract.ownerOf(requirement.tokenId) == user;
            }
        }
    }
}
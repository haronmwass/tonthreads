// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract TONThreadsPayment is Ownable, ReentrancyGuard, Pausable {
    struct Thread {
        uint256 id;
        string title;
        uint256 requiredPayment;
        address creator;
        bool isActive;
        uint256 memberCount;
    }
    
    struct Payment {
        uint256 threadId;
        address user;
        uint256 amount;
        uint256 timestamp;
        bool processed;
    }
    
    mapping(uint256 => Thread) public threads;
    mapping(uint256 => Payment) public payments;
    mapping(uint256 => mapping(address => bool)) public threadMembers;
    
    uint256 public nextThreadId;
    uint256 public nextPaymentId;
    uint256 public platformFee = 250; // 2.5% in basis points
    
    event ThreadCreated(uint256 indexed threadId, string title, uint256 requiredPayment, address creator);
    event PaymentProcessed(uint256 indexed paymentId, uint256 indexed threadId, address indexed user, uint256 amount);
    event MemberAdded(uint256 indexed threadId, address indexed user);
    event PlatformFeeUpdated(uint256 newFee);
    
    modifier threadExists(uint256 threadId) {
        require(threads[threadId].isActive, "Thread does not exist or is inactive");
        _;
    }
    
    modifier notMember(uint256 threadId) {
        require(!threadMembers[threadId][msg.sender], "User is already a member");
        _;
    }
    
    constructor() {
        nextThreadId = 1;
        nextPaymentId = 1;
    }
    
    function createThread(
        string memory title,
        uint256 requiredPayment
    ) external returns (uint256) {
        uint256 threadId = nextThreadId++;
        
        threads[threadId] = Thread({
            id: threadId,
            title: title,
            requiredPayment: requiredPayment,
            creator: msg.sender,
            isActive: true,
            memberCount: 0
        });
        
        emit ThreadCreated(threadId, title, requiredPayment, msg.sender);
        return threadId;
    }
    
    function joinThreadWithPayment(uint256 threadId) 
        external 
        payable 
        threadExists(threadId) 
        notMember(threadId) 
        nonReentrant 
        whenNotPaused 
    {
        Thread storage thread = threads[threadId];
        require(msg.value >= thread.requiredPayment, "Insufficient payment");
        
        // Calculate platform fee
        uint256 feeAmount = (msg.value * platformFee) / 10000;
        uint256 creatorAmount = msg.value - feeAmount;
        
        // Record payment
        uint256 paymentId = nextPaymentId++;
        payments[paymentId] = Payment({
            threadId: threadId,
            user: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp,
            processed: true
        });
        
        // Add user to thread
        threadMembers[threadId][msg.sender] = true;
        thread.memberCount++;
        
        // Transfer funds
        payable(thread.creator).transfer(creatorAmount);
        payable(owner()).transfer(feeAmount);
        
        emit PaymentProcessed(paymentId, threadId, msg.sender, msg.value);
        emit MemberAdded(threadId, msg.sender);
    }
    
    function isThreadMember(uint256 threadId, address user) external view returns (bool) {
        return threadMembers[threadId][user];
    }
    
    function getThread(uint256 threadId) external view returns (Thread memory) {
        return threads[threadId];
    }
    
    function getPayment(uint256 paymentId) external view returns (Payment memory) {
        return payments[paymentId];
    }
    
    function updatePlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee cannot exceed 10%");
        platformFee = newFee;
        emit PlatformFeeUpdated(newFee);
    }
    
    function deactivateThread(uint256 threadId) external {
        require(
            threads[threadId].creator == msg.sender || owner() == msg.sender,
            "Only thread creator or owner can deactivate"
        );
        threads[threadId].isActive = false;
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
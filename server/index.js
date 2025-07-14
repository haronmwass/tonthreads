const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const tonService = require('./tonService');
const telegramBot = require('./telegramBot');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas connection
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('✅ MongoDB Atlas connected successfully');
    } else {
      console.log('⚠️ MongoDB URI not provided, running in demo mode');
    }
  } catch (error) {
    console.error('❌ MongoDB Atlas connection error:', error);
    console.log('📝 Continuing in demo mode without database');
  }
};

// Thread Schema for MongoDB
const threadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  accessType: { type: String, enum: ['payment', 'nft'], required: true },
  tonAmount: { type: Number, default: 0 },
  nftCollection: { type: String, default: '' },
  telegramGroupId: { type: String, required: true },
  creatorWallet: { type: String, required: true },
  members: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  isPrivate: { type: Boolean, default: true },
  image: { type: String, required: true }
});

const Thread = mongoose.model('Thread', threadSchema);

// User Schema for MongoDB
const userSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true },
  joinedThreads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Thread' }],
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Demo data with realistic figures
const demoThreads = [
  {
    _id: '1',
    title: 'TON Developers Hub',
    description: 'A community for TON blockchain developers to share knowledge, discuss projects, and collaborate on innovative solutions.',
    category: 'Development',
    accessType: 'payment',
    tonAmount: 2.5,
    telegramGroupId: 'ton_dev_hub',
    creatorWallet: process.env.RECIPIENT_WALLET_ADDRESS || 'EQDemo1...',
    members: ['EQDemo1...', 'EQDemo2...'],
    memberCount: 47,
    isPrivate: true,
    image: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=600',
    createdAt: new Date('2024-01-15')
  },
  {
    _id: '2',
    title: 'NFT Artists Collective',
    description: 'Connect with digital artists, showcase your NFT creations, and discover the latest trends in the NFT space.',
    category: 'Art & Design',
    accessType: 'nft',
    nftCollection: 'EQNFTCollection...',
    telegramGroupId: 'nft_artists',
    creatorWallet: process.env.RECIPIENT_WALLET_ADDRESS || 'EQDemo3...',
    members: ['EQDemo3...', 'EQDemo4...'],
    memberCount: 23,
    isPrivate: true,
    image: 'https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=600',
    createdAt: new Date('2024-01-20')
  },
  {
    _id: '3',
    title: 'Crypto Trading Signals',
    description: 'Get exclusive trading signals, market analysis, and connect with experienced traders in the crypto space.',
    category: 'Finance',
    accessType: 'payment',
    tonAmount: 5.0,
    telegramGroupId: 'crypto_signals',
    creatorWallet: process.env.RECIPIENT_WALLET_ADDRESS || 'EQDemo5...',
    members: ['EQDemo5...'],
    memberCount: 156,
    isPrivate: true,
    image: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=600',
    createdAt: new Date('2024-01-25')
  },
  {
    _id: '4',
    title: 'Web3 Gaming Community',
    description: 'Discuss the latest Web3 games, share gaming experiences, and discover new blockchain-based gaming opportunities.',
    category: 'Gaming',
    accessType: 'payment',
    tonAmount: 1.5,
    telegramGroupId: 'web3_gaming',
    creatorWallet: process.env.RECIPIENT_WALLET_ADDRESS || 'EQDemo6...',
    members: ['EQDemo6...'],
    memberCount: 89,
    isPrivate: true,
    image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=600',
    createdAt: new Date('2024-02-01')
  },
  {
    _id: '5',
    title: 'Blockchain Startups',
    description: 'Network with blockchain entrepreneurs, share startup ideas, and find co-founders.',
    category: 'Business',
    accessType: 'payment',
    tonAmount: 3.0,
    telegramGroupId: 'blockchain_startups',
    creatorWallet: process.env.RECIPIENT_WALLET_ADDRESS || 'EQDemo7...',
    members: ['EQDemo7...'],
    memberCount: 67,
    isPrivate: true,
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600',
    createdAt: new Date('2024-02-10')
  }
];

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    mode: process.env.MONGODB_URI ? 'production' : 'demo',
    recipientWallet: tonService.getRecipientWallet()
  });
});

app.get('/api/status', (req, res) => {
  res.json({
    server: 'online',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'demo',
    telegram: telegramBot.getStatus(),
    ton: tonService.getStatus(),
    recipientWallet: tonService.getRecipientWallet()
  });
});

app.get('/api/threads', async (req, res) => {
  try {
    const { category } = req.query;
    
    if (mongoose.connection.readyState === 1) {
      // Database is connected - use MongoDB Atlas
      let query = {};
      if (category && category !== 'All') {
        query.category = category;
      }
      
      const threads = await Thread.find(query).select('-members');
      const threadsWithCount = threads.map(thread => ({
        ...thread.toObject(),
        memberCount: thread.members ? thread.members.length : 0,
        requiredPayment: thread.tonAmount,
        requiredNFT: thread.nftCollection
      }));
      
      res.json(threadsWithCount);
    } else {
      // Demo mode
      let filteredThreads = demoThreads;
      if (category && category !== 'All') {
        filteredThreads = demoThreads.filter(thread => thread.category === category);
      }
      
      // Transform demo data to match frontend expectations
      const transformedThreads = filteredThreads.map(thread => ({
        ...thread,
        id: thread._id,
        requiredPayment: thread.tonAmount,
        requiredNFT: thread.nftCollection
      }));
      
      res.json(transformedThreads);
    }
  } catch (error) {
    console.error('Error fetching threads:', error);
    res.status(500).json({ error: 'Failed to fetch threads' });
  }
});

app.get('/api/threads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (mongoose.connection.readyState === 1) {
      const thread = await Thread.findById(id);
      if (!thread) {
        return res.status(404).json({ error: 'Thread not found' });
      }
      res.json({
        ...thread.toObject(),
        memberCount: thread.members.length,
        requiredPayment: thread.tonAmount,
        requiredNFT: thread.nftCollection
      });
    } else {
      // Demo mode
      const thread = demoThreads.find(t => t._id === id);
      if (!thread) {
        return res.status(404).json({ error: 'Thread not found' });
      }
      res.json({
        ...thread,
        id: thread._id,
        requiredPayment: thread.tonAmount,
        requiredNFT: thread.nftCollection
      });
    }
  } catch (error) {
    console.error('Error fetching thread:', error);
    res.status(500).json({ error: 'Failed to fetch thread' });
  }
});

app.post('/api/threads/:id/join/payment', async (req, res) => {
  try {
    const { id } = req.params;
    const { userWallet, transactionHash, amount } = req.body;
    
    if (!userWallet || !transactionHash || !amount) {
      return res.status(400).json({ error: 'User wallet, transaction hash, and amount are required' });
    }
    
    const recipientWallet = tonService.getRecipientWallet();
    console.log(`💰 Payment processing: ${amount} TON from ${userWallet} to ${recipientWallet}`);
    console.log(`🔗 Transaction hash: ${transactionHash}`);
    
    // In demo mode or if database not connected
    if (mongoose.connection.readyState !== 1) {
      // Generate demo invite link
      const inviteLink = await telegramBot.createInviteLink(`demo_group_${id}`);
      
      // Send payment confirmation
      await telegramBot.sendPaymentConfirmation(
        process.env.DEMO_CHAT_ID || 'demo_chat',
        amount,
        transactionHash,
        `Thread ${id}`
      );
      
      return res.json({
        success: true,
        telegramInviteLink: inviteLink,
        message: `Payment of ${amount} TON verified successfully! (Demo mode)`,
        recipientWallet: recipientWallet
      });
    }
    
    // Production mode with MongoDB Atlas
    const thread = await Thread.findById(id);
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }
    
    // Verify transaction on TON blockchain
    const verification = await tonService.verifyTransaction(transactionHash, amount, recipientWallet);
    
    if (!verification.valid) {
      return res.status(400).json({ error: 'Transaction verification failed' });
    }
    
    // Add user to thread members
    if (!thread.members.includes(userWallet)) {
      thread.members.push(userWallet);
      await thread.save();
    }
    
    // Update user record
    let user = await User.findOne({ walletAddress: userWallet });
    if (!user) {
      user = new User({ walletAddress: userWallet, joinedThreads: [id] });
    } else if (!user.joinedThreads.includes(id)) {
      user.joinedThreads.push(id);
    }
    await user.save();
    
    // Create invite link and send notifications
    const inviteLink = await telegramBot.createInviteLink(thread.telegramGroupId);
    await telegramBot.sendPaymentConfirmation(
      process.env.DEMO_CHAT_ID || thread.telegramGroupId,
      amount,
      transactionHash,
      thread.title
    );
    
    res.json({
      success: true,
      telegramInviteLink: inviteLink,
      message: 'Payment verified successfully!'
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Failed to process payment' });
  }
});

app.post('/api/threads/:id/join/nft', async (req, res) => {
  try {
    const { id } = req.params;
    const { userWallet, nftAddress } = req.body;
    
    if (!userWallet || !nftAddress) {
      return res.status(400).json({ error: 'Wallet address and NFT address are required' });
    }
    
    console.log(`🖼️ NFT verification: ${nftAddress} for wallet ${userWallet}`);
    
    // In demo mode or if database not connected
    if (mongoose.connection.readyState !== 1) {
      // Generate demo invite link
      const inviteLink = await telegramBot.createInviteLink(`demo_group_${id}`);
      
      // Send NFT verification confirmation
      await telegramBot.sendNFTVerificationConfirmation(
        process.env.DEMO_CHAT_ID || 'demo_chat',
        nftAddress,
        `Thread ${id}`
      );
      
      return res.json({
        success: true,
        telegramInviteLink: inviteLink,
        message: 'NFT ownership verified successfully! (Demo mode)'
      });
    }
    
    // Production mode with MongoDB Atlas
    const thread = await Thread.findById(id);
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }
    
    // Verify NFT ownership on TON blockchain
    const verification = await tonService.verifyNFTOwnership(userWallet, nftAddress);
    
    if (!verification.valid) {
      return res.status(400).json({ error: 'NFT ownership verification failed' });
    }
    
    // Add user to thread members
    if (!thread.members.includes(userWallet)) {
      thread.members.push(userWallet);
      await thread.save();
    }
    
    // Update user record
    let user = await User.findOne({ walletAddress: userWallet });
    if (!user) {
      user = new User({ walletAddress: userWallet, joinedThreads: [id] });
    } else if (!user.joinedThreads.includes(id)) {
      user.joinedThreads.push(id);
    }
    await user.save();
    
    // Create invite link and send notifications
    const inviteLink = await telegramBot.createInviteLink(thread.telegramGroupId);
    await telegramBot.sendNFTVerificationConfirmation(
      process.env.DEMO_CHAT_ID || thread.telegramGroupId,
      nftAddress,
      thread.title
    );
    
    res.json({
      success: true,
      telegramInviteLink: inviteLink,
      message: 'NFT ownership verified successfully!'
    });
  } catch (error) {
    console.error('Error verifying NFT:', error);
    res.status(500).json({ error: 'Failed to verify NFT ownership' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { walletAddress } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }
    
    if (mongoose.connection.readyState !== 1) {
      // Demo mode
      return res.json({
        walletAddress,
        joinedThreads: [],
        createdAt: new Date().toISOString()
      });
    }
    
    let user = await User.findOne({ walletAddress });
    if (!user) {
      user = new User({ walletAddress });
      await user.save();
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error handling user:', error);
    res.status(500).json({ error: 'Failed to handle user request' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📊 Status check: http://localhost:${PORT}/api/status`);
    console.log(`💰 Recipient wallet: ${tonService.getRecipientWallet()}`);
    console.log(`🤖 Telegram bot: ${telegramBot.isReady() ? 'Ready' : 'Demo mode'}`);
    console.log(`📝 Mode: ${process.env.MONGODB_URI ? 'Production with MongoDB Atlas' : 'Demo'}`);
  });
};

startServer().catch(console.error);

module.exports = app;
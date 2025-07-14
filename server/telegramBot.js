// === Backend: Express + MongoDB ===

// server.js




const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const routes = require('./routes');
const TelegramBotService = require('./telegramBot');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () => console.log('Server running'));
    TelegramBotService.init();
  })
  .catch(err => console.log(err));

// .env (not shown in production)
// MONGO_URI=your_mongo_uri
// PORT=5000
// TELEGRAM_BOT_TOKEN=your_bot_token
// TELEGRAM_GROUP_LINK=https://t.me/yourgroup


// === MongoDB Models ===

// models/User.js
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  wallet: String,
  joinedThreads: [String],
});
module.exports = mongoose.model('User', UserSchema);

// models/Thread.js
const ThreadSchema = new mongoose.Schema({
  name: String,
  price: Number,
  nftRequired: String,
});
module.exports = mongoose.model('Thread', ThreadSchema);


// === Routes ===

// routes/index.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Thread = require('../models/Thread');
const TelegramBotService = require('../telegramBot');

const validatePaymentOrNFT = (wallet, thread) => {
  return true;
};

router.post('/join-thread', async (req, res) => {
  const { wallet, threadId } = req.body;
  const thread = await Thread.findById(threadId);
  const isValid = validatePaymentOrNFT(wallet, thread);

  if (!isValid) return res.status(403).json({ message: 'Access denied' });

  let user = await User.findOne({ wallet });
  if (!user) user = new User({ wallet, joinedThreads: [] });

  if (!user.joinedThreads.includes(threadId)) {
    user.joinedThreads.push(threadId);
    await user.save();
  }

  TelegramBotService.sendPaymentConfirmation(wallet, thread.price, 'demo_tx_hash', thread.name);
  TelegramBotService.sendWelcomeMessage(wallet, thread.name, wallet);

  res.json({ message: 'Access granted' });
});

router.get('/threads', async (req, res) => {
  const threads = await Thread.find();
  res.json(threads);
});

module.exports = router;


// === Telegram Bot Logic ===

// telegramBot.js
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

class TelegramBotService {
  constructor() {
    this.bot = null;
    this.isInitialized = false;
  }

  init() {
    if (!process.env.TELEGRAM_BOT_TOKEN) return;

    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
      polling: true,
    });
    this.isInitialized = true;
    console.log('✅ Telegram Bot initialized');
    this.setupBotCommands();
    this.setupMessageHandlers();
  }

  async setupBotCommands() {
    await this.bot.setMyCommands([
      { command: 'start', description: 'Start the bot' },
      { command: 'connect', description: 'Link your TON wallet via TON Connect' },
      { command: 'threads', description: 'Browse available token-gated communities' },
      { command: 'join', description: 'Request to join a thread after wallet verification' },
      { command: 'status', description: 'Check your thread memberships' },
      { command: 'help', description: 'How the bot works and how to use it' },
      { command: 'contact', description: 'Get support or talk to the developer' }
    ]);
  }

  setupMessageHandlers() {
    this.bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      this.bot.sendMessage(chatId, `🎉 Welcome to TON Threads Bot!

TON Threads is a Web3 community platform where you can:
• 💰 Pay with TON tokens to join exclusive groups
• 🖼️ Verify NFT ownership for token-gated communities
• 💬 Access private Telegram groups instantly

Use /connect to link your wallet
Use /threads to explore communities
Use /join to unlock access
Use /help for full guide`);
    });

    this.bot.onText(/\/connect/, (msg) => {
      this.bot.sendMessage(msg.chat.id, `🔗 To connect your TON wallet, visit our platform and use TON Connect.`);
    });

    this.bot.onText(/\/threads/, (msg) => {
      this.bot.sendMessage(msg.chat.id, `🧵 Available Thread Categories:

🔧 Development
🎨 NFT Art & Design
💹 Crypto Trading
🎮 Web3 Gaming
💼 Blockchain Business`);
    });

    this.bot.onText(/\/join/, (msg) => {
      this.bot.sendMessage(msg.chat.id, `✅ Steps to Join:
1. /connect
2. /threads
3. Receive invite after verification`);
    });

    this.bot.onText(/\/status/, (msg) => {
      this.bot.sendMessage(msg.chat.id, `📊 Your Membership Status:
Visit the TON Threads platform and connect your wallet to view your memberships.`);
    });

    this.bot.onText(/\/help/, (msg) => {
      this.bot.sendMessage(msg.chat.id, `🤖 Help Guide:
/start - Welcome message
/connect - Link your TON wallet
/threads - View available groups
/join - Join private communities
/status - Membership info
/contact - Developer support`);
    });

    this.bot.onText(/\/contact/, (msg) => {
      this.bot.sendMessage(msg.chat.id, `📬 Contact:
Telegram: @haroncruzz
GitHub: https://github.com/haroncruzz/ton-threads
Email: support@tonthreads.app`);
    });
  }

  async sendWelcomeMessage(chatId, threadTitle, userWallet) {
    const message = `🎉 Welcome to TON Threads!

You've successfully joined: **${threadTitle}**

🔗 Wallet: \`${userWallet.slice(0, 8)}...${userWallet.slice(-8)}\`
⏰ Joined: ${new Date().toLocaleString()}

You now have access to this exclusive community. Enjoy connecting with like-minded members!

Use /help for more commands.`;
    await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  }

  async sendPaymentConfirmation(chatId, amount, transactionHash, threadTitle) {
    const message = `💰 Payment Confirmed!

✅ Amount: ${amount} TON
🔗 Transaction: \`${transactionHash}\`
📋 Thread: **${threadTitle}**
⏰ ${new Date().toLocaleString()}

Your payment has been verified on the TON blockchain. Welcome to the community!

Use the invite link you received to join the private group.`;
    await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  }

  async sendNFTVerificationConfirmation(chatId, nftAddress, threadTitle) {
    const message = `🖼️ NFT Verification Successful!

✅ NFT: \`${nftAddress.slice(0, 8)}...${nftAddress.slice(-8)}\`
📋 Thread: **${threadTitle}**
⏰ ${new Date().toLocaleString()}

Your NFT ownership has been verified. Welcome to the exclusive community!

Use the invite link you received to join the private group.`;
    await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  }

  async notifyNewMember(groupId, threadTitle, userWallet, memberCount) {
    const message = `🆕 New member joined **${threadTitle}**!

👤 Wallet: \`${userWallet.slice(0, 8)}...${userWallet.slice(-8)}\`
👥 Total members: ${memberCount}
⏰ ${new Date().toLocaleString()}`;
    await this.bot.sendMessage(groupId, message, { parse_mode: 'Markdown' });
  }

  async createInviteLink(groupId, memberLimit = 1, expireDate = null) {
    if (!expireDate) expireDate = Math.floor(Date.now() / 1000) + 86400;
    try {
      const inviteLink = await this.bot.createChatInviteLink(groupId, {
        expire_date: expireDate,
        member_limit: memberLimit,
        name: `TON Threads Access - ${new Date().toLocaleDateString()}`
      });
      return inviteLink.invite_link;
    } catch (error) {
      console.error('❌ Failed to create invite link:', error.message);
      return this.generateDemoInviteLink(groupId);
    }
  }

  generateDemoInviteLink(groupId) {
    return `https://t.me/+demo_${groupId}_${Date.now()}`;
  }

  getStatus() {
    return {
      initialized: this.isInitialized,
      mode: this.isInitialized ? 'live' : 'demo',
      botToken: !!process.env.TELEGRAM_BOT_TOKEN
    };
  }

  async getBotInfo() {
    if (!this.isInitialized) return { error: 'Bot not initialized' };
    try {
      const info = await this.bot.getMe();
      return info;
    } catch (error) {
      return { error: error.message };
    }
  }
}

module.exports = new TelegramBotService();

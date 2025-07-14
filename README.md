# TON Threads - Web3 Community Platform

TON Threads is a revolutionary Web3 application that enables users to create and join exclusive micro-communities (Threads) using TON blockchain technology. Users can gain access to private Telegram groups by either paying TON tokens or verifying NFT/SBT ownership.

## 🚀 Features

### Core Functionality
- **TON Connect Integration**: Seamless wallet connection using TON Connect SDK
- **Micro-Communities**: Browse and join exclusive Threads across various categories
- **Dual Access Methods**: 
  - Pay with TON tokens for instant access
  - Verify NFT/SBT ownership for token-gated communities
- **Telegram Integration**: Automatic private group access via Telegram bot
- **Smart Contract Verification**: Secure on-chain verification of payments and NFT ownership

### User Experience
- **Handcrafted UI**: Beautiful, hand-drawn aesthetic with organic curves and playful elements
- **Responsive Design**: Optimized for all devices from mobile to desktop
- **Smooth Animations**: Micro-interactions and transitions for enhanced user experience
- **Category Filtering**: Easy discovery of relevant communities
- **Search Functionality**: Find specific threads quickly

### Technical Features
- **Full-Stack Architecture**: React frontend with Node.js/Express backend
- **MongoDB Integration**: Persistent data storage for threads and user information
- **Smart Contracts**: Solidity contracts for payment processing and NFT verification
- **RESTful API**: Clean API design for frontend-backend communication
- **Security**: Row-level security and input validation

## 🏗Architecture

### Frontend (React + TypeScript)
- **React Router**: Client-side routing for SPA navigation
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Framer Motion**: Animation library for smooth transitions
- **TON Connect**: Official TON wallet integration
- **Lucide React**: Beautiful, customizable icons

### Backend (Node.js + Express)
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for data persistence
- **Mongoose**: ODM for MongoDB
- **CORS**: Cross-origin resource sharing
- **Telegram Bot API**: Integration with Telegram for group management

### Blockchain Integration
- **TON Client**: Official TON blockchain client
- **Smart Contracts**: Solidity contracts for payment and NFT verification
- **Transaction Verification**: On-chain verification of payments
- **NFT Ownership**: Verification of NFT/SBT ownership

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- TON Wallet (for testing)
- Telegram Bot Token (for group management)

### Clone the Repository
```bash
git clone https://github.com/haronmwass/tonthreads.git
cd tonthreads
```

### Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### Environment Configuration
Create a `.env` file in the server directory:
```env
MONGODB_URI=mongodb://localhost:27017/ton-threads
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
DEMO_CHAT_ID=123456789
TON_NETWORK_ENDPOINT=https://main.ton.dev
PORT=3001
NODE_ENV=development
JWT_SECRET=your_jwt_secret
```

### Setting up Telegram Bot (Optional for Demo)
1. Create a new bot by messaging [@BotFather](https://t.me/botfather) on Telegram
2. Use `/newbot` command and follow the instructions
3. Copy the bot token and add it to your `.env` file
4. Add the bot as admin to your Telegram groups/channels
5. Get your group/channel ID and add it to DEMO_CHAT_ID in .env
6. For demo purposes, you can leave the token empty - the app will work in demo mode

### Start the Application
```bash
# Start both frontend and backend
npm run dev:full

# Or start them separately
npm run dev      # Frontend
npm run server   # Backend
```

## 📱 Usage

### For Users

1. **Connect Wallet**: Click "Connect Wallet" and use TON Connect to link your TON wallet
2. **Browse Threads**: Explore available micro-communities across different categories
3. **Join Threads**: Choose your preferred method:
   - Pay the required TON amount
   - Verify NFT/SBT ownership
4. **Access Telegram**: Receive invite link to join the private Telegram group
5. **Engage**: Participate in exclusive community discussions

### For Community Creators

1. **Create Thread**: Set up your micro-community with:
   - Title and description
   - Category selection
   - Access requirements (TON payment or NFT ownership)
   - Telegram group integration
2. **Manage Members**: Monitor member growth and engagement
3. **Moderate**: Use Telegram's native moderation tools

## 🔧 API Endpoints

### Threads
- `GET /api/threads` - Get all threads with optional filtering
- `GET /api/threads/:id` - Get specific thread details
- `POST /api/threads` - Create new thread
- `POST /api/threads/:id/join/payment` - Join thread with payment
- `POST /api/threads/:id/join/nft` - Join thread with NFT verification

### Users
- `POST /api/users` - Get or create user profile
- `GET /api/users/:wallet` - Get user profile and joined threads

### Health Check
- `GET /api/health` - Service health status

## 🔐 Smart Contracts

### Payment Contract
- **PaymentContract.sol**: Handles TON token payments for thread access
- Features:
  - Secure payment processing
  - Platform fee collection
  - Member verification
  - Emergency functions

### NFT Verification Contract
- **NFTVerificationContract.sol**: Verifies NFT/SBT ownership
- Features:
  - ERC721 and ERC1155 support
  - Collection-wide or specific token verification
  - Batch verification capabilities

## 🧪 Testing

### Running Tests
```bash
# Frontend tests
npm test

# Backend tests
cd server
npm test
```

### Test Coverage
- Unit tests for core components
- Integration tests for API endpoints
- Smart contract tests using Hardhat
- End-to-end tests for user flows

## 🚀 Deployment

### Frontend (Netlify/Vercel)
```bash
npm run build
# Deploy the dist folder
```

### Backend (Railway/Heroku)
```bash
cd server
npm start
# Configure environment variables
```

### Smart Contracts
```bash
# Deploy to TON network
npx hardhat deploy --network ton-mainnet
```

##  Security Considerations

- **Input Validation**: All user inputs are sanitized and validated
- **Rate Limiting**: API endpoints are rate-limited to prevent abuse
- **Transaction Verification**: On-chain verification of all payments
- **Access Control**: Role-based access control for admin functions
- **Data Encryption**: Sensitive data is encrypted at rest and in transit

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write tests for new features
- Update documentation as needed

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: [https://docs.ton-threads.com](https://docs.ton-threads.com)
- **Discord**: [https://discord.gg/ton-threads](https://discord.gg/ton-threads)
- **Telegram**: [https://t.me/ton_threads_support](https://t.me/ton_threads_support)
- **Email**: support@ton-threads.com

## 🎯 Roadmap

### Phase 1 
- ✅ Basic thread creation and joining
- ✅ TON Connect integration
- ✅ Telegram bot integration
- ✅ NFT verification

### Phase 2 
- 🔄 Advanced moderation tools
- 🔄 Thread analytics dashboard
- 🔄 Mobile app development
- 🔄 Multi-language support

### Phase 3
- 📋 DAO governance features
- 📋 Cross-chain compatibility
- 📋 Advanced NFT utilities
- 📋 Enterprise features

## Use Cases

### For Developers
- Exclusive coding bootcamps
- Tech talk communities
- Open source project coordination
- Hackathon organization

### For Artists
- NFT holder communities
- Art collaboration spaces
- Exhibition coordination
- Collector networks

### For Traders
- Premium signal groups
- Market analysis communities
- DeFi strategy sharing
- Portfolio management

### For Gamers
- Guild coordination
- Tournament organization
- Game-specific communities
- NFT gaming ecosystems



Built with ❤️ by the TON Threads team. Powered by TON blockchain technology.

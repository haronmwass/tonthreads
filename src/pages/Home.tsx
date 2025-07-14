import React, { useState, useEffect } from 'react';
import { Thread } from '../types';
import ThreadCard from '../components/ThreadCard';
import JoinThreadModal from '../components/JoinThreadModal';
import Toast from '../components/Toast';
import { Search, Filter, Sparkles, Users, Zap, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTonConnect } from '../hooks/useTonConnect';

const Home: React.FC = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [filteredThreads, setFilteredThreads] = useState<Thread[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [joinedThreads, setJoinedThreads] = useState<string[]>([]);
  const [toast, setToast] = useState<{
    type: 'success' | 'error' | 'warning';
    message: string;
    isVisible: boolean;
  }>({
    type: 'success',
    message: '',
    isVisible: false
  });
  
  const { sendTransaction, createPaymentTransaction, address } = useTonConnect();
  const [recipientWallet, setRecipientWallet] = useState<string>('');

  // Fetch recipient wallet address
  useEffect(() => {
    const fetchRecipientWallet = async () => {
      try {
        const response = await fetch('/api/status');
        const data = await response.json();
        setRecipientWallet(data.recipientWallet || 'EQDemo_Your_Wallet_Address_Here');
      } catch (error) {
        console.error('Failed to fetch recipient wallet:', error);
        setRecipientWallet('EQDemo_Your_Wallet_Address_Here');
      }
    };
    fetchRecipientWallet();
  }, []);

  // Realistic mock data
  useEffect(() => {
    const mockThreads: Thread[] = [
      {
        id: '1',
        title: 'TON Developers Hub',
        description: 'A community for TON blockchain developers to share knowledge, discuss projects, and collaborate on innovative solutions.',
        category: 'Development',
        memberCount: 47,
        requiredPayment: 2.5,
        telegramGroupId: 'ton_dev_hub',
        createdAt: new Date('2024-01-15'),
        isPrivate: true,
        image: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        id: '2',
        title: 'NFT Artists Collective',
        description: 'Connect with digital artists, showcase your NFT creations, and discover the latest trends in the NFT space.',
        category: 'Art & Design',
        memberCount: 23,
        requiredNFT: 'EQD...abc123',
        telegramGroupId: 'nft_artists',
        createdAt: new Date('2024-01-20'),
        isPrivate: true,
        image: 'https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        id: '3',
        title: 'Crypto Trading Signals',
        description: 'Get exclusive trading signals, market analysis, and connect with experienced traders in the crypto space.',
        category: 'Finance',
        memberCount: 156,
        requiredPayment: 5.0,
        telegramGroupId: 'crypto_signals',
        createdAt: new Date('2024-01-25'),
        isPrivate: true,
        image: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        id: '4',
        title: 'Web3 Gaming Community',
        description: 'Discuss the latest Web3 games, share gaming experiences, and discover new blockchain-based gaming opportunities.',
        category: 'Gaming',
        memberCount: 89,
        requiredPayment: 1.5,
        telegramGroupId: 'web3_gaming',
        createdAt: new Date('2024-02-01'),
        isPrivate: true,
        image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        id: '5',
        title: 'Crypto Art Creators',
        description: 'A community for digital artists creating NFTs and crypto art. Share techniques and collaborate.',
        category: 'Art & Design',
        memberCount: 34,
        requiredNFT: 'EQD...def456',
        telegramGroupId: 'crypto_art_creators',
        createdAt: new Date('2024-02-05'),
        isPrivate: true,
        image: 'https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        id: '6',
        title: 'Blockchain Startups',
        description: 'Network with blockchain entrepreneurs, share startup ideas, and find co-founders.',
        category: 'Business',
        memberCount: 67,
        requiredPayment: 3.0,
        telegramGroupId: 'blockchain_startups',
        createdAt: new Date('2024-02-10'),
        isPrivate: true,
        image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600'
      }
    ];

    setThreads(mockThreads);
    setFilteredThreads(mockThreads);
  }, []);

  useEffect(() => {
    let filtered = threads;

    if (searchTerm) {
      filtered = filtered.filter(thread =>
        thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        thread.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(thread => thread.category === selectedCategory);
    }

    setFilteredThreads(filtered);
  }, [threads, searchTerm, selectedCategory]);

  const categories = ['all', ...Array.from(new Set(threads.map(thread => thread.category)))];

  const handleJoinThread = (threadId: string) => {
    const thread = threads.find(t => t.id === threadId);
    if (thread) {
      setSelectedThread(thread);
    }
  };

  const showToast = (type: 'success' | 'error' | 'warning', message: string) => {
    setToast({ type, message, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleJoinConfirm = async (threadId: string, method: 'payment' | 'nft') => {
    const thread = threads.find(t => t.id === threadId);
    if (!thread) return;

    console.log(`🔄 [FRONTEND] Starting join process for thread: ${thread.title}`);
    console.log(`📋 [FRONTEND] Method: ${method}`);
    console.log(`👤 [FRONTEND] User wallet: ${address}`);

    try {
      if (method === 'payment' && thread.requiredPayment) {
        console.log(`💰 [FRONTEND] Processing payment of ${thread.requiredPayment} TON`);
        console.log(`📍 [FRONTEND] Payment will go to: ${recipientWallet}`);
        
        // For demo purposes, simulate transaction
        console.log('📤 [FRONTEND] Simulating TON transaction...');
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
        
        const mockTransactionHash = `demo_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        console.log('✅ [FRONTEND] Demo transaction successful:', mockTransactionHash);
        
        // Send to backend for verification
        console.log('🔄 [FRONTEND] Sending to backend for verification...');
        const response = await fetch(`/api/threads/${threadId}/join/payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userWallet: address,
            transactionHash: mockTransactionHash,
            amount: thread.requiredPayment,
            recipientWallet: recipientWallet
          }),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = 'Backend verification failed';
          try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.error || errorMessage;
          } catch (e) {
            errorMessage = errorText || errorMessage;
          }
          throw new Error(errorMessage);
        }
        
        const backendResult = await response.json();
        console.log('✅ [FRONTEND] Backend verification complete:', backendResult);
        
      } else if (method === 'nft') {
        console.log('🖼️ [FRONTEND] Verifying NFT ownership...');
        
        // Simulate NFT verification delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Send to backend for NFT verification
        const response = await fetch(`/api/threads/${threadId}/join/nft`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userWallet: address,
            nftAddress: thread.requiredNFT || 'EQD...demo_nft_address',
            recipientWallet: recipientWallet
          }),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = 'NFT verification failed';
          try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.error || errorMessage;
          } catch (e) {
            errorMessage = errorText || errorMessage;
          }
          throw new Error(errorMessage);
        }
        
        const backendResult = await response.json();
        console.log('✅ [FRONTEND] NFT ownership verified:', backendResult);
      }

      // Update joined threads
      setJoinedThreads(prev => [...prev, threadId]);
      
      // Close modal and show success
      setSelectedThread(null);
      showToast('success', `Successfully joined ${thread.title}! Check your Telegram for the invite link.`);
      
      console.log('🎉 [FRONTEND] Join process completed successfully');
      
    } catch (error) {
      console.error('❌ [FRONTEND] Join process failed:', error);
      showToast('error', `Failed to join thread: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #fef7ed 0%, #fed7aa 25%, #fdba74 50%, #fb923c 75%, #f97316 100%)'
    }}>
      {/* Hero Section with organic shapes */}
      <div className="relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 25%, #8b5cf6 50%, #f59e0b 75%, #ea580c 100%)'
      }}>
        {/* Organic background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-white opacity-10 rounded-full transform rotate-12"></div>
          <div className="absolute top-32 -right-20 w-80 h-80 bg-white opacity-5 transform -rotate-45" style={{borderRadius: '30% 70% 70% 30%'}}></div>
          <div className="absolute bottom-16 left-1/3 w-48 h-48 bg-white opacity-8 transform rotate-45" style={{borderRadius: '40% 60% 60% 40%'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-8 text-white"
              style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
              animate={{
                textShadow: [
                  '0 4px 20px rgba(0,0,0,0.3)',
                  '0 6px 30px rgba(251, 146, 60, 0.4)',
                  '0 4px 20px rgba(0,0,0,0.3)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Welcome to{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
                  TON Threads
                </span>
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-8 w-8 text-yellow-300" />
                </motion.div>
              </span>
            </motion.h1>
            <motion.p 
              className="text-xl md:text-3xl mb-10 text-blue-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Discover exclusive micro-communities powered by TON blockchain
            </motion.p>
            <motion.div 
              className="flex items-center justify-center space-x-3 text-blue-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Heart className="h-6 w-6 text-red-300" />
              <span className="text-lg">Pay with TON • Verify NFTs • Join Private Groups</span>
              <Zap className="h-6 w-6 text-yellow-300" />
            </motion.div>
          </motion.div>
        </div>
        
        {/* Organic bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-16">
          <svg viewBox="0 0 1200 80" className="w-full h-full">
            <path 
              d="M0,40 Q150,10 300,40 T600,40 Q750,60 900,40 T1200,40 L1200,80 L0,80 Z" 
              fill="#fef7ed"
            />
          </svg>
        </div>
      </div>

      {/* Search and Filter Section with handcrafted design */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          className="relative p-8 mb-12 shadow-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #fef3c7 100%)',
            borderRadius: '30px 10px 30px 10px',
            border: '3px solid #fb923c'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-orange-200 opacity-50 transform rotate-45" style={{borderRadius: '30% 70% 70% 30%'}}></div>
          <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-yellow-200 opacity-40 rounded-full"></div>
          
          <div className="flex flex-col md:flex-row gap-6 relative">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-orange-500" />
              <input
                type="text"
                placeholder="Search for your perfect community..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 text-lg font-medium text-gray-800 placeholder-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-300 transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #fef3c7 100%)',
                  borderRadius: '20px 5px 20px 5px',
                  border: '2px solid #fb923c',
                  boxShadow: 'inset 0 2px 10px rgba(251, 146, 60, 0.1)'
                }}
              />
            </div>
            <div className="flex items-center space-x-3">
              <Filter className="h-6 w-6 text-orange-600" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-6 py-4 text-lg font-medium text-gray-800 focus:outline-none focus:ring-4 focus:ring-orange-300 transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #fef3c7 100%)',
                  borderRadius: '15px 5px 15px 5px',
                  border: '2px solid #fb923c',
                  boxShadow: '0 4px 15px rgba(251, 146, 60, 0.2)'
                }}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? '🌟 All Categories' : `${getCategoryEmoji(category)} ${category}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Stats Section with organic cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { value: threads.length, label: 'Active Threads', icon: Sparkles, color: 'from-blue-500 to-purple-500' },
            { value: threads.reduce((sum, thread) => sum + thread.memberCount, 0), label: 'Total Members', icon: Users, color: 'from-purple-500 to-pink-500' },
            { value: joinedThreads.length, label: 'Joined by You', icon: Heart, color: 'from-orange-500 to-red-500' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="relative p-8 text-center shadow-xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #fef3c7 100%)',
                borderRadius: index % 2 === 0 ? '25px 10px 25px 10px' : '10px 25px 10px 25px',
                border: '3px solid #fb923c'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 1 : -1 }}
            >
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-200 opacity-30 rounded-full"></div>
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${stat.color} text-white mb-4 shadow-lg`}>
                <stat.icon className="h-8 w-8" />
              </div>
              <div className="text-4xl font-bold text-gray-800 mb-2">{stat.value}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Threads Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {filteredThreads.map((thread, index) => (
            <motion.div
              key={thread.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              <ThreadCard
                thread={thread}
                onJoin={handleJoinThread}
                isJoined={joinedThreads.includes(thread.id)}
              />
            </motion.div>
          ))}
        </motion.div>

        {filteredThreads.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-2xl text-gray-500 mb-4">🔍 No threads found matching your criteria</div>
            <div className="text-gray-400">Try adjusting your search or category filter</div>
          </motion.div>
        )}
      </div>

      <JoinThreadModal
        thread={selectedThread}
        isOpen={!!selectedThread}
        onClose={() => setSelectedThread(null)}
        onJoin={handleJoinConfirm}
      />
      
      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

// Helper function for category emojis
const getCategoryEmoji = (category: string) => {
  const emojis: { [key: string]: string } = {
    'Development': '💻',
    'Art & Design': '🎨',
    'Finance': '💰',
    'Gaming': '🎮',
    'Business': '💼',
    'Trading': '📈'
  };
  return emojis[category] || '🌟';
};

export default Home;
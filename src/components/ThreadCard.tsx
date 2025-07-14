import React from 'react';
import { Thread } from '../types';
import { Users, Lock, Coins, Image as ImageIcon, Calendar, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface ThreadCardProps {
  thread: Thread;
  onJoin: (threadId: string) => void;
  isJoined?: boolean;
}

const ThreadCard: React.FC<ThreadCardProps> = ({ thread, onJoin, isJoined }) => {
  const handleJoin = () => {
    if (!isJoined) {
      onJoin(thread.id);
    }
  };

  const cardRotation = Math.random() > 0.5 ? 'rotate-1' : '-rotate-1';
  const borderRadius = Math.random() > 0.5 ? '25px 10px 25px 10px' : '10px 25px 10px 25px';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: 0 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      whileHover={{ 
        y: -8, 
        rotate: cardRotation === 'rotate-1' ? 2 : -2,
        scale: 1.02
      }}
      className={`relative bg-white shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden border-4 border-orange-300 ${cardRotation}`}
      style={{
        borderRadius,
        background: 'linear-gradient(135deg, #ffffff 0%, #fef3c7 100%)',
        boxShadow: '0 10px 40px rgba(251, 146, 60, 0.3)'
      }}
    >
      {/* Decorative corner elements */}
      <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-200 opacity-50 transform rotate-45" style={{borderRadius: '30% 70% 70% 30%'}}></div>
      <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-yellow-200 opacity-40 rounded-full"></div>
      
      <div className="relative h-52 overflow-hidden" style={{
        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #f59e0b 100%)'
      }}>
        <img
          src={thread.image}
          alt={thread.title}
          className="w-full h-full object-cover mix-blend-overlay opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        
        {/* Top badges */}
        <div className="absolute top-4 right-4 flex space-x-2">
          {thread.isPrivate && (
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
              <Lock className="h-4 w-4 text-gray-600" />
            </div>
          )}
        </div>
        
        {/* Category badge */}
        <div className="absolute bottom-4 left-4">
          <span 
            className="bg-white/95 backdrop-blur-sm text-gray-800 px-4 py-2 font-semibold text-sm shadow-lg"
            style={{
              borderRadius: '15px 5px 15px 5px',
              border: '2px solid #fb923c'
            }}
          >
            {getCategoryEmoji(thread.category)} {thread.category}
          </span>
        </div>
        
        {/* Sparkle decoration */}
        <motion.div
          className="absolute top-4 left-4"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="h-6 w-6 text-yellow-300 opacity-80" />
        </motion.div>
      </div>

      <div className="p-6 relative">
        <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">{thread.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">{thread.description}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-gray-500">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">{thread.memberCount} members</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-400">
            <Calendar className="h-3 w-3" />
            <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {(thread.requiredPayment || thread.requiredNFT) && (
          <div className="mb-6 p-4 rounded-2xl" style={{
            background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)',
            border: '2px solid #fb923c'
          }}>
            <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-orange-500" />
              <span>Entry Requirements:</span>
            </div>
            {thread.requiredPayment && (
              <div className="flex items-center space-x-3 text-blue-600 mb-2">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Coins className="h-4 w-4" />
                </div>
                <span className="font-bold text-lg">{thread.requiredPayment} TON</span>
              </div>
            )}
            {thread.requiredNFT && (
              <div className="flex items-center space-x-3 text-purple-600">
                <div className="bg-purple-100 p-2 rounded-full">
                  <ImageIcon className="h-4 w-4" />
                </div>
                <span className="font-medium">Required NFT Collection</span>
              </div>
            )}
          </div>
        )}

        <motion.button
          onClick={handleJoin}
          disabled={isJoined}
          className={`w-full py-4 px-6 font-bold text-lg transition-all duration-300 shadow-lg ${
            isJoined
              ? 'bg-gradient-to-r from-green-400 to-green-500 text-white cursor-not-allowed'
              : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transform hover:scale-105 active:scale-95'
          }`}
          style={{
            borderRadius: isJoined ? '20px' : '20px 5px 20px 5px',
            border: '3px solid',
            borderColor: isJoined ? '#10b981' : '#fb923c',
            boxShadow: isJoined 
              ? '0 8px 25px rgba(16, 185, 129, 0.4)' 
              : '0 8px 25px rgba(251, 146, 60, 0.4)'
          }}
          whileHover={!isJoined ? { scale: 1.05 } : {}}
          whileTap={!isJoined ? { scale: 0.95 } : {}}
        >
          {isJoined ? (
            <motion.div 
              className="flex items-center justify-center space-x-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <motion.div
                className="w-5 h-5 bg-white rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span>✨ Joined!</span>
            </motion.div>
          ) : (
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center space-x-2"
            >
              <Sparkles className="h-5 w-5" />
              <span>Unlock Access</span>
            </motion.span>
          )}
        </motion.button>
      </div>
    </motion.div>
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

export default ThreadCard;
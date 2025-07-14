import React from 'react';
import { motion } from 'framer-motion';

const Logo: React.FC = () => {
  return (
    <motion.div 
      className="flex items-center space-x-4"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="relative">
        {/* Handcrafted TON Thread Symbol */}
        <motion.div
          className="w-14 h-14 relative"
          animate={{ 
            rotate: [0, 360],
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {/* Main TON Crystal with organic shape */}
          <div 
            className="absolute inset-0 transform rotate-45 shadow-xl"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 25%, #1e40af 50%, #1e3a8a 75%, #312e81 100%)',
              borderRadius: '20% 80% 20% 80%',
              boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4), inset 0 2px 10px rgba(255, 255, 255, 0.3)'
            }}
          ></div>
          
          {/* Inner crystal reflection */}
          <div 
            className="absolute inset-2 transform rotate-45"
            style={{
              background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)',
              borderRadius: '30% 70% 30% 70%',
              opacity: 0.8
            }}
          ></div>
          
          {/* Thread lines with organic curves */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 56 56">
            <path 
              d="M10,28 Q28,20 46,28 Q28,36 10,28" 
              stroke="rgba(255,255,255,0.7)" 
              strokeWidth="1.5" 
              fill="none"
              strokeLinecap="round"
            />
            <path 
              d="M28,10 Q36,28 28,46 Q20,28 28,10" 
              stroke="rgba(255,255,255,0.7)" 
              strokeWidth="1.5" 
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
        
        {/* Connecting thread lines with organic flow */}
        <motion.svg
          className="absolute -right-6 top-1/2 w-12 h-8 transform -translate-y-1/2"
          viewBox="0 0 48 32"
          animate={{ 
            opacity: [0.6, 1, 0.6],
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <path 
            d="M2,16 Q12,8 24,16 Q36,24 46,16" 
            stroke="url(#threadGradient)" 
            strokeWidth="2" 
            fill="none"
            strokeLinecap="round"
          />
          <path 
            d="M2,16 Q12,24 24,16 Q36,8 46,16" 
            stroke="url(#threadGradient2)" 
            strokeWidth="1.5" 
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
          />
          <defs>
            <linearGradient id="threadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <linearGradient id="threadGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
        </motion.svg>
        
        {/* Thread connection nodes with organic positioning */}
        <motion.div
          className="absolute -right-3 top-1/3 w-3 h-3 rounded-full shadow-lg"
          style={{
            background: 'radial-gradient(circle, #8b5cf6 0%, #7c3aed 100%)'
          }}
          animate={{ 
            scale: [1, 1.4, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute -right-4 top-2/3 w-2 h-2 rounded-full shadow-md"
          style={{
            background: 'radial-gradient(circle, #f59e0b 0%, #d97706 100%)'
          }}
          animate={{ 
            scale: [0.8, 1.2, 0.8],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
        
        <motion.div
          className="absolute -right-2 top-1/2 w-1.5 h-1.5 rounded-full shadow-sm"
          style={{
            background: 'radial-gradient(circle, #06b6d4 0%, #0891b2 100%)'
          }}
          animate={{ 
            scale: [0.6, 1, 0.6],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{ 
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        {/* Network pulse effect with organic shape */}
        <motion.div
          className="absolute inset-0 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)'
          }}
          animate={{ 
            scale: [1, 2.2, 1],
            opacity: [0.2, 0, 0.2]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      </div>
      
      <div className="flex flex-col">
        <motion.span 
          className="text-3xl font-bold"
          style={{
            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 25%, #8b5cf6 50%, #f59e0b 75%, #ea580c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          TON
        </motion.span>
        <span 
          className="text-sm font-semibold -mt-1"
          style={{
            color: '#ea580c',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}
        >
          Threads
        </span>
      </div>
    </motion.div>
  );
};

export default Logo;
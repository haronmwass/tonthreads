import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TonConnectButton } from '@tonconnect/ui-react';
import { Home, Info, Sparkles } from 'lucide-react';
import Logo from './Logo';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="relative bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 border-b-4 border-orange-200" 
            style={{
              background: 'linear-gradient(135deg, #fef7ed 0%, #fed7aa 25%, #fdba74 50%, #fb923c 75%, #f97316 100%)',
              borderImage: 'linear-gradient(90deg, #fb923c, #f97316, #ea580c) 1'
            }}>
      {/* Organic decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-8 w-24 h-24 bg-orange-200 rounded-full opacity-30 transform rotate-12"></div>
        <div className="absolute -top-2 right-16 w-16 h-16 bg-amber-200 rounded-full opacity-40 transform -rotate-45"></div>
        <div className="absolute top-8 right-4 w-8 h-8 bg-rose-300 rounded-full opacity-50"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <Logo />
          </Link>

          <nav className="hidden md:flex space-x-2">
            <Link
              to="/"
              className={`relative px-6 py-3 rounded-full transition-all duration-300 flex items-center space-x-2 font-medium transform hover:scale-105 ${
                isActive('/') 
                  ? 'bg-white text-orange-600 shadow-lg border-2 border-orange-300' 
                  : 'text-orange-700 hover:bg-white hover:bg-opacity-60 hover:text-orange-800'
              }`}
              style={{
                background: isActive('/') ? 'linear-gradient(135deg, #ffffff 0%, #fef3c7 100%)' : undefined,
                boxShadow: isActive('/') ? '0 8px 25px rgba(251, 146, 60, 0.3)' : undefined
              }}
            >
              <Home className="h-5 w-5" />
              <span>Explore</span>
              {isActive('/') && (
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="h-4 w-4 text-orange-500 animate-pulse" />
                </div>
              )}
            </Link>
            <Link
              to="/demo"
              className={`relative px-6 py-3 rounded-full transition-all duration-300 flex items-center space-x-2 font-medium transform hover:scale-105 ${
                isActive('/demo') 
                  ? 'bg-white text-orange-600 shadow-lg border-2 border-orange-300' 
                  : 'text-orange-700 hover:bg-white hover:bg-opacity-60 hover:text-orange-800'
              }`}
              style={{
                background: isActive('/demo') ? 'linear-gradient(135deg, #ffffff 0%, #fef3c7 100%)' : undefined,
                boxShadow: isActive('/demo') ? '0 8px 25px rgba(251, 146, 60, 0.3)' : undefined
              }}
            >
              <Info className="h-5 w-5" />
              <span>How it Works</span>
              {isActive('/demo') && (
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="h-4 w-4 text-orange-500 animate-pulse" />
                </div>
              )}
            </Link>
          </nav>

          {/* Custom Connect Wallet Button Container */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              {/* Custom styling wrapper for TON Connect Button */}
              <div className="ton-connect-custom-wrapper">
                <TonConnectButton />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom organic wave */}
      <div className="absolute bottom-0 left-0 right-0 h-2">
        <svg viewBox="0 0 1200 20" className="w-full h-full">
          <path 
            d="M0,10 Q300,0 600,10 T1200,10 L1200,20 L0,20 Z" 
            fill="url(#headerGradient)"
          />
          <defs>
            <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </header>
  );
};

export default Header;
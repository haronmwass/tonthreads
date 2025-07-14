import React, { useState } from 'react';
import { Thread } from '../types';
import { X, Coins, Image as ImageIcon, ExternalLink, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTonConnect } from '../hooks/useTonConnect';
import LoadingSpinner from './LoadingSpinner';

interface JoinThreadModalProps {
  thread: Thread | null;
  isOpen: boolean;
  onClose: () => void;
  onJoin: (threadId: string, method: 'payment' | 'nft') => Promise<void>;
}

const JoinThreadModal: React.FC<JoinThreadModalProps> = ({ thread, isOpen, onClose, onJoin }) => {
  const [selectedMethod, setSelectedMethod] = useState<'payment' | 'nft' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const { isConnected, isConnecting, connect, address } = useTonConnect();

  if (!thread) return null;

  const handleJoin = async () => {
    if (!isConnected) {
      setLoadingStep('Connecting wallet...');
      try {
        await connect();
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        setLoadingStep('');
        return;
      }
      return;
    }

    if (!selectedMethod) return;

    setIsLoading(true);
    setLoadingStep(selectedMethod === 'payment' ? 'Processing payment...' : 'Verifying NFT ownership...');
    
    try {
      await onJoin(thread.id, selectedMethod);
    } catch (error) {
      console.error('Failed to join thread:', error);
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const hasPaymentOption = thread.requiredPayment;
  const hasNFTOption = thread.requiredNFT;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-md w-full max-h-screen overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Join Thread</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-6">
                <div className="relative h-32 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg overflow-hidden mb-4">
                  <img
                    src={thread.image}
                    alt={thread.title}
                    className="w-full h-full object-cover mix-blend-overlay"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{thread.title}</h3>
                <p className="text-gray-600">{thread.description}</p>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Choose joining method:</h4>
                <div className="space-y-3">
                  {hasPaymentOption && (
                    <button
                      onClick={() => setSelectedMethod('payment')}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedMethod === 'payment'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Coins className="h-6 w-6 text-blue-600" />
                        <div className="text-left">
                          <div className="font-medium text-gray-900">Pay with TON</div>
                          <div className="text-sm text-gray-500">{thread.requiredPayment} TON</div>
                        </div>
                      </div>
                    </button>
                  )}

                  {hasNFTOption && (
                    <button
                      onClick={() => setSelectedMethod('nft')}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedMethod === 'nft'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <ImageIcon className="h-6 w-6 text-purple-600" />
                        <div className="text-left">
                          <div className="font-medium text-gray-900">Verify NFT Ownership</div>
                          <div className="text-sm text-gray-500">Required NFT Collection</div>
                        </div>
                      </div>
                    </button>
                  )}
                </div>
              </div>

              <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <ExternalLink className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-yellow-800">Telegram Access</div>
                    <div className="text-sm text-yellow-700">
                      After verification, you'll receive a Telegram invite link to join the private group.
                    </div>
                  </div>
                </div>
              </div>

              {isConnected && address && (
                <div className="mb-6 p-4 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-700">
                    <div className="font-medium">Connected Wallet:</div>
                    <div className="font-mono text-xs mt-1">
                      {address.slice(0, 8)}...{address.slice(-8)}
                    </div>
                  </div>
                </div>
              )}

              {(isLoading || isConnecting) && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <LoadingSpinner size="sm" />
                    <div className="text-sm text-blue-700">
                      {loadingStep || 'Connecting...'}
                    </div>
                  </div>
                </div>
              )}
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  disabled={isLoading || isConnecting}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleJoin}
                  disabled={!selectedMethod || isLoading || isConnecting}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                    !selectedMethod || isLoading || isConnecting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                  }`}
                >
                  {isLoading || isConnecting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{isConnecting ? 'Connecting...' : 'Processing...'}</span>
                    </div>
                  ) : !isConnected ? (
                    'Connect Wallet'
                  ) : (
                    'Join Thread'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JoinThreadModal;
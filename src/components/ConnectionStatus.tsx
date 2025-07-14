import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, Database, MessageCircle, Zap } from 'lucide-react';

interface SystemStatus {
  server: string;
  database: string;
  telegram: {
    initialized: boolean;
    mode: string;
  };
  ton: {
    initialized: boolean;
    mode: string;
  };
}

const ConnectionStatus: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/status');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Failed to fetch system status:', error);
      // Set a fallback status when server is not available
      setStatus({
        server: 'offline',
        database: 'offline',
        telegram: {
          initialized: false,
          mode: 'offline'
        },
        ton: {
          initialized: false,
          mode: 'offline'
        }
      });
    }
  };

  const getStatusColor = (service: string, mode?: string) => {
    if (service === 'connected' || service === 'online' || service === true) {
      return mode === 'demo' ? 'text-yellow-500' : 'text-green-500';
    }
    return 'text-red-500';
  };

  const getStatusIcon = (service: string, type: string) => {
    const isConnected = service === 'connected' || service === 'online' || service === true;
    
    switch (type) {
      case 'server':
        return isConnected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />;
      case 'database':
        return <Database className="h-4 w-4" />;
      case 'telegram':
        return <MessageCircle className="h-4 w-4" />;
      case 'ton':
        return <Zap className="h-4 w-4" />;
      default:
        return <Wifi className="h-4 w-4" />;
    }
  };

  if (!status) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <motion.button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-white rounded-full p-3 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            status.server === 'online' ? 'bg-green-500' : 'bg-red-500'
          } animate-pulse`}></div>
          <span className="text-sm font-medium text-gray-700">Status</span>
        </div>
      </motion.button>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-64"
          >
            <h3 className="font-semibold text-gray-900 mb-3">System Status</h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(status.server, 'server')}
                  <span className="text-sm text-gray-700">Server</span>
                </div>
                <span className={`text-sm font-medium ${getStatusColor(status.server)}`}>
                  {status.server}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(status.database, 'database')}
                  <span className="text-sm text-gray-700">Database</span>
                </div>
                <span className={`text-sm font-medium ${getStatusColor(status.database)}`}>
                  {status.database}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(status.telegram.initialized.toString(), 'telegram')}
                  <span className="text-sm text-gray-700">Telegram</span>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-medium ${getStatusColor(status.telegram.initialized.toString(), status.telegram.mode)}`}>
                    {status.telegram.mode}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(status.ton.initialized.toString(), 'ton')}
                  <span className="text-sm text-gray-700">TON Network</span>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-medium ${getStatusColor(status.ton.initialized.toString(), status.ton.mode)}`}>
                    {status.ton.mode}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="text-xs text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConnectionStatus;
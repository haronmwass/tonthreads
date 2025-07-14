import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { useState, useEffect } from 'react';

interface TransactionRequest {
  validUntil: number;
  messages: Array<{
    address: string;
    amount: string;
    payload?: string;
  }>;
}
export const useTonConnect = () => {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    setIsConnected(!!wallet);
    if (wallet) {
      console.log('✅ TON Wallet Connected:', wallet.account.address);
      console.log('📱 Wallet Info:', {
        name: wallet.device.appName,
        version: wallet.device.appVersion,
        platform: wallet.device.platform
      });
    }
  }, [wallet]);

  const connect = async () => {
    setIsConnecting(true);
    try {
      console.log('🔄 Initiating TON Connect...');
      await tonConnectUI.connectWallet();
      console.log('✅ TON Connect successful');
    } catch (error) {
      console.error('❌ Failed to connect wallet:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      console.log('🔄 Disconnecting TON wallet...');
      await tonConnectUI.disconnect();
      console.log('✅ TON wallet disconnected');
    } catch (error) {
      console.error('❌ Failed to disconnect wallet:', error);
      throw error;
    }
  };

  const sendTransaction = async (transaction: TransactionRequest) => {
    try {
      console.log('🔄 Sending TON transaction...', transaction);
      const result = await tonConnectUI.sendTransaction(transaction);
      console.log('✅ Transaction sent successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ Failed to send transaction:', error);
      throw error;
    }
  };

  const createPaymentTransaction = (amount: number, recipientAddress: string): TransactionRequest => {
    return {
      validUntil: Math.floor(Date.now() / 1000) + 300, // 5 minutes
      messages: [
        {
          address: recipientAddress,
          amount: (amount * 1000000000).toString(), // Convert TON to nanotons
          payload: 'TON Threads payment'
        }
      ]
    };
  };

  const getRecipientWallet = async (): Promise<string> => {
    try {
      const response = await fetch('/api/status');
      const data = await response.json();
      return data.recipientWallet || 'EQDemo_Your_Wallet_Address_Here';
    } catch (error) {
      console.error('Failed to get recipient wallet:', error);
      return 'EQDemo_Your_Wallet_Address_Here';
    }
  };

  return {
    wallet,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    sendTransaction,
    createPaymentTransaction,
    getRecipientWallet,
    address: wallet?.account?.address,
  };
};
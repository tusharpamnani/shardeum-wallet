import React, { useState, useEffect } from 'react';
import { Wallet, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import shardeumApi from './services/shardeumApi';

function App() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState('0');
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sendAmount, setSendAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');

  // Initialize app and check wallet connection
  useEffect(() => {
    checkWalletConnection();
  }, []);

  // Load balance and transaction history when wallet is connected
  useEffect(() => {
    if (isWalletConnected && walletAddress) {
      loadBalance();
      loadTransactionHistory();
    }
  }, [isWalletConnected, walletAddress]);

  const checkWalletConnection = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          await connectWallet();
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const connectWallet = async () => {
    try {
      setLoading(true);
      await shardeumApi.initialize();
      const address = await shardeumApi.getCurrentAddress();
      setWalletAddress(address);
      setIsWalletConnected(true);
      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadBalance = async () => {
    try {
      const balance = await shardeumApi.getMyBalance();
      setBalance(parseFloat(balance).toFixed(4));
    } catch (error) {
      console.error('Error loading balance:', error);
    }
  };

  const loadTransactionHistory = async () => {
    try {
      const history = await shardeumApi.getTransactionHistory();
      setTransactionHistory(history);
    } catch (error) {
      console.error('Error loading transaction history:', error);
    }
  };

  const sendSHM = async (e) => {
    e.preventDefault();
    if (!sendAmount || !recipientAddress) {
      toast.error('Please enter both amount and recipient address');
      return;
    }

    try {
      setLoading(true);
      const txHash = await shardeumApi.sendSHM(recipientAddress, sendAmount);
      toast.success(`Transaction sent! Hash: ${txHash.slice(0, 6)}...${txHash.slice(-4)}`);
      setSendAmount('');
      setRecipientAddress('');
      loadBalance();
      loadTransactionHistory();
    } catch (error) {
      console.error('Error sending SHM:', error);
      toast.error('Failed to send SHM: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isWalletConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-6">Shardeum Wallet</h1>
          <button
            onClick={connectWallet}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Wallet size={20} />
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Shardeum Wallet</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Balance: {balance} SHM
            </div>
            <div className="text-sm text-gray-600">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Send SHM Form */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Send SHM</h2>
            <form onSubmit={sendSHM} className="bg-white p-6 rounded-lg shadow">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient Address
                </label>
                <input
                  type="text"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="0x..."
                  className="input-field"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (SHM)
                </label>
                <input
                  type="number"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  placeholder="0.0"
                  step="0.000000000000000001"
                  min="0"
                  className="input-field"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send size={20} />
                {loading ? 'Sending...' : 'Send SHM'}
              </button>
            </form>
          </div>

          {/* Transaction History */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
            <div className="bg-white rounded-lg shadow">
              {transactionHistory.length === 0 ? (
                <p className="p-6 text-gray-500 text-center">No transactions yet</p>
              ) : (
                <div className="divide-y">
                  {transactionHistory.map((tx, index) => (
                    <div key={index} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-600">To: {tx.to.slice(0, 6)}...{tx.to.slice(-4)}</p>
                          <p className="text-sm text-gray-500">Amount: {tx.amount} SHM</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {new Date(tx.timestamp).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            TX: {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App; 
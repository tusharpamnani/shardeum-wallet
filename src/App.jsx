import React, { useState, useEffect } from 'react';
import { Wallet, Send, Heart, Search, Copy, ExternalLink, TrendingUp, Activity, Clock, ArrowUpRight, ArrowDownLeft, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import shardeumApi from './services/shardeumApi';

// Custom Components
const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
);

const GradientButton = ({ children, onClick, disabled, className = "", variant = "primary", type = "button", ...props }) => {
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg hover:shadow-xl",
    success: "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl",
    outline: "border-2 border-purple-500 text-purple-600 hover:bg-purple-50 bg-white"
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = "", gradient = false }) => (
  <div className={`${gradient ? 'bg-gradient-to-br from-white to-gray-50' : 'bg-white'} rounded-2xl shadow-xl border border-gray-100 backdrop-blur-sm ${className}`}>
    {children}
  </div>
);

const InputField = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-700">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />}
      <input
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 bg-gray-50 hover:bg-white`}
        {...props}
      />
    </div>
  </div>
);

const WalletConnect = ({ onConnect, loading }) => {
  const bgPattern = "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative">
      <div className="absolute inset-0" style={{ backgroundImage: `url("${bgPattern}")`, opacity: 0.2 }}></div>
      <Card className="p-8 max-w-md w-full text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10"></div>
        <div className="relative">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Wallet size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Shardeum Wallet
          </h1>
          <p className="text-gray-600 mb-8">Connect your wallet to start managing your SHM tokens</p>
          <GradientButton
            onClick={onConnect}
            disabled={loading}
            className="w-full text-lg py-4"
          >
            {loading ? <LoadingSpinner /> : <Wallet size={24} />}
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </GradientButton>
        </div>
      </Card>
    </div>
  );
};

const BalanceCard = ({ balance, address }) => (
  <Card gradient className="p-6 mb-8">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">Total Balance</p>
        <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          {balance} SHM
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-gray-500 mb-1">Wallet Address</p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono bg-gray-100 px-3 py-1 rounded-lg">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(address);
              toast.success('Address copied!');
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Copy size={16} />
          </button>
        </div>
      </div>
    </div>
  </Card>
);

function App() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState('0');
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [loadingStates, setLoadingStates] = useState({
    send: false,
    donate: false,
    search: false
  });
  const [sendAmount, setSendAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [donationAmount, setDonationAmount] = useState('');
  const [searchTxHash, setSearchTxHash] = useState('');
  const [searchedTx, setSearchedTx] = useState(null);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  useEffect(() => {
    let interval;
    if (isWalletConnected && walletAddress) {
      // Initial load
      loadBalance();
      
      // Set up polling every 10 seconds
      interval = setInterval(() => {
        loadBalance();
      }, 10000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
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
      setLoadingStates(prev => ({ ...prev, send: true }));
      await shardeumApi.initialize();
      const address = await shardeumApi.getCurrentAddress();
      setWalletAddress(address);
      setIsWalletConnected(true);
      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet: ' + error.message);
    } finally {
      setLoadingStates(prev => ({ ...prev, send: false }));
    }
  };

  const loadBalance = async () => {
    try {
      const balance = await shardeumApi.getMyBalance();
      setBalance(parseFloat(balance).toFixed(4));
    } catch (error) {
      console.error('Error loading balance:', error);
      toast.error('Failed to load balance');
    }
  };

  const addTransaction = (tx) => {
    setTransactionHistory(prev => [tx, ...prev]);
  };

  const sendSHM = async (e) => {
    e.preventDefault();
    if (!sendAmount || !recipientAddress) {
      toast.error('Please enter both amount and recipient address');
      return;
    }

    try {
      setLoadingStates(prev => ({ ...prev, send: true }));
      const txHash = await shardeumApi.sendSHM(recipientAddress, sendAmount);
      toast.success(`Transaction sent! Hash: ${txHash.slice(0, 6)}...${txHash.slice(-4)}`);
      
      // Add transaction to history
      addTransaction({
        type: 'send',
        to: recipientAddress,
        amount: sendAmount,
        hash: txHash,
        timestamp: Date.now(),
        status: 'completed'
      });

      setSendAmount('');
      setRecipientAddress('');
      
      // Wait for transaction to be mined
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Refresh balance
      await loadBalance();
    } catch (error) {
      console.error('Error sending SHM:', error);
      toast.error('Failed to send SHM: ' + error.message);
    } finally {
      setLoadingStates(prev => ({ ...prev, send: false }));
    }
  };

  const handleDonation = async (e) => {
    e.preventDefault();
    if (!donationAmount) {
      toast.error('Please enter donation amount');
      return;
    }

    try {
      setLoadingStates(prev => ({ ...prev, donate: true }));
      const txHash = await shardeumApi.donate(recipientAddress, donationAmount);
      toast.success(`Donation sent! Hash: ${txHash.slice(0, 6)}...${txHash.slice(-4)}`);
      
      // Add transaction to history
      addTransaction({
        type: 'donate',
        to: recipientAddress,
        amount: donationAmount,
        hash: txHash,
        timestamp: Date.now(),
        status: 'completed'
      });

      setDonationAmount('');
      
      // Wait for transaction to be mined
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Refresh balance
      await loadBalance();
    } catch (error) {
      console.error('Error sending donation:', error);
      toast.error('Failed to send donation: ' + error.message);
    } finally {
      setLoadingStates(prev => ({ ...prev, donate: false }));
    }
  };

  const searchTransaction = async (e) => {
    e.preventDefault();
    if (!searchTxHash) {
      toast.error('Please enter a transaction hash');
      return;
    }

    try {
      setLoadingStates(prev => ({ ...prev, search: true }));
      const tx = await shardeumApi.getTransactionByHash(searchTxHash);
      if (tx) {
        setSearchedTx(tx);
        toast.success('Transaction found!');
      } else {
        toast.error('Transaction not found');
        setSearchedTx(null);
      }
    } catch (error) {
      console.error('Error searching transaction:', error);
      toast.error('Failed to search transaction: ' + error.message);
      setSearchedTx(null);
    } finally {
      setLoadingStates(prev => ({ ...prev, search: false }));
    }
  };

  if (!isWalletConnected) {
    return <WalletConnect onConnect={connectWallet} loading={loadingStates.send} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-10 h-10 rounded-full flex items-center justify-center">
                <Wallet size={20} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Shardeum Wallet
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Connected
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <BalanceCard balance={balance} address={walletAddress} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Actions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Send SHM */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Send size={24} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Send SHM</h2>
                  <p className="text-gray-500">Transfer tokens to another wallet</p>
                </div>
              </div>
              <form onSubmit={sendSHM} className="space-y-6">
                <InputField
                  label="Recipient Address"
                  type="text"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="0x..."
                  required
                />
                <InputField
                  label="Amount (SHM)"
                  type="number"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  placeholder="0.0"
                  step="0.000000000000000001"
                  min="0"
                  required
                />
                <GradientButton
                  type="submit"
                  disabled={loadingStates.send}
                  className="w-full"
                >
                  {loadingStates.send ? <LoadingSpinner /> : <Send size={20} />}
                  {loadingStates.send ? 'Sending...' : 'Send SHM'}
                </GradientButton>
              </form>
            </Card>

            {/* Donation */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-pink-100 p-3 rounded-xl">
                  <Heart size={24} className="text-pink-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Make a Donation</h2>
                  <p className="text-gray-500">Support causes you care about</p>
                </div>
              </div>
              <form onSubmit={handleDonation} className="space-y-6">
                <InputField
                  label="Donation Amount (SHM)"
                  type="number"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  placeholder="0.0"
                  step="0.000000000000000001"
                  min="0"
                  required
                />
                <GradientButton
                  type="submit"
                  disabled={loadingStates.donate}
                  variant="secondary"
                  className="w-full"
                >
                  {loadingStates.donate ? <LoadingSpinner /> : <Heart size={20} />}
                  {loadingStates.donate ? 'Processing...' : 'Donate SHM'}
                </GradientButton>
              </form>
            </Card>

            {/* Transaction Search */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-100 p-3 rounded-xl">
                  <Search size={24} className="text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Search Transaction</h2>
                  <p className="text-gray-500">Find transaction details by hash</p>
                </div>
              </div>
              <form onSubmit={searchTransaction} className="space-y-6">
                <InputField
                  label="Transaction Hash"
                  type="text"
                  value={searchTxHash}
                  onChange={(e) => setSearchTxHash(e.target.value)}
                  placeholder="0x..."
                  required
                />
                <GradientButton
                  type="submit"
                  disabled={loadingStates.search}
                  variant="success"
                  className="w-full"
                >
                  {loadingStates.search ? <LoadingSpinner /> : <Search size={20} />}
                  {loadingStates.search ? 'Searching...' : 'Search Transaction'}
                </GradientButton>
              </form>

              {searchedTx && (
                <Card className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                  <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                    <Activity size={18} />
                    Transaction Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">From:</span>
                      <span className="font-mono">{searchedTx.from.slice(0, 6)}...{searchedTx.from.slice(-4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">To:</span>
                      <span className="font-mono">{searchedTx.to.slice(0, 6)}...{searchedTx.to.slice(-4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Value:</span>
                      <span className="font-semibold">{shardeumApi.formatSHM(searchedTx.value)} SHM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hash:</span>
                      <span className="font-mono">{searchedTx.hash.slice(0, 6)}...{searchedTx.hash.slice(-4)}</span>
                    </div>
                  </div>
                </Card>
              )}
            </Card>
          </div>

          {/* Right Column - Transaction History */}
          <div className="lg:col-span-1">
            <Card className="p-6 h-fit">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <Clock size={24} className="text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Transaction History</h2>
                  <p className="text-gray-500">Recent activity</p>
                </div>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {transactionHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No transactions yet</p>
                    <p className="text-sm text-gray-400">Your transaction history will appear here</p>
                  </div>
                ) : (
                  transactionHistory.map((tx, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg ${
                            tx.type === 'send' ? 'bg-blue-100' : 'bg-pink-100'
                          }`}>
                            {tx.type === 'send' ? (
                              <ArrowUpRight size={16} className="text-blue-600" />
                            ) : (
                              <Heart size={16} className="text-pink-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {tx.type === 'send' ? 'Sent to:' : 'Donated to:'} {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(tx.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-800">{tx.amount} SHM</p>
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-gray-500 font-mono">
                              {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                            </p>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(tx.hash);
                                toast.success('Transaction hash copied!');
                              }}
                              className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                              <Copy size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
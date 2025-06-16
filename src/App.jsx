import React, { useState, useEffect } from 'react';
import { Send, Heart, Wallet, TrendingUp, Activity, Search, Copy, ExternalLink, Zap, Shield, Star } from 'lucide-react';
import shardeumApi from './services/shardeumApi';
import BalanceCard from './components/BalanceCard';
import GlowCard from './components/GlowCard';
import FloatingParticles from './components/FloatingParticles';
import AnimatedButton from './components/ui/AnimatedButton';
import StatsCard from './components/ui/StatsCard';
import InputField from './components/ui/InputField';
import TransactionCard from './components/ui/TransactionCard';
import Header from './components/Header';
import WalletConnect from './components/WalletConnect';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-6">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">{this.state.error?.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState('0');
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [loadingStates, setLoadingStates] = useState({
    send: false,
    donate: false,
    search: false,
    connect: false
  });
  const [sendAmount, setSendAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [donationAmount, setDonationAmount] = useState('');
  const [searchedTx, setSearchedTx] = useState(null);
  const [searchHash, setSearchHash] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        await checkWalletConnection();
      } catch (err) {
        console.error('Initialization error:', err);
        setError(err);
      }
    };
    init();
  }, []);

  useEffect(() => {
    let interval;
    if (isWalletConnected && walletAddress) {
      loadBalance();
      interval = setInterval(loadBalance, 10000);
    }
    return () => interval && clearInterval(interval);
  }, [isWalletConnected, walletAddress]);

  const checkWalletConnection = async () => {
    try {
      const address = await shardeumApi.getCurrentAddress();
      setWalletAddress(address);
      setIsWalletConnected(true);
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      setError(error);
    }
  };

  const connectWallet = async () => {
    try {
      setLoadingStates(prev => ({ ...prev, connect: true }));
      await shardeumApi.initialize();
      const address = await shardeumApi.getCurrentAddress();
      setWalletAddress(address);
      setIsWalletConnected(true);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError(error);
    } finally {
      setLoadingStates(prev => ({ ...prev, connect: false }));
    }
  };

  const loadBalance = async () => {
    try {
      const balance = await shardeumApi.getMyBalance();
      setBalance(parseFloat(balance).toFixed(4));
    } catch (error) {
      console.error('Error loading balance:', error);
      setError(error);
    }
  };

  const addTransaction = (tx) => {
    setTransactionHistory(prev => [tx, ...prev]);
  };

  const sendSHM = async (e) => {
    e.preventDefault();
    if (!sendAmount || !recipientAddress) return;

    try {
      setLoadingStates(prev => ({ ...prev, send: true }));
      const txHash = await shardeumApi.sendSHM(recipientAddress, sendAmount);
      
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
      
      setTimeout(loadBalance, 2000);
    } catch (error) {
      console.error('Error sending SHM:', error);
      setError(error);
    } finally {
      setLoadingStates(prev => ({ ...prev, send: false }));
    }
  };

  const handleDonation = async (e) => {
    e.preventDefault();
    if (!donationAmount) return;

    try {
      setLoadingStates(prev => ({ ...prev, donate: true }));
      const txHash = await shardeumApi.donate(recipientAddress, donationAmount);
      
      addTransaction({
        type: 'donate',
        to: recipientAddress,
        amount: donationAmount,
        hash: txHash,
        timestamp: Date.now(),
        status: 'completed'
      });

      setDonationAmount('');
      setTimeout(loadBalance, 2000);
    } catch (error) {
      console.error('Error sending donation:', error);
      setError(error);
    } finally {
      setLoadingStates(prev => ({ ...prev, donate: false }));
    }
  };

  const searchTransaction = async () => {
    if (!searchHash) return;
    
    try {
      setLoadingStates(prev => ({ ...prev, search: true }));
      const tx = await shardeumApi.getTransactionByHash(searchHash);
      if (tx) {
        setSearchedTx({
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: shardeumApi.formatSHM(tx.value),
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.error('Error searching transaction:', error);
      setError(error);
      setSearchedTx(null);
    } finally {
      setLoadingStates(prev => ({ ...prev, search: false }));
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => setError(null)}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!isWalletConnected) {
    return <WalletConnect onConnect={connectWallet} loading={loadingStates.connect} />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
        <FloatingParticles />
        <Header />
        
        <main className="max-w-7xl mx-auto px-6 py-8 relative">
          <BalanceCard balance={balance} address={walletAddress} />

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard
              icon={TrendingUp}
              title="24h Change"
              value="+12.5%"
              change={12.5}
              color="from-green-500 to-emerald-600"
            />
            <StatsCard
              icon={Activity}
              title="Transactions"
              value={transactionHistory.length.toString()}
              color="from-blue-500 to-cyan-600"
            />
            <StatsCard
              icon={Zap}
              title="Network"
              value="Shardeum"
              color="from-purple-500 to-violet-600"
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Actions */}
            <div className="xl:col-span-2 space-y-8">
              {/* Send SHM */}
              <GlowCard className="p-8 hover gradient">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-lg">
                    <Send size={28} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Send SHM</h2>
                    <p className="text-gray-600">Transfer tokens to another wallet</p>
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
                  <AnimatedButton
                    onClick={sendSHM}
                    loading={loadingStates.send}
                    className="w-full"
                  >
                    <Send size={20} />
                    {loadingStates.send ? 'Sending...' : 'Send SHM'}
                  </AnimatedButton>
                </form>
              </GlowCard>

              {/* Donation */}
              <GlowCard className="p-8 hover gradient">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl shadow-lg">
                    <Heart size={28} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Make a Donation</h2>
                    <p className="text-gray-600">Support causes you care about</p>
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
                  <AnimatedButton
                    onClick={handleDonation}
                    loading={loadingStates.donate}
                    variant="secondary"
                    className="w-full"
                  >
                    <Heart size={20} />
                    {loadingStates.donate ? 'Processing...' : 'Donate SHM'}
                  </AnimatedButton>
                </form>
              </GlowCard>

              {/* Transaction Search */}
              <GlowCard className="p-8 hover gradient">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg">
                    <Search size={28} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Search Transaction</h2>
                    <p className="text-gray-600">Find transaction details by hash</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <InputField
                    label="Transaction Hash"
                    type="text"
                    value={searchHash}
                    onChange={(e) => setSearchHash(e.target.value)}
                    placeholder="0x..."
                  />
                  <AnimatedButton
                    onClick={searchTransaction}
                    loading={loadingStates.search}
                    variant="outline"
                    className="w-full"
                  >
                    <Search size={20} />
                    {loadingStates.search ? 'Searching...' : 'Search Transaction'}
                  </AnimatedButton>
                  
                  {searchedTx && (
                    <GlowCard className="p-6 mt-4">
                      <h3 className="font-bold text-gray-800 mb-4">Transaction Found</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-semibold">Hash:</span> {searchedTx.hash}</p>
                        <p><span className="font-semibold">From:</span> {searchedTx.from}</p>
                        <p><span className="font-semibold">To:</span> {searchedTx.to}</p>
                        <p><span className="font-semibold">Value:</span> {searchedTx.value} SHM</p>
                      </div>
                    </GlowCard>
                  )}
                </div>
              </GlowCard>
            </div>

            {/* Right Column - Transaction History */}
            <div className="xl:col-span-1">
              <GlowCard className="p-6 gradient">
                <div className="flex items-center gap-3 mb-6">
                  <Activity size={24} className="text-gray-700" />
                  <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
                </div>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {transactionHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <Activity size={48} className="text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No transactions yet</p>
                    </div>
                  ) : (
                    transactionHistory.map((tx, index) => (
                      <TransactionCard key={index} tx={tx} />
                    ))
                  )}
                </div>
              </GlowCard>
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
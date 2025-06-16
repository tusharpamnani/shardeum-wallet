import React, { useState } from 'react';
import { Copy } from 'lucide-react';
import GlowCard from './GlowCard';

const BalanceCard = ({ balance, address }) => {
  const [copied, setCopied] = useState(false);
  
  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <GlowCard className="p-8 mb-8 gradient">
      <div className="text-center">
        <div className="mb-6">
          <p className="text-gray-600 text-lg mb-2">Total Balance</p>
          <h2 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {balance}
          </h2>
          <p className="text-2xl text-gray-500 mt-2">SHM</p>
        </div>
        
        <div className="flex items-center justify-center gap-3 p-4 bg-gray-50 rounded-2xl">
          <p className="text-gray-600 font-mono text-sm">
            {address.slice(0, 6)}...{address.slice(-6)}
          </p>
          <button
            onClick={copyAddress}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Copy size={16} className={copied ? 'text-green-500' : 'text-gray-500'} />
          </button>
        </div>
      </div>
    </GlowCard>
  );
};

export default BalanceCard;
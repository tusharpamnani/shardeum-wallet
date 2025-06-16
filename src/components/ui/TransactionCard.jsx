import React from 'react';
import { Send, Heart } from 'lucide-react';
import GlowCard from '../GlowCard';

const TransactionCard = ({ tx }) => (
  <GlowCard className="p-4 mb-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${tx.type === 'send' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
          {tx.type === 'send' ? <Send size={20} /> : <Heart size={20} />}
        </div>
        <div>
          <p className="font-semibold text-gray-800 capitalize">{tx.type}</p>
          <p className="text-sm text-gray-500">
            {new Date(tx.timestamp).toLocaleString()}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-gray-800">{tx.amount} SHM</p>
        <p className="text-xs text-gray-500">
          {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
        </p>
      </div>
    </div>
  </GlowCard>
);

export default TransactionCard; 
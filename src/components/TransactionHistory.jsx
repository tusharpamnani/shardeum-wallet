import React from 'react';
import { Clock, Activity, Copy, ExternalLink, ArrowUpRight, Heart } from 'lucide-react';
import Card from './ui/Card';
import toast from 'react-hot-toast';

const TransactionHistory = ({ transactions }) => (
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
      {transactions.length === 0 ? (
        <div className="text-center py-8">
          <Activity size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No transactions yet</p>
          <p className="text-sm text-gray-400">Your transaction history will appear here</p>
        </div>
      ) : (
        transactions.map((tx, index) => (
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
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(tx.hash);
                        toast.success('Transaction hash copied!');
                      }}
                      className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Copy size={14} />
                    </button>
                    <a
                      href={`https://explorer-testnet.shardeum.org/transaction/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                      title="View on Explorer"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </Card>
);

export default TransactionHistory; 
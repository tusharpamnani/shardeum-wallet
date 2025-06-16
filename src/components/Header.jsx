import React from 'react';
import { Wallet } from 'lucide-react';

const Header = () => (
  <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-2xl border-b border-white/20">
    <div className="max-w-7xl mx-auto px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Wallet size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Shardeum Wallet
            </h1>
            <p className="text-sm text-gray-500">Decentralized Finance</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Network Active
          </div>
        </div>
      </div>
    </div>
  </header>
);

export default Header; 
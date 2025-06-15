import React from 'react';
import { Wallet, Users, Shield, Zap } from 'lucide-react';

const WalletConnect = ({ onConnect, loading }) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="gradient-bg w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SHM Splitter</h1>
          <p className="text-gray-600">Split bills and pay with SHM on Shardeum</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm border">
            <div className="bg-shardeum-100 p-2 rounded-lg">
              <Users size={20} className="text-shardeum-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Group Expenses</h3>
              <p className="text-sm text-gray-600">Create and manage expense groups</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm border">
            <div className="bg-shardeum-100 p-2 rounded-lg">
              <Zap size={20} className="text-shardeum-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Auto Split</h3>
              <p className="text-sm text-gray-600">Automatic and manual split calculations</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm border">
            <div className="bg-shardeum-100 p-2 rounded-lg">
              <Shield size={20} className="text-shardeum-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">SHM Payments</h3>
              <p className="text-sm text-gray-600">Pay directly with SHM cryptocurrency</p>
            </div>
          </div>
        </div>

        {/* Connect Wallet Button */}
        <div className="card">
          <div className="text-center mb-4">
            <Wallet size={48} className="text-shardeum-600 mx-auto mb-3" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Connect Your Wallet</h2>
            <p className="text-gray-600 text-sm">
              Connect your MetaMask or compatible wallet to start splitting bills with SHM
            </p>
          </div>

          <button
            onClick={onConnect}
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center space-x-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="loading-spinner"></div>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Wallet size={20} />
                <span>Connect Wallet</span>
              </>
            )}
          </button>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Make sure you're connected to the Shardeum network
            </p>
          </div>
        </div>

        {/* Requirements */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Requirements:</p>
          <ul className="mt-2 space-y-1">
            <li>• MetaMask or compatible Web3 wallet</li>
            <li>• Shardeum network configuration</li>
            <li>• SHM tokens for transactions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WalletConnect; 
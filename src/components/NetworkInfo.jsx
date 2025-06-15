import React from 'react';
import { Network, Server, Clock, Shield } from 'lucide-react';

const NetworkInfo = ({ networkInfo }) => {
  if (!networkInfo) return null;

  const formatBlockNumber = (blockNumber) => {
    if (typeof blockNumber === 'string') {
      return parseInt(blockNumber, 16).toLocaleString();
    }
    return blockNumber?.toLocaleString() || 'N/A';
  };

  const formatChainId = (chainId) => {
    if (typeof chainId === 'string') {
      return parseInt(chainId, 16);
    }
    return chainId || 'N/A';
  };

  return (
    <div className="bg-gray-900 text-white py-6">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Network size={20} className="text-shardeum-400" />
            <h3 className="text-lg font-semibold">Shardeum Network Status</h3>
          </div>
          <p className="text-gray-400 text-sm">Real-time network information</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Chain ID */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Shield size={16} className="text-blue-400" />
              <span className="text-sm font-medium text-gray-300">Chain ID</span>
            </div>
            <div className="text-xl font-bold text-white">
              {formatChainId(networkInfo.chainId)}
            </div>
          </div>

          {/* Latest Block */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Server size={16} className="text-green-400" />
              <span className="text-sm font-medium text-gray-300">Latest Block</span>
            </div>
            <div className="text-xl font-bold text-white">
              {formatBlockNumber(networkInfo.blockNumber)}
            </div>
          </div>

          {/* Network Version */}
          {networkInfo.networkAccount?.activeVersion && (
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock size={16} className="text-purple-400" />
                <span className="text-sm font-medium text-gray-300">Network Version</span>
              </div>
              <div className="text-xl font-bold text-white">
                {networkInfo.networkAccount.activeVersion}
              </div>
            </div>
          )}

          {/* Maintenance Fee */}
          {networkInfo.networkAccount?.maintenanceFee && (
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Shield size={16} className="text-yellow-400" />
                <span className="text-sm font-medium text-gray-300">Maintenance Fee</span>
              </div>
              <div className="text-xl font-bold text-white">
                {networkInfo.networkAccount.maintenanceFee} SHM
              </div>
            </div>
          )}
        </div>

        {/* Additional Network Details */}
        {networkInfo.networkAccount && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Staking Info */}
            {networkInfo.networkAccount.requiredStake && (
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3">Staking Requirements</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Required Stake:</span>
                    <span className="text-white font-medium">
                      {networkInfo.networkAccount.requiredStake.amount} {networkInfo.networkAccount.requiredStake.currency?.toUpperCase()}
                    </span>
                  </div>
                  {networkInfo.networkAccount.restakeCooldown && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Restake Cooldown:</span>
                      <span className="text-white font-medium">
                        {networkInfo.networkAccount.restakeCooldown}s
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Rewards Info */}
            {networkInfo.networkAccount.reward && (
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3">Node Rewards</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Reward Amount:</span>
                    <span className="text-white font-medium">
                      {networkInfo.networkAccount.reward.amount} {networkInfo.networkAccount.reward.currency?.toUpperCase()}
                    </span>
                  </div>
                  {networkInfo.networkAccount.nodeRewardInterval && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Reward Interval:</span>
                      <span className="text-white font-medium">
                        {networkInfo.networkAccount.nodeRewardInterval}s
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-xs">
            Connected to Shardeum Network • Data refreshed automatically
          </p>
          <div className="flex items-center justify-center space-x-4 mt-2 text-xs text-gray-500">
            <span>🟢 Network Online</span>
            <span>⚡ Fast Transactions</span>
            <span>🔒 Secure & Decentralized</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkInfo; 
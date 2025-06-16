import React from 'react';
import { Wallet, Shield, Zap, Star } from 'lucide-react';
import GlowCard from './GlowCard';
import AnimatedButton from './ui/AnimatedButton';
import FloatingParticles from './FloatingParticles';


const WalletConnect = ({ onConnect, loading }) => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-6 relative overflow-hidden">
    <FloatingParticles />
    
    {/* Background Pattern */}
    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
    
    <GlowCard className="p-12 max-w-md w-full text-center gradient">
      <div className="mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <Wallet size={48} className="text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Shardeum Wallet
        </h1>
        <p className="text-gray-600 text-lg">
          Connect your wallet to access the future of decentralized finance
        </p>
      </div>
      
      <AnimatedButton
        onClick={onConnect}
        loading={loading}
        className="w-full"
      >
        <Wallet size={24} />
        {loading ? 'Connecting...' : 'Connect Wallet'}
      </AnimatedButton>
      
      <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Shield size={16} />
          <span>Secure</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap size={16} />
          <span>Fast</span>
        </div>
        <div className="flex items-center gap-2">
          <Star size={16} />
          <span>Trusted</span>
        </div>
      </div>
    </GlowCard>
  </div>
);

export default WalletConnect;
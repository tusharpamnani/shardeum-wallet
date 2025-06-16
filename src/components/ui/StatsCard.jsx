import React from 'react';
import GlowCard from '../GlowCard';

const StatsCard = ({ icon: Icon, title, value, change, color }) => (
    <GlowCard className="p-6 hover">
      <div className="flex items-center justify-between">
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${color}`}>
          <Icon size={28} className="text-white" />
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          <p className="text-sm text-gray-500">{title}</p>
          {change && (
            <p className={`text-xs ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {change > 0 ? '+' : ''}{change}%
            </p>
          )}
        </div>
      </div>
    </GlowCard>
  );

  export default StatsCard;
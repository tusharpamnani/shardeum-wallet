import React from 'react';

const GlowCard = ({ children, className = '', hover = true, gradient = false }) => (
    <div className={`
      relative bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl
      ${hover ? 'hover:shadow-[0_0_80px_rgba(59,130,246,0.3)] hover:scale-[1.02] transition-all duration-500' : ''}
      ${gradient ? 'bg-gradient-to-br from-white/90 to-white/70' : ''}
      ${className}
    `}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl" />
      <div className="relative">{children}</div>
    </div>
);

export default GlowCard;
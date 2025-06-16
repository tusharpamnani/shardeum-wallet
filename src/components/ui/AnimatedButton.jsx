import React from 'react';

const AnimatedButton = ({ children, onClick, disabled, variant = 'primary', className = '', loading = false }) => {
    const baseClasses = "relative group px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden";
    
    const variants = {
      primary: "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg hover:shadow-[0_0_40px_rgba(59,130,246,0.5)]",
      secondary: "bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white shadow-lg hover:shadow-[0_0_40px_rgba(236,72,153,0.5)]",
      outline: "border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600"
    };
  
    return (
      <button
        onClick={onClick}
        disabled={disabled || loading}
        className={`${baseClasses} ${variants[variant]} ${className}`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        <div className="relative flex items-center justify-center gap-3">
          {loading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : null}
          {children}
        </div>
      </button>
    );
  };

  export default AnimatedButton;
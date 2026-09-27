import React from 'react';

export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-[#141414] text-[#888888] border border-[#262626]',
    gold: 'bg-gold-400/10 text-gold-400 border border-gold-400/30',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/30',
    info: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
    purple: 'bg-purple-500/10 text-purple-400 border border-purple-500/30',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-none ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
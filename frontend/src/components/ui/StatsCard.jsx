import React from 'react';
import BrutalCard from './BrutalCard';
import AnimatedCounter from './AnimatedCounter';

const StatsCard = ({ 
  icon: Icon, 
  value, 
  label, 
  trend, 
  variant = 'default',
  className = ''
}) => {
  return (
    <BrutalCard variant={variant} className={`flex flex-col rounded-none ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="w-9 h-9 border border-[#262626] bg-[#141414] rounded-none flex items-center justify-center">
          {Icon && <Icon className="w-4 h-4 text-white" />}
        </div>
        {trend && (
          <span className={`px-2 py-0.5 text-[10px] font-mono rounded-none uppercase tracking-wider ${
            trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
            trend.startsWith('-') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
            'bg-[#141414] text-[#888888] border border-[#262626]'
          }`}>
            {trend}
          </span>
        )}
      </div>
      <div className="mt-auto">
        <div className="text-2xl sm:text-3xl font-mono font-medium text-white mb-1 tracking-tight">
          <AnimatedCounter value={value} />
        </div>
        <p className="text-[11px] uppercase tracking-[0.16em] font-sans text-[#888888]">{label}</p>
      </div>
    </BrutalCard>
  );
};

export default StatsCard;

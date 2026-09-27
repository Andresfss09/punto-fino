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
    <BrutalCard variant={variant} className={`flex flex-col ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 border border-[#2b3530] bg-[#161d19] rounded-[4px]">
          {Icon && <Icon className="w-5 h-5 text-gold-400" />}
        </div>
        {trend && (
          <span className={`editorial-tag ${
            trend.startsWith('+') ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
            trend.startsWith('-') ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
            'bg-[#1a1f1d] text-[#b3b3b3] border-[#2b3530]'
          }`}>
            {trend}
          </span>
        )}
      </div>
      <div className="mt-auto">
        <div className="text-3xl font-mono-price font-bold text-white mb-1">
          <AnimatedCounter value={value} />
        </div>
        <p className="text-xs uppercase tracking-wider font-sans text-[#b3b3b3]">{label}</p>
      </div>
    </BrutalCard>
  );
};

export default StatsCard;

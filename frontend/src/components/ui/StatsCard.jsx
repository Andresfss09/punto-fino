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
        <div className="p-2 border-2 border-[#333] shadow-[2px_2px_0_#333] bg-[#0a0a0a] rounded-[2px]">
          {Icon && <Icon className="w-5 h-5 text-[#d4af37]" />}
        </div>
        {trend && (
          <span className={`brutal-badge ${
            trend.startsWith('+') ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
            trend.startsWith('-') ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
            'bg-gray-500/10 text-gray-400 border-[#333]'
          }`}>
            {trend}
          </span>
        )}
      </div>
      <div className="mt-auto">
        <div className="text-3xl font-mono-price font-bold text-white mb-1">
          <AnimatedCounter value={value} />
        </div>
        <p className="text-sm font-medium text-[#a0a0a0] font-sans">{label}</p>
      </div>
    </BrutalCard>
  );
};

export default StatsCard;

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
    <BrutalCard variant={variant} className={`flex flex-col rounded-[6px] ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="w-9 h-9 border border-[#2b292d] bg-[#1a191b] rounded-[6px] flex items-center justify-center">
          {Icon && <Icon className="w-4 h-4 text-[#71d083]" />}
        </div>
        {trend && (
          <span className={`px-2 py-0.5 text-[10px] font-mono rounded-[2px] uppercase tracking-[0.025em] ${
            trend.startsWith('+') ? 'bg-[#1b2a1e] text-[#71d083] border border-[#2d5736]' : 
            trend.startsWith('-') ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 
            'bg-[#1a191b] text-[#7c7a85] border border-[#2b292d]'
          }`}>
            {trend}
          </span>
        )}
      </div>
      <div className="mt-auto">
        <div className="text-2xl sm:text-3xl font-mono font-medium text-[#e5e5e5] mb-1 tracking-tight">
          <AnimatedCounter value={value} />
        </div>
        <p className="text-[11px] uppercase tracking-[0.025em] font-sans text-[#7c7a85]">{label}</p>
      </div>
    </BrutalCard>
  );
};

export default StatsCard;

import React from 'react';
import { motion } from 'framer-motion';
import { User, Check, Star } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export default function BarberSelector({ barbers = [], selectedBarber, onSelectBarber, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      </div>
    );
  }

  if (!barbers.length) {
    return (
      <div className="text-center py-16 border border-[#222222] rounded-none bg-[#111111]">
        <User size={32} className="text-[#666666] mx-auto mb-3" />
        <p className="text-[#888888] font-display text-xs uppercase tracking-[2px]">No hay barberos disponibles</p>
      </div>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {/* Option: Any Available Barber */}
      <motion.div variants={item}>
        <div 
          onClick={() => onSelectBarber({ _id: 'any', user: { name: 'Cualquier Maestro' } })}
          className={`h-full flex items-center p-5 rounded-none border transition-all duration-200 cursor-pointer ${
            selectedBarber?._id === 'any' 
              ? 'bg-[#181818] border-white' 
              : 'bg-[#111111] border-[#262626] hover:border-[#444444]'
          }`}
        >
          <div className="w-12 h-12 rounded-none border border-[#333333] flex items-center justify-center bg-black mr-4 shrink-0">
            <User size={18} className="text-[#888888]" />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-medium text-sm text-white uppercase tracking-[1.5px] leading-tight">
              Cualquier Maestro
            </h3>
            <p className="text-[#888888] text-xs font-sans mt-0.5">El primer barbero disponible</p>
          </div>
          <div className={`w-5 h-5 border flex items-center justify-center rounded-none ml-2 shrink-0 ${
            selectedBarber?._id === 'any' 
              ? 'bg-white border-white text-black' 
              : 'border-[#444444] bg-transparent text-transparent'
          }`}>
            <Check size={13} strokeWidth={3} />
          </div>
        </div>
      </motion.div>

      {/* Individual Barbers */}
      {barbers.map(barber => {
        const isSelected = selectedBarber?._id === barber._id;
        const name = barber.user?.name || barber.name;
        const rating = barber.rating?.average?.toFixed(1) || '5.0';

        return (
          <motion.div key={barber._id} variants={item}>
            <div 
              onClick={() => onSelectBarber(barber)}
              className={`h-full flex flex-col justify-between p-5 rounded-none border transition-all duration-200 cursor-pointer ${
                isSelected 
                  ? 'bg-[#181818] border-white' 
                  : 'bg-[#111111] border-[#262626] hover:border-[#444444]'
              }`}
            >
              <div className="flex items-start">
                {/* Monogram / Portrait */}
                <div className={`w-12 h-12 rounded-none border overflow-hidden flex items-center justify-center mr-4 shrink-0 bg-black ${
                  isSelected ? 'border-white' : 'border-[#333333]'
                }`}>
                  {barber.user?.avatar ? (
                    <img src={barber.user.avatar} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-display font-medium text-base text-white">
                      {name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-display font-medium text-sm text-white uppercase tracking-[1.5px] leading-tight">
                    {name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-white text-xs">★</span>
                    <span className="font-mono text-xs text-white">
                      {rating}
                    </span>
                    <span className="text-[11px] text-[#666666] font-sans">
                      ({barber.rating?.count || 40}+)
                    </span>
                  </div>
                </div>

                <div className={`w-5 h-5 border flex items-center justify-center rounded-none ml-2 shrink-0 ${
                  isSelected 
                    ? 'bg-white border-white text-black' 
                    : 'border-[#444444] bg-transparent text-transparent'
                }`}>
                  <Check size={13} strokeWidth={3} />
                </div>
              </div>

              {barber.bio && (
                <p className="text-xs text-[#888888] font-sans mt-3 line-clamp-2 leading-relaxed">
                  {barber.bio}
                </p>
              )}

              {Array.isArray(barber.specialties) && barber.specialties.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-[#222222]">
                  {barber.specialties.slice(0, 3).map((spec, i) => (
                    <span
                      key={i}
                      className="text-[9px] font-display uppercase tracking-[1px] text-[#aaaaaa] border border-[#262626] px-1.5 py-0.5 rounded-none"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

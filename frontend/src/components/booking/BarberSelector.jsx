import React from 'react';
import { motion } from 'framer-motion';
import { User, Check, Star } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
};

export default function BarberSelector({ barbers = [], selectedBarber, onSelectBarber, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-400"></div>
      </div>
    );
  }

  if (!barbers.length) {
    return (
      <div className="text-center py-16 border border-[#222a26] rounded-[4px] bg-[#121815]">
        <User size={36} className="text-[#808080] mx-auto mb-3" />
        <p className="text-[#b3b3b3] font-sans text-xs uppercase tracking-wider">No hay barberos disponibles</p>
      </div>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
    >
      {/* Option: Any Available Barber */}
      <motion.div variants={item}>
        <div 
          onClick={() => onSelectBarber({ _id: 'any', user: { name: 'Cualquiera' } })}
          className={`h-full flex items-center p-5 rounded-[4px] border transition-all duration-200 cursor-pointer ${
            selectedBarber?._id === 'any' 
              ? 'bg-[#151c18] border-gold-400/80 shadow-soft-glow' 
              : 'bg-[#121815] border-[#222a26] hover:border-[#38443e]'
          }`}
        >
          <div className="w-12 h-12 rounded-[4px] border border-[#2b3530] flex items-center justify-center bg-[#161d19] mr-4 flex-shrink-0">
            <User size={18} className="text-[#b3b3b3]" />
          </div>
          <div className="flex-1">
            <h3 className="font-serif italic text-lg text-white leading-tight">Cualquier Maestro</h3>
            <p className="text-[#808080] text-xs font-sans mt-0.5">El primer barbero disponible</p>
          </div>
          {selectedBarber?._id === 'any' && (
            <div className="w-6 h-6 flex-shrink-0 bg-gold-400 flex items-center justify-center ml-2 rounded-[4px]">
              <Check size={14} className="text-[#0e1311]" strokeWidth={2.5} />
            </div>
          )}
        </div>
      </motion.div>

      {/* Individual Barbers */}
      {barbers.map(barber => {
        const isSelected = selectedBarber?._id === barber._id;
        return (
          <motion.div key={barber._id} variants={item}>
            <div 
              onClick={() => onSelectBarber(barber)}
              className={`h-full flex flex-col justify-between p-5 rounded-[4px] border transition-all duration-200 cursor-pointer ${
                isSelected 
                  ? 'bg-[#151c18] border-gold-400/80 shadow-soft-glow' 
                  : 'bg-[#121815] border-[#222a26] hover:border-[#38443e]'
              }`}
            >
              <div className="flex items-start">
                <div className={`w-14 h-14 rounded-[4px] border overflow-hidden flex items-center justify-center mr-4 flex-shrink-0 bg-[#161d19] ${
                  isSelected ? 'border-gold-400/60' : 'border-[#2b3530]'
                }`}>
                  {barber.user?.avatar ? (
                    <img src={barber.user.avatar} alt={barber.user?.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-serif italic text-2xl text-gold-400">
                      {barber.user?.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-serif italic text-xl text-white leading-tight">
                    {barber.user?.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Star size={12} className="text-gold-400 fill-gold-400" />
                    <span className="font-mono text-xs text-white">
                      {barber.rating?.average?.toFixed(1) || '5.0'}
                    </span>
                    <span className="font-sans text-[11px] text-[#808080]">
                      ({barber.rating?.count || 42} citas)
                    </span>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 flex-shrink-0 bg-gold-400 flex items-center justify-center ml-2 rounded-[4px]">
                    <Check size={14} className="text-[#0e1311]" strokeWidth={2.5} />
                  </div>
                )}
              </div>
              
              {barber.specialties && barber.specialties.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[#1f2723] flex flex-wrap gap-1.5">
                  {barber.specialties.slice(0, 3).map((spec, i) => (
                    <span 
                      key={i} 
                      className="px-2 py-0.5 text-[11px] font-sans text-[#dfdbca] bg-[#161d19] border border-[#26302a] rounded-[4px]"
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

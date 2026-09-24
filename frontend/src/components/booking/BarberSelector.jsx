import React from 'react';
import { motion } from 'framer-motion';
import { User, Check, Star } from 'lucide-react';
import BrutalCard from '../ui/BrutalCard';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function BarberSelector({ barbers = [], selectedBarber, onSelectBarber, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4af37]"></div>
      </div>
    );
  }

  if (!barbers.length) {
    return (
      <div className="text-center py-16 border-2 border-[#333] rounded-[4px] bg-[#111111]">
        <User size={40} className="text-[#a0a0a0] mx-auto mb-3" />
        <p className="text-[#a0a0a0] font-bold uppercase tracking-wider">No hay barberos disponibles</p>
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
      <motion.div variants={item}>
        <BrutalCard 
          variant="interactive"
          onClick={() => onSelectBarber({ _id: 'any', user: { name: 'Cualquiera' } })}
          className={`h-full flex items-center p-4 ${selectedBarber?._id === 'any' ? 'border-[#d4af37] shadow-[4px_4px_0_#d4af37] bg-[#d4af37]/5 scale-[1.02]' : ''}`}
        >
          <div className="w-12 h-12 rounded-full border-2 border-[#333] flex items-center justify-center bg-[#1a1a1a] mr-4 flex-shrink-0">
            <User size={20} className="text-[#a0a0a0]" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-white text-lg leading-tight uppercase">Cualquiera</h3>
            <p className="text-[#a0a0a0] text-xs font-mono mt-1">El primero disponible</p>
          </div>
          {selectedBarber?._id === 'any' && (
            <div className="w-6 h-6 flex-shrink-0 bg-[#d4af37] flex items-center justify-center ml-2 border-2 border-[#0a0a0a]">
              <Check size={14} className="text-[#0a0a0a]" strokeWidth={3} />
            </div>
          )}
        </BrutalCard>
      </motion.div>

      {barbers.map(barber => {
        const isSelected = selectedBarber?._id === barber._id;
        return (
          <motion.div key={barber._id} variants={item}>
            <BrutalCard 
              variant="interactive"
              onClick={() => onSelectBarber(barber)}
              className={`h-full flex flex-col p-4 ${isSelected ? 'border-[#d4af37] shadow-[4px_4px_0_#d4af37] bg-[#d4af37]/5 scale-[1.02]' : ''}`}
            >
              <div className="flex items-start">
                <div className={`w-14 h-14 rounded-full border-2 overflow-hidden flex items-center justify-center mr-4 flex-shrink-0 bg-[#1a1a1a] ${isSelected ? 'border-[#d4af37]' : 'border-[#333]'}`}>
                  {barber.user?.avatar ? (
                    <img src={barber.user.avatar} alt={barber.user?.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-display text-xl text-[#d4af37]">
                      {barber.user?.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-white text-lg leading-tight uppercase">{barber.user?.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={12} className="text-[#d4af37] fill-[#d4af37]" />
                    <span className="font-mono-price text-xs text-[#a0a0a0]">
                      {barber.rating?.average?.toFixed(1) || '5.0'} ({barber.rating?.count || 0})
                    </span>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 flex-shrink-0 bg-[#d4af37] flex items-center justify-center ml-2 border-2 border-[#0a0a0a]">
                    <Check size={14} className="text-[#0a0a0a]" strokeWidth={3} />
                  </div>
                )}
              </div>
              
              {barber.specialties && barber.specialties.length > 0 && (
                <div className="mt-4 pt-3 border-t-2 border-dashed border-[#333] flex flex-wrap gap-1">
                  {barber.specialties.slice(0, 3).map((spec, i) => (
                    <span key={i} className="brutal-badge border-[#333] text-[#a0a0a0] text-[10px]">
                      {spec}
                    </span>
                  ))}
                </div>
              )}
            </BrutalCard>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

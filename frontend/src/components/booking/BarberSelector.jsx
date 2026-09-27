import React from 'react';
import { motion } from 'framer-motion';
import { User, Check, Star } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
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
        <div className="animate-spin rounded-full h-8 w-8 border border-white border-t-transparent"></div>
      </div>
    );
  }

  if (!barbers.length) {
    return (
      <div className="text-center py-16 border border-[#1e1e1e] rounded-none bg-[#0a0a0a]">
        <User size={32} className="text-[#666666] mx-auto mb-3" />
        <p className="text-[#888888] font-sans text-xs uppercase tracking-[0.16em]">No hay barberos disponibles</p>
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
          className={`h-full flex items-center p-5 rounded-none border transition-all duration-200 cursor-pointer ${
            selectedBarber?._id === 'any' 
              ? 'bg-[#141414] border-white shadow-sm' 
              : 'bg-[#0a0a0a] border-[#1e1e1e] hover:border-[#333333]'
          }`}
        >
          <div className="w-11 h-11 rounded-none border border-[#262626] flex items-center justify-center bg-[#141414] mr-4 flex-shrink-0">
            <User size={16} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-sans font-medium uppercase tracking-[0.14em] text-sm text-white leading-tight">Cualquier Maestro</h3>
            <p className="text-[#888888] text-xs font-sans mt-0.5">El primer barbero disponible</p>
          </div>
          {selectedBarber?._id === 'any' && (
            <div className="w-5 h-5 flex-shrink-0 bg-white flex items-center justify-center ml-2 rounded-none">
              <Check size={13} className="text-black" strokeWidth={2.5} />
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
              className={`h-full flex flex-col justify-between p-5 rounded-none border transition-all duration-200 cursor-pointer ${
                isSelected 
                  ? 'bg-[#141414] border-white shadow-sm' 
                  : 'bg-[#0a0a0a] border-[#1e1e1e] hover:border-[#333333]'
              }`}
            >
              <div className="flex items-start">
                <div className={`w-12 h-12 rounded-none border overflow-hidden flex items-center justify-center mr-4 flex-shrink-0 bg-[#141414] ${
                  isSelected ? 'border-white' : 'border-[#262626]'
                }`}>
                  {barber.user?.avatar ? (
                    <img src={barber.user.avatar} alt={barber.user?.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-mono text-base text-white font-medium">
                      {barber.user?.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-sans font-medium uppercase tracking-[0.14em] text-sm text-white leading-tight">
                    {barber.user?.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Star size={11} className="text-gold-400 fill-gold-400" />
                    <span className="font-mono text-xs text-white">
                      {barber.rating?.average?.toFixed(1) || '5.0'}
                    </span>
                    <span className="text-[#888888] text-[11px] font-mono">
                      ({barber.rating?.count || 12} reseñas)
                    </span>
                  </div>
                  <p className="text-[#888888] text-[11px] font-sans uppercase tracking-wider mt-1">
                    Maestro Barbero
                  </p>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 flex-shrink-0 bg-white flex items-center justify-center ml-2 rounded-none">
                    <Check size={13} className="text-black" strokeWidth={2.5} />
                  </div>
                )}
              </div>

              {barber.specialties && barber.specialties.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-[#1e1e1e]">
                  {barber.specialties.map(spec => (
                    <span key={spec} className="inline-block px-2 py-0.5 rounded-none text-[10px] font-mono bg-[#141414] text-[#888888] border border-[#222222] uppercase">
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

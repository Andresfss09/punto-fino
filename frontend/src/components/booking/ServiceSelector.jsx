import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Clock, Check } from 'lucide-react';
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

export default function ServiceSelector({ services = [], selectedServices = [], onToggleService, isLoading }) {
  const [activeCategory, setActiveCategory] = useState('Todos');

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4af37]"></div>
      </div>
    );
  }

  if (!services.length) {
    return (
      <div className="text-center py-16 border-2 border-[#333] rounded-[4px] bg-[#111111]">
        <Scissors size={40} className="text-[#a0a0a0] mx-auto mb-3" />
        <p className="text-[#a0a0a0] font-bold uppercase tracking-wider">No hay servicios disponibles</p>
      </div>
    );
  }

  const categories = ['Todos', ...new Set(services.map(s => s.category).filter(Boolean))];
  
  const filteredServices = activeCategory === 'Todos' 
    ? services 
    : services.filter(s => s.category === activeCategory);

  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="pb-24 sm:pb-0">
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`brutal-badge cursor-pointer transition-all ${
                activeCategory === cat 
                  ? 'bg-[#d4af37] text-[#0a0a0a] border-[#d4af37] shadow-[2px_2px_0_#0a0a0a]' 
                  : 'bg-transparent text-[#a0a0a0] border-[#333] hover:border-[#d4af37]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Info Banner: Duración y Precios */}
      <div className="mb-6 p-3.5 bg-[#111111] border-2 border-[#333] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
        <span className="text-gray-300 flex items-center gap-1.5 font-sans">
          <Clock size={15} className="text-gold-500" />
          <strong>Duración estimada:</strong> 30 a 40 minutos en promedio por corte
        </span>
        <span className="text-gold-500 font-mono font-bold uppercase tracking-wider">
          Precios en pesos colombianos (COP)
        </span>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredServices.map(service => {
            const isSelected = selectedServices.find(s => s._id === service._id);
            return (
              <motion.div key={service._id} layout variants={item}>
                <BrutalCard 
                  variant="interactive"
                  onClick={() => onToggleService(service)}
                  className={`h-full flex flex-col ${isSelected ? 'border-[#d4af37] shadow-[4px_4px_0_#d4af37] bg-[#d4af37]/5' : ''}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 pr-2">
                      <h3 className="font-display text-lg text-white mb-1 leading-tight">{service.name}</h3>
                      {service.description && (
                        <p className="text-[#a0a0a0] text-sm line-clamp-2">{service.description}</p>
                      )}
                    </div>
                    <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center border-2 ${isSelected ? 'bg-[#d4af37] border-[#d4af37] text-[#0a0a0a]' : 'border-[#333] text-[#333]'}`}>
                      {isSelected ? <Check size={16} strokeWidth={3} /> : <Scissors size={14} className="rotate-45" />}
                    </div>
                  </div>
                  <div className="mt-auto pt-4 flex items-center justify-between border-t-2 border-dashed border-[#333]">
                    <span className="text-[#a0a0a0] text-sm flex items-center gap-1.5 font-bold uppercase tracking-wider">
                      <Clock size={14} /> {service.duration} min
                    </span>
                    <span className="text-[#d4af37] font-mono-price font-bold text-lg">
                      ${service.price.toLocaleString('es-CO')}
                    </span>
                  </div>
                </BrutalCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {selectedServices.length > 0 && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed sm:static bottom-0 left-0 right-0 p-4 sm:p-0 bg-[#0a0a0a] sm:bg-transparent border-t-2 sm:border-0 border-[#333] sm:mt-8 z-40"
          >
            <BrutalCard variant="gold" className="flex items-center justify-between py-3 px-4 sm:py-4 sm:px-6">
              <div>
                <p className="text-[#a0a0a0] font-mono-price text-xs uppercase mb-1">
                  {selectedServices.length} {selectedServices.length === 1 ? 'Servicio' : 'Servicios'} ({totalDuration} min)
                </p>
                <p className="text-[#d4af37] font-mono-price font-bold text-xl sm:text-2xl">
                  ${totalPrice.toLocaleString('es-CO')}
                </p>
              </div>
            </BrutalCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

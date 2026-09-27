import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Clock, Check } from 'lucide-react';
import BrutalCard from '../ui/BrutalCard';

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

export default function ServiceSelector({ services = [], selectedServices = [], onToggleService, isLoading }) {
  const [activeCategory, setActiveCategory] = useState('Todos');

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-400"></div>
      </div>
    );
  }

  if (!services.length) {
    return (
      <div className="text-center py-16 border border-[#222a26] rounded-[4px] bg-[#121815]">
        <Scissors size={36} className="text-[#808080] mx-auto mb-3" />
        <p className="text-[#b3b3b3] font-sans text-xs uppercase tracking-wider">No hay servicios disponibles en este momento</p>
      </div>
    );
  }

  const categories = ['Todos', ...new Set(services.map(s => s.category).filter(Boolean))];
  
  const filteredServices = activeCategory === 'Todos' 
    ? services 
    : services.filter(s => s.category === activeCategory);

  const totalDuration = selectedServices.reduce((sum, s) => sum + (s.duration || 40), 0);
  const totalPrice = selectedServices.reduce((sum, s) => sum + (s.price || 0), 0);

  return (
    <div className="pb-24 sm:pb-0">
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-[4px] text-xs uppercase tracking-wider font-sans border transition-all cursor-pointer ${
                activeCategory === cat 
                  ? 'bg-white text-[#0e1311] border-white font-semibold' 
                  : 'bg-[#121815] text-[#b3b3b3] border-[#222a26] hover:text-white hover:border-[#38443e]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Info Banner: Duración y Precios */}
      <div className="mb-6 p-4 bg-[#121815] border border-[#222a26] rounded-[4px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <span className="text-[#dfdbca] flex items-center gap-2 font-sans">
          <Clock size={14} className="text-gold-400" />
          <span><strong>Estimación:</strong> 30 a 40 minutos en promedio por corte</span>
        </span>
        <span className="text-gold-400 font-sans text-[11px] uppercase tracking-wider font-medium">
          Tarifas oficiales en pesos colombianos (COP)
        </span>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredServices.map(service => {
            const isSelected = selectedServices.find(s => s._id === service._id);
            return (
              <motion.div key={service._id} layout variants={item}>
                <div 
                  onClick={() => onToggleService(service)}
                  className={`h-full flex flex-col justify-between p-5 rounded-[4px] border transition-all duration-200 cursor-pointer ${
                    isSelected 
                      ? 'bg-[#151c18] border-gold-400/80 shadow-soft-glow' 
                      : 'bg-[#121815] border-[#222a26] hover:border-[#38443e]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <h3 className="font-serif italic text-xl text-white mb-1.5 leading-snug">
                        {service.name}
                      </h3>
                      {service.description && (
                        <p className="text-[#b3b3b3] text-xs leading-relaxed line-clamp-3">
                          {service.description}
                        </p>
                      )}
                    </div>
                    <div className={`w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-[4px] border transition-all ${
                      isSelected 
                        ? 'bg-gold-400 border-gold-400 text-[#0e1311]' 
                        : 'border-[#2b3530] text-[#808080]'
                    }`}>
                      {isSelected ? <Check size={15} strokeWidth={2.5} /> : <Scissors size={13} className="rotate-45" />}
                    </div>
                  </div>

                  <div className="mt-4 pt-3.5 flex items-center justify-between border-t border-[#1f2723]">
                    <span className="text-[#808080] text-xs flex items-center gap-1.5 font-sans">
                      <Clock size={12} className="text-gold-400" /> {service.duration} min
                    </span>
                    <span className="price-pill text-xs">
                      ${service.price.toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {selectedServices.length > 0 && (
          <motion.div 
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed sm:static bottom-0 left-0 right-0 p-4 sm:p-0 bg-[#0e1311] sm:bg-transparent border-t sm:border-0 border-[#1f2723] sm:mt-8 z-40"
          >
            <div className="bg-[#121815] border border-gold-400/40 rounded-[4px] flex items-center justify-between py-3.5 px-5 shadow-lg">
              <div>
                <p className="text-[#b3b3b3] font-sans text-xs uppercase tracking-wider mb-0.5">
                  {selectedServices.length} {selectedServices.length === 1 ? 'Servicio seleccionado' : 'Servicios seleccionados'} · {totalDuration} min
                </p>
                <p className="font-serif italic text-white text-xl">
                  {selectedServices.map(s => s.name).join(' + ')}
                </p>
              </div>
              <span className="price-pill text-sm font-semibold">
                Total: ${totalPrice.toLocaleString('es-CO')} COP
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Clock, Check } from 'lucide-react';
import BrutalCard from '../ui/BrutalCard';

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

export default function ServiceSelector({ services = [], selectedServices = [], onToggleService, isLoading }) {
  const [activeCategory, setActiveCategory] = useState('Todos');

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border border-white border-t-transparent"></div>
      </div>
    );
  }

  if (!services.length) {
    return (
      <div className="text-center py-16 border border-[#1e1e1e] rounded-none bg-[#0a0a0a]">
        <Scissors size={32} className="text-[#666666] mx-auto mb-3" />
        <p className="text-[#888888] font-sans text-xs uppercase tracking-[0.16em]">No hay servicios disponibles en este momento</p>
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
              className={`px-3.5 py-1.5 rounded-none text-xs uppercase tracking-[0.16em] font-sans border transition-all cursor-pointer ${
                activeCategory === cat 
                  ? 'bg-white text-black border-white font-medium' 
                  : 'bg-[#141414] text-[#888888] border-[#222222] hover:text-white hover:border-white/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Info Banner: Duración y Precios */}
      <div className="mb-6 p-4 bg-[#0a0a0a] border border-[#1e1e1e] rounded-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <span className="text-[#d4d4d4] flex items-center gap-2 font-sans">
          <Clock size={14} className="text-white" />
          <span><strong>Estimación:</strong> 30 a 40 minutos en promedio por corte</span>
        </span>
        <span className="text-gold-400 font-mono text-[11px] uppercase tracking-wider font-medium">
          Tarifas en pesos colombianos (COP)
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
                  className={`h-full flex flex-col justify-between p-5 rounded-none border transition-all duration-200 cursor-pointer ${
                    isSelected 
                      ? 'bg-[#141414] border-white shadow-sm' 
                      : 'bg-[#0a0a0a] border-[#1e1e1e] hover:border-[#333333]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <h3 className="font-sans font-medium uppercase tracking-[0.14em] text-sm sm:text-base text-white mb-1.5 leading-snug">
                        {service.name}
                      </h3>
                      <p className="text-[#888888] text-xs leading-relaxed line-clamp-3 font-sans">
                        {service.description}
                      </p>
                    </div>
                    <div className={`w-5 h-5 flex-shrink-0 border flex items-center justify-center transition-colors rounded-none ${
                      isSelected 
                        ? 'bg-white border-white text-black' 
                        : 'border-[#2e2e2e] bg-[#141414]'
                    }`}>
                      {isSelected && <Check size={12} strokeWidth={3} />}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#1e1e1e] flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1.5 text-xs text-[#888888] font-mono">
                      <Clock size={12} className="text-white" />
                      <span>{service.duration || 40} min</span>
                    </div>
                    <span className="font-mono text-sm font-medium text-white">
                      ${service.price?.toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Floating Bottom bar on mobile summary */}
      {selectedServices.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-[#0a0a0a] border-t border-[#1e1e1e] p-4 flex items-center justify-between z-30">
          <div>
            <div className="text-[10px] text-[#888888] uppercase tracking-wider font-sans">
              {selectedServices.length} {selectedServices.length === 1 ? 'servicio' : 'servicios'} • {totalDuration} min
            </div>
            <div className="text-base font-mono font-medium text-white">
              ${totalPrice.toLocaleString('es-CO')}
            </div>
          </div>
          <span className="text-xs font-mono uppercase tracking-wider text-white">
            Seleccionado
          </span>
        </div>
      )}
    </div>
  );
}

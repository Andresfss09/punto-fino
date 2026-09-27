import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Clock, Check } from 'lucide-react';

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
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      </div>
    );
  }

  if (!services.length) {
    return (
      <div className="text-center py-16 border border-[#222222] rounded-none bg-[#111111]">
        <Scissors size={32} className="text-[#666666] mx-auto mb-3" />
        <p className="text-[#888888] font-display text-xs uppercase tracking-[2px]">No hay servicios disponibles en este momento</p>
      </div>
    );
  }

  const categories = ['Todos', ...new Set(services.map(s => s.category).filter(Boolean))];
  
  const filteredServices = activeCategory === 'Todos' 
    ? services 
    : services.filter(s => s.category === activeCategory);

  const totalDuration = selectedServices.reduce((sum, s) => sum + (s.duration || 35), 0);
  const totalPrice = selectedServices.reduce((sum, s) => sum + (s.price || 0), 0);

  return (
    <div className="pb-10 sm:pb-0">
      {/* Category Pills */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-[11px] font-display uppercase tracking-[2px] rounded-none border transition-all cursor-pointer ${
                activeCategory === cat 
                  ? 'bg-white text-black border-white font-medium' 
                  : 'bg-[#111111] text-[#888888] border-[#262626] hover:text-white hover:border-[#444444]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Info Bar */}
      <div className="mb-6 p-4 bg-[#111111] border border-[#222222] rounded-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <span className="text-[#aaaaaa] flex items-center gap-2 font-sans">
          <Clock size={14} className="text-white/80" />
          <span>Atención meticulosa · 35 a 60 minutos por experiencia</span>
        </span>
        <span className="text-[#888888] font-display text-[10px] uppercase tracking-[2px]">
          Tarifas oficiales en pesos colombianos (COP)
        </span>
      </div>

      {/* Services Grid */}
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
                <div 
                  onClick={() => onToggleService(service)}
                  className={`h-full flex flex-col justify-between p-5 rounded-none border transition-all duration-200 cursor-pointer ${
                    isSelected 
                      ? 'bg-[#181818] border-white shadow-none' 
                      : 'bg-[#111111] border-[#262626] hover:border-[#444444]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <h3 className="font-display font-medium text-sm text-white mb-1.5 uppercase tracking-[1px] leading-snug">
                        {service.name}
                      </h3>
                      <p className="font-sans text-xs text-[#888888] leading-relaxed line-clamp-3">
                        {service.description}
                      </p>
                    </div>

                    {/* Square Checkbox Indicator */}
                    <div className={`w-5 h-5 border flex items-center justify-center rounded-none shrink-0 transition-colors ${
                      isSelected 
                        ? 'bg-white border-white text-black' 
                        : 'border-[#444444] bg-transparent text-transparent'
                    }`}>
                      <Check size={13} strokeWidth={3} />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#222222] flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1.5 text-xs text-[#888888]">
                      <Clock size={12} />
                      <span className="font-mono text-[11px]">{service.duration} MIN</span>
                    </div>

                    <span className="font-mono text-sm text-white font-medium">
                      ${service.price.toLocaleString('es-CO')} <span className="text-[10px] text-[#888888]">COP</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

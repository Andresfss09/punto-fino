import React from 'react';
import { ShoppingBag, Check, Plus } from 'lucide-react';

const BEVERAGES = [
  {
    id: 'jugo-hit',
    initials: 'JH',
    category: 'NEVERA',
    name: 'JUGO HIT',
    price: 5000,
    available: true,
  },
  {
    id: 'cerveza-aguila',
    initials: 'CA',
    category: 'NEVERA',
    name: 'CERVEZA AGUILA LATON',
    price: 6000,
    available: true,
  },
  {
    id: 'agua',
    initials: 'AG',
    category: 'NEVERA',
    name: 'AGUA',
    price: 3000,
    available: true,
  },
];

export default function BeveragesSection({ onSelectBeverage }) {
  const handleAdd = (bev) => {
    if (onSelectBeverage) {
      onSelectBeverage(bev);
    }
    const el = document.getElementById('reservar');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="bebidas" className="py-16 sm:py-20 bg-[#0e1311] border-b border-[#1f2723]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Container styled like Weibook Punto Fino */}
        <div className="bg-[#121815] border border-[#1f2723] rounded-[8px] p-6 sm:p-8 shadow-subtle">
          
          {/* Header */}
          <div className="flex items-start gap-4 mb-8">
            <div className="w-12 h-12 rounded-[6px] bg-[#161d19] border border-[#26302a] flex items-center justify-center shrink-0 text-gold-400 shadow-sm">
              <ShoppingBag size={22} />
            </div>
            <div>
              <h3 className="font-serif italic text-2xl sm:text-3xl text-gold-400 font-normal leading-tight">
                Lo que usamos contigo
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#8e9b94] mt-1">
                Añádelos a tu reserva y recógelos en tu cita
              </p>
            </div>
          </div>

          {/* Beverages Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {BEVERAGES.map((bev) => (
              <div
                key={bev.id}
                className="bg-[#161d19]/80 border border-[#222a26] hover:border-gold-400/40 rounded-[6px] p-4 flex flex-col justify-between transition-all duration-200 group"
              >
                {/* Initials Placeholder Box */}
                <div className="w-full aspect-[4/3] bg-[#0e1311] border border-[#222a26] rounded-[4px] flex items-center justify-center mb-4 group-hover:border-gold-400/30 transition-colors">
                  <span className="font-serif italic text-4xl sm:text-5xl font-bold text-white tracking-widest">
                    {bev.initials}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1 mb-4">
                  <span className="font-sans text-[10px] uppercase tracking-widest text-[#8e9b94] font-medium block">
                    {bev.category}
                  </span>
                  <h4 className="font-serif italic text-lg sm:text-xl text-gold-400 font-normal leading-snug">
                    {bev.name}
                  </h4>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-mono font-bold text-base text-gold-400">
                      ${bev.price.toLocaleString('es-CO')}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[10px] font-sans font-medium uppercase tracking-wider bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Disponible
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  type="button"
                  onClick={() => handleAdd(bev)}
                  className="w-full bg-gold-400 hover:bg-gold-300 text-[#0e1311] font-sans font-semibold text-xs tracking-wider uppercase py-2.5 rounded-[4px] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-[0.98]"
                >
                  <Plus size={14} strokeWidth={2.5} />
                  <span>Agregar</span>
                </button>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}

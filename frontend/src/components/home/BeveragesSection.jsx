import React from 'react';
import { ShoppingBag, Plus } from 'lucide-react';

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
    <section id="bebidas" className="py-16 sm:py-20 bg-[#000000] border-b border-[#1e1e1e] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Container */}
        <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-none p-6 sm:p-8">
          
          {/* Header */}
          <div className="flex items-start gap-4 mb-8">
            <div className="w-10 h-10 rounded-none bg-black border border-[#262626] flex items-center justify-center shrink-0 text-white">
              <ShoppingBag size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-1.5 h-1.5 bg-[#cfa53b]"></span>
                <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-[#cfa53b] font-medium">
                  02 · BEBIDAS FRÍAS
                </span>
              </div>
              <h3 className="font-sans uppercase text-xl sm:text-2xl text-white font-medium tracking-[0.16em] leading-tight">
                Bebidas & Refrescos
              </h3>
              <p className="font-sans text-xs text-[#aaaaaa] mt-1">
                Acompaña tu corte con una bebida bien fría mientras te atendemos en la barbería.
              </p>
            </div>
          </div>

          {/* Beverages Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {BEVERAGES.map((bev) => (
              <div
                key={bev.id}
                className="bg-black border border-[#1e1e1e] hover:border-[#383838] rounded-none p-5 flex flex-col justify-between transition-all duration-150 group"
              >
                {/* Initials Placeholder Box */}
                <div className="w-full aspect-[4/3] bg-[#0a0a0a] border border-[#1e1e1e] rounded-none flex items-center justify-center mb-4 group-hover:border-[#383838] transition-colors">
                  <span className="font-mono text-3xl sm:text-4xl font-normal text-white tracking-[0.2em]">
                    {bev.initials}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1 mb-4">
                  <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#888888] font-normal block">
                    {bev.category}
                  </span>
                  <h4 className="font-sans uppercase text-sm sm:text-base text-white font-medium tracking-[0.12em] leading-snug">
                    {bev.name}
                  </h4>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-mono font-medium text-sm text-white">
                      ${bev.price.toLocaleString('es-CO')} COP
                    </span>
                    <span className="px-2 py-0.5 rounded-none text-[9px] font-sans font-medium uppercase tracking-[0.2em] bg-white/5 text-[#888888] border border-[#262626]">
                      Disponible
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  type="button"
                  onClick={() => handleAdd(bev)}
                  className="w-full bg-transparent hover:bg-white text-white hover:text-black border border-[#333333] hover:border-white font-sans font-medium text-xs tracking-[0.2em] uppercase py-2.5 rounded-none transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  <Plus size={13} strokeWidth={2} />
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

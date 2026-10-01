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
    <section id="bebidas" className="py-20 sm:py-28 bg-[#000000] border-b border-[#1e1e1e] scroll-mt-24">
      <div className="max-w-[1600px] w-full mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* Container */}
        <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-none p-8 sm:p-12 shadow-xl">
          
          {/* Header */}
          <div className="flex items-start gap-4 mb-10 border-b border-[#1e1e1e] pb-6">
            <div className="w-12 h-12 rounded-none bg-black border border-[#2e2e2e] flex items-center justify-center shrink-0 text-white shadow-inner">
              <ShoppingBag size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="w-2.5 h-2.5 bg-[#cfa53b]"></span>
                <span className="font-sans text-xs sm:text-sm uppercase tracking-[0.26em] text-[#cfa53b] font-bold">
                  02 · BEBIDAS FRÍAS
                </span>
              </div>
              <h3 className="font-sans uppercase text-2xl sm:text-3xl lg:text-4xl text-white font-bold tracking-[0.06em] leading-tight">
                Bebidas & Refrescos
              </h3>
              <p className="font-sans text-sm sm:text-base text-[#aaaaaa] mt-2">
                Acompaña tu corte con una bebida bien fría mientras te atendemos en la barbería.
              </p>
            </div>
          </div>

          {/* Beverages Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {BEVERAGES.map((bev) => (
              <div
                key={bev.id}
                className="bg-black border border-[#1e1e1e] hover:border-[#383838] rounded-none p-6 flex flex-col justify-between transition-all duration-150 group shadow-lg"
              >
                {/* Initials Placeholder Box */}
                <div className="w-full aspect-[4/3] bg-[#0a0a0a] border border-[#1e1e1e] rounded-none flex items-center justify-center mb-5 group-hover:border-[#383838] transition-colors">
                  <span className="font-mono text-4xl sm:text-5xl font-medium text-white tracking-[0.2em]">
                    {bev.initials}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1.5 mb-5">
                  <span className="font-sans text-xs uppercase tracking-[0.2em] text-[#888888] font-medium block">
                    {bev.category}
                  </span>
                  <h4 className="font-sans uppercase text-base sm:text-lg text-white font-bold tracking-[0.08em] leading-snug">
                    {bev.name}
                  </h4>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-mono font-bold text-base sm:text-lg text-white">
                      ${bev.price.toLocaleString('es-CO')} COP
                    </span>
                    <span className="px-2.5 py-1 rounded-none text-xs font-sans font-bold uppercase tracking-[0.16em] bg-white/5 text-[#cccccc] border border-[#2e2e2e]">
                      Disponible
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  type="button"
                  onClick={() => handleAdd(bev)}
                  className="w-full bg-transparent hover:bg-white text-white hover:text-black border border-[#333333] hover:border-white font-sans font-bold text-xs sm:text-sm tracking-[0.18em] uppercase py-3 rounded-none transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  <Plus size={15} strokeWidth={2.5} />
                  <span>Agregar a Cita</span>
                </button>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}

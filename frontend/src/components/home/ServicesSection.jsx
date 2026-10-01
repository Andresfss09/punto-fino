import React, { useState } from 'react';
import { Clock, ArrowRight } from 'lucide-react';

const CATEGORIES = ['Todos', 'Combos', 'Cortes', 'Barba & Cejas'];

const SERVICES = [
  {
    id: 1,
    name: 'COMBO COMPLETO TRIADIX (CORTE + BARBA + FACIAL)',
    badge: 'EL MÁS COMPLETO',
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80',
    desc: 'El servicio más completo de Triadix: corte de cabello a tu gusto, arreglo y perfilado de barba a navaja, toalla caliente, exfoliación facial suave y mascarilla refrescante.',
    price: 55000,
    time: 60,
    cat: 'Combos',
    highlight: true,
  },
  {
    id: 2,
    name: 'CORTE DE CABELLO + ARREGLO DE BARBA',
    badge: 'EL FAVORITO',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80',
    desc: 'La combinación perfecta: corte de cabello con degradado fade o clásico, lavado capilar, toalla tibia, afeitado y perfilado de barba a navaja con aceites hidratantes.',
    price: 34000,
    time: 45,
    cat: 'Combos',
  },
  {
    id: 3,
    name: 'CORTE DE CABELLO + CEJAS',
    badge: 'CORTE & ESTILO',
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
    desc: 'Corte moderno o clásico según tu estilo, perfilado limpio de cejas a navaja, lavado capilar revitalizante y peinado con producto profesional.',
    price: 24000,
    time: 35,
    cat: 'Cortes',
  },
  {
    id: 4,
    name: 'ARREGLO Y PERFILADO DE BARBA',
    badge: 'BARBA & NAVAJA',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    desc: 'Delineado y arreglo de barba con navaja tradicional, toalla caliente para abrir los poros, y aceites nutritivos para un afeitado suave sin irritación.',
    price: 12000,
    time: 20,
    cat: 'Barba & Cejas',
  },
  {
    id: 5,
    name: 'PERFILADO Y LIMPIEZA DE CEJAS',
    badge: 'DETALLE RÁPIDO',
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80',
    desc: 'Limpieza y perfilado de cejas con navaja y tijera para un acabado pulido, natural y bien definido.',
    price: 5000,
    time: 10,
    cat: 'Barba & Cejas',
  },
];

export default function ServicesSection() {
  const [activeCat, setActiveCat] = useState('Todos');

  const filtered = activeCat === 'Todos' ? SERVICES : SERVICES.filter(s => s.cat === activeCat);

  return (
    <section id="servicios" className="py-24 sm:py-32 bg-[#000000] border-b border-[#1e1e1e] scroll-mt-24">
      <div className="max-w-[1600px] w-full mx-auto px-6 sm:px-10 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#1e1e1e] pb-8 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-2.5 h-2.5 bg-[#cfa53b]"></span>
              <span className="font-sans text-xs sm:text-sm uppercase tracking-[0.26em] text-[#cfa53b] font-bold">
                01 · PRECIOS Y SERVICIOS
              </span>
            </div>
            <h2 className="font-sans uppercase text-4xl sm:text-5xl lg:text-6xl text-white font-black tracking-normal sm:tracking-[0.02em] leading-tight">
              Cortes & Servicios
            </h2>
          </div>
          <p className="font-sans text-sm sm:text-base text-[#aaaaaa] max-w-lg mt-4 md:mt-0 leading-relaxed">
            Cortes modernos, degradados limpios, afeitado a navaja y el mejor ambiente de barbería en Cali.
          </p>
        </div>

        {/* Category Filters (Square Corners) */}
        <div className="flex flex-wrap gap-2.5 mb-12">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-5 py-2.5 text-xs sm:text-[13px] uppercase tracking-[0.16em] font-sans rounded-none border transition-all cursor-pointer ${
                activeCat === cat
                  ? 'bg-white text-black border-white font-bold shadow-md'
                  : 'bg-[#0d0d0d] text-[#888888] border-[#222222] hover:text-white hover:border-[#444444]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid (Card-Model style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(service => (
            <article
              key={service.id}
              className={`bg-[#0d0d0d] border rounded-none overflow-hidden flex flex-col justify-between transition-all duration-200 group ${
                service.highlight
                  ? 'border-white/50 shadow-xl'
                  : 'border-[#1e1e1e] hover:border-[#444444]'
              }`}
            >
              {/* Cover Photograph */}
              <div className="relative aspect-[16/10] overflow-hidden bg-black">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.05] group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent opacity-80" />

                {/* Badge Top Left */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1.5 text-xs font-sans font-bold uppercase tracking-[0.18em] rounded-none bg-black/85 text-white border border-[#333333]">
                    {service.badge}
                  </span>
                </div>

                {/* Duration Badge Bottom Right */}
                <div className="absolute bottom-4 right-4 z-10 bg-black/85 border border-[#222222] px-3 py-1.5 rounded-none flex items-center gap-1.5 text-xs font-mono text-[#cccccc]">
                  <Clock size={13} className="text-[#888888]" />
                  <span>{service.time} min</span>
                </div>
              </div>

              {/* Service Details */}
              <div className="p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-sans uppercase text-lg sm:text-xl text-white font-bold tracking-[0.06em] group-hover:text-[#cfa53b] transition-colors leading-snug mb-3">
                    {service.name}
                  </h3>
                  <p className="font-sans text-sm text-[#999999] leading-relaxed mb-6 font-normal">
                    {service.desc}
                  </p>
                </div>

                {/* Price and CTA */}
                <div className="pt-5 border-t border-[#1e1e1e] flex items-center justify-between">
                  <div className="font-mono font-bold text-xl sm:text-2xl text-white">
                    ${service.price.toLocaleString('es-CO')}
                    <span className="font-sans text-[11px] text-[#666666] uppercase tracking-wider block font-normal">
                      COP
                    </span>
                  </div>

                  <a
                    href="#reservar"
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById('reservar');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 bg-transparent hover:bg-white text-white hover:text-black border border-[#333333] hover:border-white font-sans text-xs sm:text-[13px] uppercase tracking-[0.16em] px-5 py-2.5 rounded-none transition-all cursor-pointer font-bold"
                  >
                    <span>Reservar</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
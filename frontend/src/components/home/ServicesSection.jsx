import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight, Sparkles, Check } from 'lucide-react';

const CATEGORIES = ['TODOS', 'EXPERIENCIAS', 'BARBA & CEJAS'];

const SERVICES = [
  {
    id: 1,
    name: 'EXPERIENCIA PLATINIUM / GOL DE ORO',
    badge: 'RITUAL SUPREMO',
    image: '/images/punto-fino-ritual.jpg',
    desc: 'Corte de autor con visagismo facial, ritual de barba completo a navaja libre, toalla caliente aromatizada, vapor de ozono y mascarilla facial purificante.',
    price: 55000,
    time: 60,
    cat: 'EXPERIENCIAS',
    highlight: true,
  },
  {
    id: 2,
    name: 'EXPERIENCIA PUNTO FINO (Corte + Cejas)',
    badge: 'FIRMA DE LA CASA',
    image: '/images/punto-fino-corte.jpg',
    desc: 'Corte personalizado con diagnóstico morfológico craneal, texturizado a tijera japonesa, lavado térmico y perfilación geométrica de cejas.',
    price: 24000,
    time: 35,
    cat: 'EXPERIENCIAS',
    highlight: false,
  },
  {
    id: 3,
    name: 'EXPERIENCIA PUNTO FINO + RITUAL DE BARBA',
    badge: 'MÁS SOLICITADO',
    image: '/images/punto-fino-vapor.jpg',
    desc: 'Combinación magistral de corte de autor y ritual tradicional de barba con toalla tibia, aceites esenciales botánicos y navaja al ras.',
    price: 34000,
    time: 45,
    cat: 'EXPERIENCIAS',
    highlight: false,
  },
  {
    id: 4,
    name: 'RITUAL DE BARBA',
    badge: 'CLÁSICO',
    image: '/images/punto-fino-vapor.jpg',
    desc: 'Alineación y diseño geométrico a navaja libre, preparación dérmica con aceites botánicos y aplicación de toalla caliente relajante.',
    price: 12000,
    time: 20,
    cat: 'BARBA & CEJAS',
    highlight: false,
  },
  {
    id: 5,
    name: 'PERFILADO DE CEJAS',
    badge: 'DETALLE',
    image: '/images/punto-fino-corte.jpg',
    desc: 'Diseño y definición limpia de cejas con navaja milimétrica para armonizar la proporción y expresión del rostro masculino.',
    price: 5000,
    time: 10,
    cat: 'BARBA & CEJAS',
    highlight: false,
  },
];

export default function ServicesSection() {
  const [activeCat, setActiveCat] = useState('TODOS');

  const filtered = activeCat === 'TODOS' 
    ? SERVICES 
    : SERVICES.filter(s => s.cat === activeCat);

  return (
    <section id="servicios" className="py-24 sm:py-32 bg-black border-b border-[#222222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header — Ferrari Typography Spec */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#222222] pb-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[11px] font-display uppercase tracking-[3px] text-[#888888] font-normal">
                CATÁLOGO OFICIAL · PUNTO FINO CALI
              </span>
              <span className="text-[#333333]">/</span>
              <span className="text-[11px] font-mono text-[#888888]">
                TARIFAS 2026 COP
              </span>
            </div>
            <h2 className="font-display font-medium text-3xl sm:text-4xl lg:text-5xl text-white uppercase tracking-[3px] leading-tight">
              EXPERIENCIAS & SERVICIOS
            </h2>
          </div>
          <p className="font-sans text-xs sm:text-sm text-[#888888] max-w-md mt-4 md:mt-0 leading-relaxed">
            Cada servicio es un proceso artesanal de diagnóstico morfológico, técnica de corte refinada y bienestar masculino con reserva confirmada.
          </p>
        </div>

        {/* Category Filters: Square-cornered tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-12">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-5 py-2.5 text-xs font-display uppercase tracking-[2px] rounded-none border transition-all cursor-pointer ${
                activeCat === cat
                  ? 'bg-white text-black border-white font-medium'
                  : 'bg-[#111111] text-[#888888] border-[#262626] hover:text-white hover:border-[#444444]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid: Ferrari Cinema Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence>
            {filtered.map((service, i) => (
              <motion.article
                key={service.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className={`bg-[#111111] border ${
                  service.highlight ? 'border-white/50' : 'border-[#222222]'
                } hover:border-white/80 rounded-none overflow-hidden flex flex-col group transition-all duration-300`}
              >
                {/* Service Photography */}
                <div className="relative aspect-[16/10] overflow-hidden bg-black">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover object-center filter brightness-[0.82] contrast-[1.05] group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-90" />
                  
                  {/* Category Badge Top Left */}
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span className="bg-black/80 backdrop-blur-sm border border-white/20 text-white text-[10px] font-display uppercase tracking-[2px] px-2.5 py-1 rounded-none font-normal">
                      {service.badge}
                    </span>
                  </div>

                  {/* Duration Badge Top Right */}
                  <div className="absolute top-3.5 right-3.5 z-10 bg-black/80 backdrop-blur-sm border border-white/20 text-[#cccccc] text-[11px] font-mono px-2.5 py-1 rounded-none flex items-center gap-1.5">
                    <Clock size={12} className="text-white/70" />
                    <span>{service.time} MIN</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div>
                    <h3 className="font-display font-medium text-base sm:text-lg text-white uppercase tracking-[1.5px] leading-snug group-hover:text-white transition-colors">
                      {service.name}
                    </h3>
                    <p className="font-sans text-xs text-[#888888] mt-2.5 leading-relaxed">
                      {service.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#222222] flex items-center justify-between gap-4">
                    {/* Price Monospace */}
                    <div className="flex flex-col">
                      <span className="text-[9px] font-display uppercase tracking-[2px] text-[#666666]">
                        TARIFA
                      </span>
                      <span className="font-mono text-base sm:text-lg text-white font-medium">
                        ${service.price.toLocaleString('es-CO')} <span className="text-xs text-[#888888]">COP</span>
                      </span>
                    </div>

                    {/* Ferrari CTA: Spaced Label + Circle Arrow */}
                    <a
                      href="#reservar"
                      className="inline-flex items-center gap-2.5 text-xs font-display uppercase tracking-[2px] text-white hover:text-white/80 transition-all cursor-pointer group/btn"
                    >
                      <span className="hidden sm:inline border-b border-transparent group-hover/btn:border-white">
                        RESERVAR
                      </span>
                      <span className="w-8 h-8 rounded-full border border-white/70 group-hover/btn:border-white group-hover/btn:bg-white group-hover/btn:text-black flex items-center justify-center text-white transition-all duration-300">
                        <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
                      </span>
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight, Sparkles } from 'lucide-react';

const CATEGORIES = ['Todos', 'Experiencias', 'Cortes', 'Barba & Cuidado'];

const SERVICES = [
  {
    id: 1,
    name: 'Experiencia White',
    badge: 'Popular',
    badgeType: 'citron', // #faf080
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=700&q=80',
    desc: 'Corte de precisión según visagismo facial, lavado capilar revitalizante, perfilación de cejas y acabado con cera mate de alta fijación.',
    price: 22000,
    time: 45,
    cat: 'Experiencias',
  },
  {
    id: 2,
    name: 'Experiencia Black',
    badge: 'Recomendada',
    badgeType: 'lichen', // #cadcac
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=700&q=80',
    desc: 'Corte de autor completo, exfoliación dérmica profunda, mascarilla negra purificante, toalla tibia y perfilado estético de barba.',
    price: 40000,
    time: 60,
    cat: 'Experiencias',
  },
  {
    id: 3,
    name: 'Experiencia Gold VIP 👑',
    badge: 'Ritual Supremo',
    badgeType: 'gold', // #cfa53b
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=700&q=80',
    desc: 'Servicio integral de lujo: Asesoría de imagen personalizada, corte milimétrico, diseño de barba a navaja libre, vaporozono y tratamiento facial hidro-nutritivo.',
    price: 75000,
    time: 90,
    cat: 'Experiencias',
    highlight: true,
  },
  {
    id: 4,
    name: 'Perfilado de Barba a Navaja',
    badge: 'Clásico',
    badgeType: 'lichen',
    image: 'https://images.unsplash.com/photo-1517832606589-7629c3395909?auto=format&fit=crop&w=700&q=80',
    desc: 'Diseño geométrico de barba, rasurado tradicional con navaja libre, toallas calientes aromatizadas y suero botánico hidratante.',
    price: 16000,
    time: 30,
    cat: 'Barba & Cuidado',
  },
  {
    id: 5,
    name: 'Corte Clásico / Fade Milimétrico',
    badge: 'Esencial',
    badgeType: 'neutral',
    image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=700&q=80',
    desc: 'Degradado limpio a navaja o corte clásico con tijera fina japonesa. Pulido milimétrico, contornos nítidos y peinado de acabado.',
    price: 20000,
    time: 40,
    cat: 'Cortes',
  },
  {
    id: 6,
    name: 'Tratamiento Facial & Vaporozono',
    badge: 'Cuidado Facial',
    badgeType: 'citron',
    image: 'https://images.unsplash.com/photo-1512290900672-1f55b91b9201?auto=format&fit=crop&w=700&q=80',
    desc: 'Terapia facial rejuvenecedora con vapor caliente, extracción suave de impurezas, exfoliante de café orgánico y mascarilla hidratante.',
    price: 25000,
    time: 35,
    cat: 'Barba & Cuidado',
  },
];

export default function ServicesSection() {
  const [activeCat, setActiveCat] = useState('Todos');

  const filtered = activeCat === 'Todos' ? SERVICES : SERVICES.filter(s => s.cat === activeCat);

  const renderBadge = (badge, type) => {
    switch (type) {
      case 'citron':
        return (
          <span className="editorial-tag bg-[#faf080] text-[#0e1311] border-transparent font-semibold">
            {badge}
          </span>
        );
      case 'lichen':
        return (
          <span className="editorial-tag bg-[#cadcac] text-[#0e1311] border-transparent font-semibold">
            {badge}
          </span>
        );
      case 'gold':
        return (
          <span className="editorial-tag bg-[#161d19] text-gold-400 border-[#cfa53b]/60 font-semibold">
            <Sparkles size={11} className="inline mr-1 text-gold-400" />
            {badge}
          </span>
        );
      default:
        return (
          <span className="editorial-tag bg-[#161d19] text-[#dfdbca] border-[#2b3530]">
            {badge}
          </span>
        );
    }
  };

  return (
    <section id="servicios" className="py-24 sm:py-32 bg-[#0e1311] border-b border-[#1f2723]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#1f2723] pb-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="editorial-tag bg-[#161d19] border-[#2b3630] text-gold-400">
                Catálogo de Servicios
              </span>
              <span className="font-sans text-[11px] uppercase tracking-wider text-[#808080]">
                Precios en COP
              </span>
            </div>
            <h2 className="font-serif italic text-4xl sm:text-5xl text-white font-normal leading-tight">
              Experiencias de Autor
            </h2>
          </div>
          <p className="font-sans text-xs sm:text-sm text-[#b3b3b3] max-w-md mt-4 md:mt-0 leading-relaxed">
            Cada servicio es un proceso artesanal de diagnóstico morfológico, técnica de corte refinada y bienestar masculino.
          </p>
        </div>

        {/* Category Filters (Refined 4px tabs) */}
        <div className="flex flex-wrap gap-2 mb-12">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-sans rounded-[4px] border transition-all cursor-pointer ${
                activeCat === cat
                  ? 'bg-white text-[#0e1311] border-white font-semibold'
                  : 'bg-[#121815] text-[#b3b3b3] border-[#222a26] hover:text-white hover:border-[#38443e]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid (Dark Product Cards with Studio Photo Upper 60% & Serif Italic Lower 40%) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence>
            {filtered.map((service, i) => (
              <motion.article
                key={service.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className={`bg-[#121815] border ${
                  service.highlight ? 'border-[#cfa53b]/50' : 'border-[#222a26]'
                } hover:border-[#cfa53b]/70 rounded-[4px] overflow-hidden flex flex-col group transition-all duration-300 shadow-subtle`}
              >
                {/* Product/Service Photography — Upper 55% with warm low-light backdrop */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#0d1210]">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.05] group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121815] via-transparent to-transparent opacity-90" />
                  
                  {/* Category / Status Badge Top Left */}
                  <div className="absolute top-3.5 left-3.5 z-10">
                    {renderBadge(service.badge, service.badgeType)}
                  </div>

                  {/* Duration Badge Top Right */}
                  <div className="absolute top-3.5 right-3.5 z-10 bg-[#0e1311]/80 backdrop-blur-sm border border-[#26302a] text-[#dfdbca] text-[11px] font-sans px-2.5 py-1 rounded-[4px] flex items-center gap-1.5">
                    <Clock size={12} className="text-gold-400" />
                    <span>{service.time} min</span>
                  </div>
                </div>

                {/* Card Lower Half: Serif Italic Title, Description, and Signature Price Pill */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif italic text-2xl text-white group-hover:text-gold-300 transition-colors leading-tight">
                      {service.name}
                    </h3>
                    <p className="font-sans text-xs text-[#b3b3b3] mt-2.5 leading-relaxed">
                      {service.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#1f2723] flex items-center justify-between gap-4">
                    {/* Linen Price Pill — Assembly Coffee Signature */}
                    <span className="price-pill">
                      ${service.price.toLocaleString('es-CO')} COP
                    </span>

                    {/* Action Typographic Link */}
                    <a
                      href="#reservar"
                      className="font-serif italic text-xs text-white hover:text-gold-400 flex items-center gap-1 underline underline-offset-4 transition-colors"
                    >
                      Reservar <ArrowRight size={13} />
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
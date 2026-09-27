import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight, Sparkles } from 'lucide-react';

const CATEGORIES = ['Todos', 'Experiencias', 'Cortes', 'Barba & Cuidado', 'Bar & Bebidas'];

const SERVICES = [
  {
    id: 1,
    name: 'Experiencia Platinium / Gol de Oro',
    badge: 'Ritual Supremo 👑',
    badgeType: 'gold', // #cfa53b
    image: 'https://s3.weibook.co/punto_fino/services/f7e3bb87-4e93-4eed-8340-1a01e6fa0ff3.webp',
    desc: 'Una experiencia integral para verse y sentirse en su mejor versión. Incluye orientación personalizada, corte de cabello, cejas, afeitado facial, exfoliación, vapor ozono frío/caliente, mascarilla para puntos negros, velo hidratante, lavado capilar, masaje relajante y bebida de cortesía (café o cerveza fría).',
    price: 55000,
    time: 60,
    cat: 'Experiencias',
    highlight: true,
  },
  {
    id: 2,
    name: 'Experiencia Punto Fino + Ritual de Barba',
    badge: 'Recomendada',
    badgeType: 'lichen', // #cadcac
    image: 'https://s3.weibook.co/punto_fino/services/241a43d5-f365-4a78-a32d-9e4ffaffb801.webp',
    desc: 'La combinación perfecta para una imagen impecable. Orientación personalizada, corte de cabello, lavado capilar y producto profesional. Además, Ritual de Barba con vapor ozono frío y caliente, exfoliación facial, suave afeitado a navaja, aceites hidratantes y café de cortesía.',
    price: 34000,
    time: 45,
    cat: 'Experiencias',
  },
  {
    id: 3,
    name: 'Experiencia Punto Fino (Corte + Cejas)',
    badge: 'Servicio Insignia',
    badgeType: 'citron', // #faf080
    image: 'https://s3.weibook.co/punto_fino/services/d9eb3738-2f6d-47bf-a98a-16135933c3f4.webp',
    desc: 'Servicio insignia de Corte y Ceja. Incluye visagismo según morfología craneal, corte milimétrico de precisión, perfilado de cejas que enmarca tu rostro, lavado capilar revitalizante y peinado con producto profesional.',
    price: 24000,
    time: 35,
    cat: 'Cortes',
  },
  {
    id: 4,
    name: 'Ritual de Barba',
    badge: 'Clásico',
    badgeType: 'lichen',
    image: 'https://s3.weibook.co/punto_fino/services/0f55ddbc-1dd2-4eb0-8978-3a50b53fffbc.webp',
    desc: 'Dale a tu barba el cuidado que merece: diseño personalizado según fisionomía, exfoliación facial, vapor ozono frío y caliente para suavizar el vello y la piel, afeitado preciso a navaja y aplicación de aceites nutritivos.',
    price: 12000,
    time: 20,
    cat: 'Barba & Cuidado',
  },
  {
    id: 5,
    name: 'Perfilado de Cejas',
    badge: 'Esencial',
    badgeType: 'neutral',
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=700&q=80',
    desc: 'Limpieza y perfilado geométrico de cejas a navaja y tijera para realzar la mirada y armonizar la simetría natural del rostro.',
    price: 5000,
    time: 10,
    cat: 'Barba & Cuidado',
  },
  {
    id: 6,
    name: 'Servicio de Bar & Café de Especialidad',
    badge: 'Cortesía Atelier ☕',
    badgeType: 'citron',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80',
    desc: 'En cada cita en Punto Fino tienes incluida una bebida de cortesía: café espresso recién molido de grano selecto, cappuccino cremoso o agua mineral purificada, servida a la temperatura ideal mientras disfrutas de tu sesión.',
    price: 0,
    time: 10,
    cat: 'Bar & Bebidas',
  },
  {
    id: 7,
    name: 'Cerveza Premium Fría & Coctelería de Bar',
    badge: 'Bar Selection 🍺',
    badgeType: 'gold',
    image: 'https://images.unsplash.com/photo-1608270116645-a75d5069f257?auto=format&fit=crop&w=700&q=80',
    desc: 'Acompaña tu corte con una cerveza premium bien fría (Corona, Heineken, Stella Artois, Club Colombia) o trago de autor on the rocks servido en vaso de cristal. Incluida en la Experiencia Platinium o disponible a la carta.',
    price: 8000,
    time: 10,
    cat: 'Bar & Bebidas',
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
import React, { useState } from 'react';
import { Clock, ArrowRight, Sparkles } from 'lucide-react';

const CATEGORIES = ['Todos', 'Experiencias', 'Cortes', 'Barba & Cuidado'];

const SERVICES = [
  {
    id: 1,
    name: 'Experiencia Platinium / Gol de Oro',
    badge: 'Ritual Supremo 👑',
    badgeType: 'gold',
    image: 'https://s3.weibook.co/punto_fino/services/f7e3bb87-4e93-4eed-8340-1a01e6fa0ff3.webp',
    desc: 'Una experiencia integral para verse y sentirse en su mejor versión. Incluye orientación personalizada, corte de cabello, cejas, afeitado facial, exfoliación, vapor ozono frío/caliente, mascarilla para puntos negros, velo hidratante, lavado capilar y masaje relajante.',
    price: 55000,
    time: 60,
    cat: 'Experiencias',
    highlight: true,
  },
  {
    id: 2,
    name: 'Experiencia Punto Fino + Ritual de Barba',
    badge: 'Recomendada',
    badgeType: 'lichen',
    image: 'https://s3.weibook.co/punto_fino/services/241a43d5-f365-4a78-a32d-9e4ffaffb801.webp',
    desc: 'La combinación perfecta para una imagen impecable. Orientación personalizada, corte de cabello, lavado capilar y producto profesional. Además, Ritual de Barba con vapor ozono frío y caliente, exfoliación facial, suave afeitado a navaja y aceites hidratantes.',
    price: 34000,
    time: 45,
    cat: 'Experiencias',
  },
  {
    id: 3,
    name: 'Experiencia Punto Fino (Corte + Cejas)',
    badge: 'Servicio Insignia',
    badgeType: 'citron',
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
    <section id="servicios" className="py-20 sm:py-28 bg-[#0e1311] border-b border-[#1f2723]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#1f2723] pb-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="editorial-tag bg-[#161d19] border-[#2b3630] text-gold-400">
                Catálogo de Servicios
              </span>
              <span className="font-sans text-[11px] uppercase tracking-wider text-[#8e9b94]">
                Tarifas Oficiales COP
              </span>
            </div>
            <h2 className="font-serif italic text-4xl sm:text-5xl text-white font-normal leading-tight">
              Experiencias de Autor
            </h2>
          </div>
          <p className="font-sans text-xs sm:text-sm text-[#8e9b94] max-w-md mt-4 md:mt-0 leading-relaxed">
            Cada corte es un proceso de visagismo morfológico, técnica de corte milimétrica y atención personalizada en Cali.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-sans rounded-[4px] border transition-all cursor-pointer ${
                activeCat === cat
                  ? 'bg-gold-400 text-[#0e1311] border-gold-400 font-semibold shadow-sm'
                  : 'bg-[#121815] text-[#b3b3b3] border-[#222a26] hover:text-white hover:border-[#38443e]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(service => (
            <article
              key={service.id}
              className={`bg-[#121815] border rounded-[4px] overflow-hidden flex flex-col justify-between transition-all duration-300 group ${
                service.highlight
                  ? 'border-gold-400/50 shadow-[0_4px_24px_rgba(207,165,59,0.08)]'
                  : 'border-[#1f2723] hover:border-[#2b3530]'
              }`}
            >
              {/* Service Cover Photograph */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#0d1210]">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover object-center filter brightness-[0.9] contrast-[1.05] group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121815] via-transparent to-transparent opacity-80" />

                {/* Badge Top Left */}
                <div className="absolute top-3 left-3 z-10">
                  {renderBadge(service.badge, service.badgeType)}
                </div>

                {/* Duration Badge Bottom Right */}
                <div className="absolute bottom-3 right-3 z-10 bg-[#0e1311]/90 backdrop-blur-sm border border-[#2b3530] px-2.5 py-1 rounded-[4px] flex items-center gap-1.5 text-xs font-mono text-[#dfdbca]">
                  <Clock size={12} className="text-gold-400" />
                  <span>{service.time} min</span>
                </div>
              </div>

              {/* Service Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif italic text-2xl text-white font-normal group-hover:text-gold-300 transition-colors leading-snug mb-3">
                    {service.name}
                  </h3>
                  <p className="font-sans text-xs text-[#8e9b94] leading-relaxed mb-6">
                    {service.desc}
                  </p>
                </div>

                {/* Price and CTA */}
                <div className="pt-4 border-t border-[#1f2723] flex items-center justify-between">
                  <div className="font-mono font-bold text-xl text-gold-400">
                    ${service.price.toLocaleString('es-CO')}
                    <span className="font-sans text-[10px] text-[#8e9b94] uppercase tracking-wider block font-normal">
                      COP
                    </span>
                  </div>

                  <a
                    href="#reservar"
                    className="inline-flex items-center gap-1.5 bg-[#161d19] hover:bg-gold-400 hover:text-[#0e1311] text-[#dfdbca] border border-[#2b3530] hover:border-gold-400 font-sans text-xs uppercase tracking-wider px-4 py-2.5 rounded-[4px] transition-all cursor-pointer font-medium"
                  >
                    <span>Reservar</span>
                    <ArrowRight size={13} />
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
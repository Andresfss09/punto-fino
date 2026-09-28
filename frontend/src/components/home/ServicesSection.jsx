import React, { useState } from 'react';
import { Clock, ArrowRight } from 'lucide-react';

const CATEGORIES = ['Todos', 'Experiencias', 'Cortes', 'Barba & Cuidado'];

const SERVICES = [
  {
    id: 1,
    name: 'EXPERIENCIA PLATINIUM / GOL DE ORO',
    badge: 'RITUAL SUPREMO',
    image: 'https://s3.weibook.co/punto_fino/services/f7e3bb87-4e93-4eed-8340-1a01e6fa0ff3.webp',
    desc: 'Una experiencia integral para verse y sentirse en su mejor versión. Incluye orientación personalizada, corte de cabello, cejas, afeitado facial, exfoliación, vapor ozono frío/caliente, mascarilla para puntos negros, velo hidratante, lavado capilar y masaje relajante.',
    price: 55000,
    time: 60,
    cat: 'Experiencias',
    highlight: true,
  },
  {
    id: 2,
    name: 'EXPERIENCIA PUNTO FINO + RITUAL DE BARBA',
    badge: 'RECOMENDADA',
    image: 'https://s3.weibook.co/punto_fino/services/241a43d5-f365-4a78-a32d-9e4ffaffb801.webp',
    desc: 'La combinación perfecta para una imagen impecable. Orientación personalizada, corte de cabello, lavado capilar y producto profesional. Además, Ritual de Barba con vapor ozono frío y caliente, exfoliación facial, suave afeitado a navaja y aceites hidratantes.',
    price: 34000,
    time: 45,
    cat: 'Experiencias',
  },
  {
    id: 3,
    name: 'EXPERIENCIA PUNTO FINO (CORTE + CEJAS)',
    badge: 'SERVICIO INSIGNIA',
    image: 'https://s3.weibook.co/punto_fino/services/d9eb3738-2f6d-47bf-a98a-16135933c3f4.webp',
    desc: 'Servicio insignia de Corte y Ceja. Incluye visagismo según morfología craneal, corte milimétrico de precisión, perfilado de cejas que enmarca tu rostro, lavado capilar revitalizante y peinado con producto profesional.',
    price: 24000,
    time: 35,
    cat: 'Cortes',
  },
  {
    id: 4,
    name: 'RITUAL DE BARBA',
    badge: 'CLÁSICO',
    image: 'https://s3.weibook.co/punto_fino/services/0f55ddbc-1dd2-4eb0-8978-3a50b53fffbc.webp',
    desc: 'Dale a tu barba el cuidado que merece: diseño personalizado según fisionomía, exfoliación facial, vapor ozono frío y caliente para suavizar el vello y la piel, afeitado preciso a navaja y aplicación de aceites nutritivos.',
    price: 12000,
    time: 20,
    cat: 'Barba & Cuidado',
  },
  {
    id: 5,
    name: 'PERFILADO DE CEJAS',
    badge: 'ESENCIAL',
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

  return (
    <section id="servicios" className="py-20 sm:py-28 bg-[#000000] border-b border-[#1e1e1e] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#1e1e1e] pb-8 mb-10">
          <div>
            <span className="font-sans text-[11px] uppercase tracking-[0.28em] text-[#888888] block mb-2">
              CATÁLOGO DE SERVICIOS — TARIFAS OFICIALES COP
            </span>
            <h2 className="font-sans uppercase text-3xl sm:text-4xl lg:text-5xl text-white font-medium tracking-[0.16em] leading-tight">
              Experiencias de Autor
            </h2>
          </div>
          <p className="font-sans text-xs sm:text-sm text-[#888888] max-w-md mt-4 md:mt-0 leading-relaxed">
            Cada servicio es un proceso artesanal de diagnóstico morfológico, técnica de corte refinada y bienestar masculino.
          </p>
        </div>

        {/* Category Filters (Square Corners) */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-4 py-2 text-xs uppercase tracking-[0.2em] font-sans rounded-none border transition-all cursor-pointer ${
                activeCat === cat
                  ? 'bg-white text-black border-white font-medium shadow-sm'
                  : 'bg-[#0d0d0d] text-[#888888] border-[#222222] hover:text-white hover:border-[#444444]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid (Card-Model style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(service => (
            <article
              key={service.id}
              className={`bg-[#0d0d0d] border rounded-none overflow-hidden flex flex-col justify-between transition-all duration-200 group ${
                service.highlight
                  ? 'border-white/40'
                  : 'border-[#1e1e1e] hover:border-[#383838]'
              }`}
            >
              {/* Cover Photograph */}
              <div className="relative aspect-[16/10] overflow-hidden bg-black">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.05] group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent opacity-80" />

                {/* Badge Top Left */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-1 text-[10px] font-sans font-medium uppercase tracking-[0.2em] rounded-none bg-black/80 text-white border border-[#333333]">
                    {service.badge}
                  </span>
                </div>

                {/* Duration Badge Bottom Right */}
                <div className="absolute bottom-3 right-3 z-10 bg-black/80 border border-[#222222] px-2.5 py-1 rounded-none flex items-center gap-1.5 text-xs font-mono text-[#cccccc]">
                  <Clock size={11} className="text-[#888888]" />
                  <span>{service.time} min</span>
                </div>
              </div>

              {/* Service Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-sans uppercase text-base sm:text-lg text-white font-medium tracking-[0.12em] group-hover:text-[#cfa53b] transition-colors leading-snug mb-3">
                    {service.name}
                  </h3>
                  <p className="font-sans text-xs text-[#888888] leading-relaxed mb-6">
                    {service.desc}
                  </p>
                </div>

                {/* Price and CTA */}
                <div className="pt-4 border-t border-[#1e1e1e] flex items-center justify-between">
                  <div className="font-mono font-medium text-lg text-white">
                    ${service.price.toLocaleString('es-CO')}
                    <span className="font-sans text-[10px] text-[#666666] uppercase tracking-wider block font-normal">
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
                    className="inline-flex items-center gap-2 bg-transparent hover:bg-white text-white hover:text-black border border-[#333333] hover:border-white font-sans text-xs uppercase tracking-[0.2em] px-4 py-2 rounded-none transition-all cursor-pointer font-medium"
                  >
                    <span>Reservar</span>
                    <ArrowRight size={12} />
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
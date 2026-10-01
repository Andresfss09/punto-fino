import React, { useState } from 'react';
import { Clock, ArrowRight } from 'lucide-react';

const CATEGORIES = ['Todos', 'Experiencias', 'Cortes', 'Barba & Cuidado'];

const SERVICES = [
  {
    id: 1,
    name: 'EXPERIENCIA PLATINIUM / TRIADIX SIGNATURE',
    badge: 'RITUAL SUPREMO',
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80',
    desc: 'La experiencia cumbre de Triadix: diagnóstico morfológico, corte de precisión, perfilado de cejas, afeitado a navaja, exfoliación, vapor ozono dual, mascarilla purificante, velo hidratante y masaje craneofacial relajante.',
    price: 55000,
    time: 60,
    cat: 'Experiencias',
    highlight: true,
  },
  {
    id: 2,
    name: 'EXPERIENCIA TRIADIX + RITUAL DE BARBA',
    badge: 'RECOMENDADA',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80',
    desc: 'La combinación de alto impacto: corte de autor con visagismo, lavado capilar y Ritual de Barba con vapor ozono, exfoliación dérmica, afeitado a navaja libre y aceites botánicos esenciales.',
    price: 34000,
    time: 45,
    cat: 'Experiencias',
  },
  {
    id: 3,
    name: 'CORTE DE AUTOR TRIADIX (CORTE + CEJAS)',
    badge: 'SERVICIO INSIGNIA',
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
    desc: 'Corte de máxima precisión adaptado a tu estructura craneofacial, perfilado geométrico de cejas con navaja, lavado capilar revitalizante y peinado profesional.',
    price: 24000,
    time: 35,
    cat: 'Cortes',
  },
  {
    id: 4,
    name: 'RITUAL DE BARBA & VAPOR OZONO',
    badge: 'CLÁSICO',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    desc: 'Tratamiento integral de barba: diseño y delineado a navaja tradicional, exfoliación facial, vapor de ozono para dilatación de poros y nutrición con aceites botánicos.',
    price: 12000,
    time: 20,
    cat: 'Barba & Cuidado',
  },
  {
    id: 5,
    name: 'PERFILADO DE CEJAS & VISAGISMO',
    badge: 'ESENCIAL',
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80',
    desc: 'Diseño y armonización geométrica de cejas a navaja y tijera para realzar la mirada y equilibrar las proporciones naturales de tu rostro.',
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
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-[#cfa53b]"></span>
              <span className="font-sans text-[11px] uppercase tracking-[0.28em] text-[#cfa53b] font-medium">
                01 · CATÁLOGO OFICIAL TRIADIX
              </span>
            </div>
            <h2 className="font-sans uppercase text-3xl sm:text-4xl lg:text-5xl text-white font-medium tracking-[0.16em] leading-tight">
              Experiencias de Autor
            </h2>
          </div>
          <p className="font-sans text-xs sm:text-sm text-[#aaaaaa] max-w-md mt-4 md:mt-0 leading-relaxed">
            Cada servicio en Triadix combina visagismo morfológico, técnica de corte de alta precisión y bienestar masculino absoluto.
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
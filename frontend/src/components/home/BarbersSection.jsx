import React from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';

const BARBERS = [
  { 
    id: 1, 
    name: 'Andrés Felipe Sarria', 
    role: 'Barbero Profesional & Cofundador', 
    experience: '7+ AÑOS',
    rating: 4.9, 
    reviews: 24, 
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    specs: ['Degradados Fade', 'Cortes Clásicos', 'Asesoría de Estilo'],
    bio: 'Cofundador de Triadix. Especialista en cortes modernos, degradados limpios a navaja y asesoría para que salgas con el corte que mejor te luce.',
  },
  { 
    id: 2, 
    name: 'Nicolás Chávez', 
    role: 'Barbero Master & Cofundador', 
    experience: '6+ AÑOS',
    rating: 5.0, 
    reviews: 28, 
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    specs: ['Arreglo de Barba', 'Afeitado a Navaja', 'Toalla Caliente'],
    bio: 'Cofundador de Triadix. Experto en afeitado tradicional a navaja, perfilado de barba con toalla caliente y aceites hidratantes.',
  },
  { 
    id: 3, 
    name: 'Luis De Ávila', 
    role: 'Barbero Especialista & Cofundador', 
    experience: '5+ AÑOS',
    rating: 4.9, 
    reviews: 19, 
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    specs: ['Fade en Tendencia', 'Perfilado de Cejas', 'Corte a Tijera'],
    bio: 'Cofundador de Triadix. Especialista en degradados precisos, textura y movimiento con tijera y perfilado limpio de cejas.',
  },
];

export default function BarbersSection() {
  return (
    <section id="barberos" className="py-20 sm:py-28 bg-[#000000] border-b border-[#1e1e1e] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#1e1e1e] pb-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-[#cfa53b]"></span>
              <span className="font-sans text-[11px] uppercase tracking-[0.28em] text-[#cfa53b] font-medium">
                03 · NUESTROS BARBEROS
              </span>
            </div>
            <h2 className="font-sans uppercase text-3xl sm:text-4xl lg:text-5xl text-white font-medium tracking-[0.16em] leading-tight">
              Los Barberos de Triadix
            </h2>
          </div>
          <p className="font-sans text-xs sm:text-sm text-[#aaaaaa] max-w-md mt-4 md:mt-0 leading-relaxed">
            Andrés Felipe Sarria, Nicolás Chávez y Luis De Ávila. Tres barberos dedicados a brindarte un corte impecable, buena charla y la mejor atención.
          </p>
        </div>

        {/* Barbers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BARBERS.map((barber, i) => (
            <motion.div 
              key={barber.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
              viewport={{ once: true }}
              className="bg-[#0d0d0d] border border-[#1e1e1e] hover:border-[#444444] rounded-none overflow-hidden flex flex-col justify-between transition-all duration-150 group"
            >
              {/* Header with Photo / Monogram */}
              <div className="p-6 border-b border-[#1e1e1e] bg-black flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="relative w-12 h-12 rounded-none overflow-hidden border border-[#333333] group-hover:border-[#cfa53b] transition-colors shrink-0">
                    <img 
                      src={barber.image} 
                      alt={barber.name} 
                      className="w-full h-full object-cover filter brightness-90 contrast-105"
                    />
                  </div>
                  <div>
                    <h3 className="font-sans uppercase text-sm sm:text-base text-white font-medium tracking-[0.12em] leading-snug group-hover:text-[#cfa53b] transition-colors">
                      {barber.name}
                    </h3>
                    <span className="inline-block mt-0.5 px-2 py-0.5 text-[9px] font-sans font-medium uppercase tracking-[0.2em] rounded-none border border-[#222222] bg-[#0a0a0a] text-[#cfa53b]">
                      {barber.experience}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5 bg-[#0a0a0a] border border-[#222222] px-2.5 py-1 rounded-none shrink-0">
                  <Star size={11} className="text-[#cfa53b] fill-[#cfa53b]" />
                  <span className="font-mono text-xs font-medium text-white">{barber.rating}</span>
                  <span className="font-sans text-[10px] text-[#666666]">({barber.reviews})</span>
                </div>
              </div>

              {/* Information & Specialties */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#cfa53b] font-medium">
                    {barber.role}
                  </p>
                  <p className="font-sans text-xs text-[#aaaaaa] mt-2.5 leading-relaxed">
                    {barber.bio}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-[#1e1e1e]">
                  <div className="flex flex-wrap gap-1.5">
                    {barber.specs.map((spec, idx) => (
                      <span 
                        key={idx} 
                        className="px-2 py-0.5 bg-black border border-[#222222] text-[#cccccc] text-[10px] font-sans uppercase tracking-[0.14em] rounded-none"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  <a
                    href="#reservar"
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById('reservar');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full bg-transparent hover:bg-white text-white hover:text-black border border-[#333333] hover:border-white font-sans text-xs uppercase tracking-[0.2em] py-2.5 px-4 rounded-none transition-all flex items-center justify-center gap-2 cursor-pointer font-medium active:scale-[0.99]"
                  >
                    <span>Agendar con {barber.name.split(' ')[0]}</span>
                    <ArrowRight size={12} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
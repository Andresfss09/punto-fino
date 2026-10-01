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
    <section id="barberos" className="py-24 sm:py-32 bg-[#000000] border-b border-[#1e1e1e] scroll-mt-24">
      <div className="max-w-[1600px] w-full mx-auto px-6 sm:px-10 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#1e1e1e] pb-8 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-2.5 h-2.5 bg-[#cfa53b]"></span>
              <span className="font-sans text-xs sm:text-sm uppercase tracking-[0.26em] text-[#cfa53b] font-bold">
                03 · NUESTROS BARBEROS
              </span>
            </div>
            <h2 className="font-sans uppercase text-4xl sm:text-5xl lg:text-6xl text-white font-black tracking-normal sm:tracking-[0.02em] leading-tight">
              Los Barberos de Triadix
            </h2>
          </div>
          <p className="font-sans text-sm sm:text-base text-[#aaaaaa] max-w-lg mt-4 md:mt-0 leading-relaxed">
            Andrés Felipe Sarria, Nicolás Chávez y Luis De Ávila. Tres barberos dedicados a brindarte un corte impecable, buena charla y la mejor atención.
          </p>
        </div>

        {/* Barbers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BARBERS.map((barber, i) => (
            <motion.div 
              key={barber.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
              viewport={{ once: true }}
              className="bg-[#0d0d0d] border border-[#1e1e1e] hover:border-[#444444] rounded-none overflow-hidden flex flex-col justify-between transition-all duration-150 group shadow-lg"
            >
              {/* Header with Photo / Monogram */}
              <div className="p-6 sm:p-7 border-b border-[#1e1e1e] bg-black flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-none overflow-hidden border border-[#333333] group-hover:border-[#cfa53b] transition-colors shrink-0 shadow-md">
                    <img 
                      src={barber.image} 
                      alt={barber.name} 
                      className="w-full h-full object-cover filter brightness-95 contrast-105"
                    />
                  </div>
                  <div>
                    <h3 className="font-sans uppercase text-base sm:text-lg text-white font-bold tracking-[0.08em] leading-snug group-hover:text-[#cfa53b] transition-colors">
                      {barber.name}
                    </h3>
                    <span className="inline-block mt-1 px-2.5 py-0.5 text-[10px] font-sans font-bold uppercase tracking-[0.2em] rounded-none border border-[#222222] bg-[#0a0a0a] text-[#cfa53b]">
                      {barber.experience}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5 bg-[#0a0a0a] border border-[#222222] px-3 py-1.5 rounded-none shrink-0">
                  <Star size={13} className="text-[#cfa53b] fill-[#cfa53b]" />
                  <span className="font-mono text-sm font-bold text-white">{barber.rating}</span>
                  <span className="font-sans text-[11px] text-[#888888]">({barber.reviews})</span>
                </div>
              </div>

              {/* Information & Specialties */}
              <div className="p-7 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <p className="font-sans text-xs uppercase tracking-[0.2em] text-[#cfa53b] font-bold">
                    {barber.role}
                  </p>
                  <p className="font-sans text-sm text-[#cccccc] mt-3 leading-relaxed">
                    {barber.bio}
                  </p>
                </div>

                <div className="space-y-5 pt-5 border-t border-[#1e1e1e]">
                  <div className="flex flex-wrap gap-2">
                    {barber.specs.map((spec, idx) => (
                      <span 
                        key={idx} 
                        className="px-2.5 py-1 bg-black border border-[#222222] text-[#cccccc] text-xs font-sans uppercase tracking-[0.12em] rounded-none font-medium"
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
                    className="w-full bg-transparent hover:bg-white text-white hover:text-black border border-[#333333] hover:border-white font-sans text-xs sm:text-[13px] uppercase tracking-[0.16em] py-3 px-5 rounded-none transition-all flex items-center justify-center gap-2.5 cursor-pointer font-bold active:scale-[0.99]"
                  >
                    <span>Agendar con {barber.name.split(' ')[0]}</span>
                    <ArrowRight size={14} />
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
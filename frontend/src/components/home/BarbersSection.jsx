import React from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';

const BARBERS = [
  { 
    id: 1, 
    name: 'Juan David', 
    role: 'MASTER BARBER & VISAGISTA', 
    experience: '7+ AÑOS',
    rating: 4.93, 
    reviews: 58, 
    specs: ['VISAGISMO', 'CORTE DE AUTOR', 'EXP. PLATINIUM'],
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80',
    bio: 'Especialista en fisionomía craneal, degradados quirúrgicos y dirección de la Experiencia Platinium Gol de Oro.',
  },
  { 
    id: 2, 
    name: 'Juan Diego', 
    role: 'MASTER BARBER & TÉCNICO CAPILAR', 
    experience: '6+ AÑOS',
    rating: 5.0, 
    reviews: 64, 
    specs: ['RITUAL DE BARBA', 'VAPOR OZONO', 'NAVAJA LIBRE'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80',
    bio: 'Maestro de la navaja tradicional clásica, apertura de poros con vapor de ozono y cuidado botánico dérmico.',
  },
  { 
    id: 3, 
    name: 'Emanuel Torres', 
    role: 'BARBERO PROFESIONAL', 
    experience: '5+ AÑOS',
    rating: 4.9, 
    reviews: 37, 
    specs: ['FADE MILIMÉTRICO', 'PERFILADO CEJAS', 'TEXTURIZADO'],
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80',
    bio: 'Especialista en degradados limpios, perfilación milimétrica de cejas y texturizado para estilos vanguardistas.',
  },
];

export default function BarbersSection() {
  return (
    <section id="barberos" className="py-24 sm:py-32 bg-black border-b border-[#222222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#222222] pb-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[11px] font-display uppercase tracking-[3px] text-[#888888] font-normal">
                EQUIPO PROFESIONAL · PUNTO FINO CALI
              </span>
              <span className="text-[#333333]">/</span>
              <span className="text-[11px] font-display uppercase tracking-[2px] text-[#888888]">
                VILLACOLOMBIA
              </span>
            </div>
            <h2 className="font-display font-medium text-3xl sm:text-4xl lg:text-5xl text-white uppercase tracking-[3px] leading-tight">
              MAESTROS BARBEROS
            </h2>
          </div>
          <p className="font-sans text-xs sm:text-sm text-[#888888] max-w-md mt-4 md:mt-0 leading-relaxed">
            Cada profesional domina la arquitectura capilar y el visagismo para resaltar tu porte con técnica milimétrica.
          </p>
        </div>

        {/* Barbers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {BARBERS.map((barber, i) => (
            <motion.div 
              key={barber.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
              className="bg-[#111111] border border-[#222222] hover:border-white/70 rounded-none overflow-hidden flex flex-col group transition-all duration-300"
            >
              {/* Barber Portrait */}
              <div className="relative aspect-[4/3] overflow-hidden bg-black">
                <img
                  src={barber.image}
                  alt={barber.name}
                  className="w-full h-full object-cover object-top filter grayscale contrast-125 brightness-90 group-hover:scale-105 group-hover:filter-none transition-all duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-90" />
                
                {/* Rating Badge */}
                <div className="absolute bottom-3 left-4 z-10 flex items-center gap-1.5 bg-black/80 backdrop-blur-sm border border-white/20 px-2.5 py-1 rounded-none">
                  <Star size={12} className="text-white fill-white" />
                  <span className="font-mono text-xs font-semibold text-white">{barber.rating}</span>
                  <span className="text-[10px] text-[#888888] font-sans">({barber.reviews})</span>
                </div>

                <div className="absolute top-3.5 right-3.5 z-10">
                  <span className="bg-black/80 backdrop-blur-sm border border-white/20 text-white text-[10px] font-display uppercase tracking-[2px] px-2.5 py-1 rounded-none font-normal">
                    {barber.experience}
                  </span>
                </div>
              </div>

              {/* Information */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <h3 className="font-display font-medium text-lg sm:text-xl text-white uppercase tracking-[2px]">
                    {barber.name}
                  </h3>
                  <p className="font-display text-[10px] uppercase tracking-[2px] text-[#888888] mt-1">
                    {barber.role}
                  </p>
                  
                  <p className="font-sans text-xs text-[#888888] mt-3 leading-relaxed">
                    {barber.bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {barber.specs.map(spec => (
                      <span 
                        key={spec} 
                        className="px-2 py-0.5 text-[9px] font-display uppercase tracking-[1.5px] text-[#aaaaaa] bg-black border border-[#262626] rounded-none"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#222222]">
                  <a
                    href="#reservar"
                    className="w-full py-3 px-4 text-xs uppercase tracking-[2px] font-display font-medium rounded-none border border-white/40 text-white hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 group/btn cursor-pointer"
                  >
                    <span>AGENDAR CON {barber.name.split(' ')[0].toUpperCase()}</span>
                    <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
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
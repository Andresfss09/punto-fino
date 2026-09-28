import React from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';

const BARBERS = [
  { 
    id: 1, 
    name: 'Juan David', 
    role: 'Master Barber & Asesor de Imagen', 
    experience: '7+ AÑOS',
    rating: 4.9, 
    reviews: 16, 
    specs: ['Experiencia Platinium', 'Visagismo Facial', 'Degradados'],
    bio: 'Profesional en asesoría de imagen y cortes de alta precisión. Especialista en la Experiencia Platinium y técnicas modernas de visagismo.',
  },
  { 
    id: 2, 
    name: 'Juan Diego', 
    role: 'Especialista en Ritual de Barba & Corte', 
    experience: '6 AÑOS',
    rating: 5.0, 
    reviews: 16, 
    specs: ['Ritual de Barba', 'Navaja Libre', 'Vapor Ozono'],
    bio: 'Maestro en el cuidado integral de la barba, perfilado a navaja tradicional y diseño de barba con vapor ozono y aceites botánicos.',
  },
  { 
    id: 3, 
    name: 'Emanuel Torres', 
    role: 'Especialista en Tendencia & Textura', 
    experience: '5 AÑOS',
    rating: 4.9, 
    reviews: 16, 
    specs: ['Corte Clásico', 'Cejas', 'Fade en Tendencia'],
    bio: 'Experto en cortes clásicos y en tendencia, perfilado geométrico de cejas y texturizado para un look impecable.',
  },
];

export default function BarbersSection() {
  return (
    <section id="barberos" className="py-20 sm:py-28 bg-[#000000] border-b border-[#1e1e1e] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#1e1e1e] pb-8 mb-10">
          <div>
            <span className="font-sans text-[11px] uppercase tracking-[0.28em] text-[#888888] block mb-2">
              EQUIPO PROFESIONAL — TÉCNICA Y CERTIFICACIÓN
            </span>
            <h2 className="font-sans uppercase text-3xl sm:text-4xl lg:text-5xl text-white font-medium tracking-[0.16em] leading-tight">
              Maestros del Atelier
            </h2>
          </div>
          <p className="font-sans text-xs sm:text-sm text-[#888888] max-w-md mt-4 md:mt-0 leading-relaxed">
            Cada barbero de Punto Fino domina la geometría craneal y las técnicas tradicionales de navaja para garantizar un acabado impecable.
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
              className="bg-[#0d0d0d] border border-[#1e1e1e] hover:border-[#333333] rounded-none overflow-hidden flex flex-col justify-between transition-all duration-150"
            >
              {/* Header with Monogram */}
              <div className="p-6 border-b border-[#1e1e1e] bg-black flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-none bg-[#111111] border border-[#262626] flex items-center justify-center text-white font-mono text-base font-medium tracking-wider">
                    {barber.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <span className="px-2 py-0.5 text-[9px] font-sans font-medium uppercase tracking-[0.2em] rounded-none border border-[#222222] bg-[#0a0a0a] text-[#888888]">
                      {barber.experience}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5 bg-[#0a0a0a] border border-[#222222] px-2.5 py-1 rounded-none">
                  <Star size={11} className="text-white fill-white" />
                  <span className="font-mono text-xs font-medium text-white">{barber.rating}</span>
                  <span className="font-sans text-[10px] text-[#666666]">({barber.reviews})</span>
                </div>
              </div>

              {/* Information & Specialties */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <h3 className="font-sans uppercase text-lg text-white font-medium tracking-[0.14em] leading-snug">
                    {barber.name}
                  </h3>
                  <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#888888] mt-1 font-normal">
                    {barber.role}
                  </p>
                  <p className="font-sans text-xs text-[#888888] mt-3 leading-relaxed">
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
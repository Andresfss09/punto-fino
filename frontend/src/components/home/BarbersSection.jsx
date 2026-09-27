import React from 'react';
import { motion } from 'framer-motion';
import { Star, Scissors, ArrowRight, ShieldCheck } from 'lucide-react';

const BARBERS = [
  { 
    id: 1, 
    name: 'Juan Muñeton', 
    role: 'Fundador & Master Barber', 
    experience: '8+ años',
    rating: 5.0, 
    reviews: 310, 
    specs: ['Experiencia Gold', 'Visagismo Facial', 'Degradado Milimétrico'],
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    bio: 'Pionero en técnicas de visagismo masculino en Cali. Especialista en transformaciones integrales y asesoría de imagen.',
  },
  { 
    id: 2, 
    name: 'Carlos Mendoza', 
    role: 'Especialista en Corte Clásico & Barba', 
    experience: '6 años',
    rating: 4.9, 
    reviews: 185, 
    specs: ['Navaja Libre', 'Toalla Caliente', 'Fade Clásico'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    bio: 'Maestro de la navaja tradicional y el cuidado botánico de la barba. Precisión artesanal en cada línea.',
  },
  { 
    id: 3, 
    name: 'Mateo Gómez', 
    role: 'Especialista en Textura & Acabado', 
    experience: '5 años',
    rating: 4.8, 
    reviews: 140, 
    specs: ['Texturizado', 'Mascarilla Facial', 'Perfilado'],
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    bio: 'Experto en texturizado con tijera y tratamientos dérmicos purificantes. Atención meticulosa al detalle.',
  },
];

export default function BarbersSection() {
  return (
    <section id="barberos" className="py-24 sm:py-32 bg-[#0e1311] border-b border-[#1f2723]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#1f2723] pb-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="editorial-tag bg-[#161d19] border-[#2b3630] text-gold-400">
                Staff Profesional
              </span>
              <span className="font-sans text-[11px] uppercase tracking-wider text-[#808080]">
                Técnica & Certificación
              </span>
            </div>
            <h2 className="font-serif italic text-4xl sm:text-5xl text-white font-normal leading-tight">
              Maestros del Atelier
            </h2>
          </div>
          <p className="font-sans text-xs sm:text-sm text-[#b3b3b3] max-w-md mt-4 md:mt-0 leading-relaxed">
            Cada barbero de Punto Fino domina la geometría craneal y las técnicas tradicionales de navaja para garantizar un acabado impecable.
          </p>
        </div>

        {/* Barbers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BARBERS.map((barber, i) => (
            <motion.div 
              key={barber.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
              className="bg-[#121815] border border-[#222a26] hover:border-[#cfa53b]/50 rounded-[4px] overflow-hidden flex flex-col group transition-all duration-300 shadow-subtle"
            >
              {/* Barber Studio Portrait — Warm low-light mood */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[#0d1210]">
                <img
                  src={barber.image}
                  alt={barber.name}
                  className="w-full h-full object-cover object-top filter grayscale contrast-115 brightness-90 group-hover:scale-105 group-hover:filter-none transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121815] via-transparent to-transparent opacity-90" />
                
                {/* Rating Badge */}
                <div className="absolute bottom-3 left-4 z-10 flex items-center gap-1.5 bg-[#0e1311]/90 backdrop-blur-sm border border-[#222a26] px-2.5 py-1 rounded-[4px]">
                  <Star size={12} className="text-gold-400 fill-gold-400" />
                  <span className="font-mono text-xs font-semibold text-white">{barber.rating}</span>
                  <span className="font-sans text-[11px] text-[#808080]">({barber.reviews})</span>
                </div>

                <div className="absolute top-3.5 right-3.5 z-10">
                  <span className="editorial-tag bg-[#161d19]/90 border-[#2b3530] text-[#dfdbca] backdrop-blur-sm">
                    {barber.experience}
                  </span>
                </div>
              </div>

              {/* Information & Specialties */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <h3 className="font-serif italic text-2xl text-white group-hover:text-gold-300 transition-colors">
                    {barber.name}
                  </h3>
                  <p className="font-sans text-[11px] uppercase tracking-wider text-gold-400 mt-1">
                    {barber.role}
                  </p>
                  
                  <p className="font-sans text-xs text-[#b3b3b3] mt-3 leading-relaxed">
                    {barber.bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {barber.specs.map(spec => (
                      <span 
                        key={spec} 
                        className="px-2 py-0.5 text-[11px] font-sans text-[#dfdbca] bg-[#161d19] border border-[#26302a] rounded-[4px]"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1f2723]">
                  <a
                    href="#reservar"
                    className="w-full py-2.5 px-4 text-xs uppercase tracking-wider font-sans rounded-[4px] border border-[#2b3530] text-white hover:text-[#0e1311] hover:bg-[#f6f7f2] hover:border-[#f6f7f2] transition-all flex items-center justify-center gap-2 group/btn cursor-pointer"
                  >
                    <span>Agendar con {barber.name.split(' ')[0]}</span>
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
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Scissors } from 'lucide-react';
import { Link } from 'react-router-dom';
import BrutalCard from '../ui/BrutalCard';

const BARBERS = [
  { id: 1, name: 'Juan Muñeton', role: 'Master Barber / Fundador', rating: 5.0, reviews: 310, specs: ['Experiencia Gold', 'Diseño', 'Fade'], img: 'J' },
  { id: 2, name: 'Carlos Mendoza', role: 'Barbero Especialista', rating: 4.9, reviews: 185, specs: ['Fade', 'Barba', 'Clásico'], img: 'C' },
  { id: 3, name: 'Mateo Gómez', role: 'Especialista en Detalle', rating: 4.8, reviews: 140, specs: ['Perfilado', 'Tratamiento Facial'], img: 'M' },
];

export default function BarbersSection() {
  return (
    <section id="barberos" className="py-24 bg-dark-500 border-t-2 border-dashed border-[#333]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-14">
          <span className="text-xs uppercase font-mono tracking-[0.3em] text-gold-500 font-bold block mb-2">
            STAFF PROFESIONAL
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold uppercase tracking-wider inline-block text-white">
            Nuestros <span className="text-gold-500">Master Barbers</span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-lg mx-auto mt-3">
            Especialistas dedicados a esculpir tu imagen con técnicas de alta precisión.
          </p>
        </div>

        <div className="flex overflow-x-auto sm:grid sm:grid-cols-2 md:grid-cols-3 gap-6 pb-8 snap-x snap-mandatory scrollbar-hide">
          {BARBERS.map((barber, i) => (
            <motion.div 
              key={barber.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="min-w-[85vw] sm:min-w-0 snap-center"
            >
              <BrutalCard className="text-center group relative overflow-hidden h-full flex flex-col justify-between rounded-2xl hover:border-gold-500 transition-all duration-300">
                <div className="absolute -top-10 -right-10 text-[#1a1a1a] group-hover:text-gold-500/10 transition-colors z-0 pointer-events-none">
                  <Scissors size={120} />
                </div>
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-dark-300 border-2 border-gold-500 shadow-brutal-gold-sm flex items-center justify-center text-3xl font-bold text-gold-400 mb-4 group-hover:scale-105 transition-transform">
                    {barber.img}
                  </div>
                  
                  <h3 className="text-xl font-bold uppercase mb-0.5">{barber.name}</h3>
                  <p className="text-xs text-gold-400 font-mono mb-3">{barber.role}</p>
                  
                  <div className="flex items-center gap-1.5 bg-[#141414] px-3 py-1 border border-white/10 rounded-full mb-5 shadow-sm">
                    <Star size={14} className="text-gold-500 fill-gold-500" />
                    <span className="font-mono-price text-sm font-bold text-white">{barber.rating}</span>
                    <span className="text-xs text-gray-500">({barber.reviews})</span>
                  </div>

                  <div className="flex flex-wrap justify-center gap-1.5 mb-6">
                    {barber.specs.map(spec => (
                      <span key={spec} className="brutal-badge bg-dark-200 text-gray-300 border-[#333] text-[11px]">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="relative z-10 w-full pt-4 border-t border-white/5">
                  <Link
                    to="/reservar"
                    className="w-full brutal-btn-outline py-3 uppercase text-xs font-bold tracking-wider hover:bg-gold-500 hover:text-black transition-colors block text-center rounded-xl"
                  >
                    Agendar Cita
                  </Link>
                </div>
              </BrutalCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
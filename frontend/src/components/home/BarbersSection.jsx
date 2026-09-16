import React from 'react';
import { motion } from 'framer-motion';
import { Star, Scissors } from 'lucide-react';
import { Link } from 'react-router-dom';
import BrutalCard from '../ui/BrutalCard';

const BARBERS = [
  { id: 1, name: 'Carlos M.', rating: 4.9, reviews: 128, specs: ['Fade', 'Barba'], img: 'C' },
  { id: 2, name: 'Andrés Silva', rating: 4.8, reviews: 95, specs: ['Color', 'Clásico'], img: 'A' },
  { id: 3, name: 'Luis Torres', rating: 5.0, reviews: 210, specs: ['Diseño', 'Fade'], img: 'L' },
];

export default function BarbersSection() {
  return (
    <section className="py-20 bg-dark-500 border-t-2 border-dashed border-[#333]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-bold uppercase tracking-wider inline-block relative text-white bg-dark-500 px-4 border-2 border-[#333] py-2 shadow-brutal-sm">
            Nuestros <span className="text-gold-500">Barberos</span>
          </h2>
        </div>

        <div className="flex overflow-x-auto sm:grid sm:grid-cols-2 md:grid-cols-3 gap-6 pb-8 snap-x snap-mandatory scrollbar-hide">
          {BARBERS.map((barber, i) => (
            <motion.div 
              key={barber.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="min-w-[85vw] sm:min-w-0 snap-center"
            >
              <BrutalCard className="text-center group relative overflow-hidden">
                <div className="absolute -top-10 -right-10 text-[#222] group-hover:text-[#333] transition-colors z-0">
                  <Scissors size={120} />
                </div>
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-dark-300 border-2 border-gold-500 shadow-brutal-gold-sm flex items-center justify-center text-3xl font-bold text-gold-500 mb-4 group-hover:scale-110 transition-transform">
                    {barber.img}
                  </div>
                  
                  <h3 className="text-xl font-bold uppercase mb-1">{barber.name}</h3>
                  
                  <div className="flex items-center gap-1 bg-dark-300 px-3 py-1 border border-[#333] rounded-full mb-4">
                    <Star size={14} className="text-gold-500 fill-gold-500" />
                    <span className="font-mono-price text-sm font-bold text-white">{barber.rating}</span>
                    <span className="text-xs text-gray-500">({barber.reviews})</span>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {barber.specs.map(spec => (
                      <span key={spec} className="brutal-badge bg-dark-200 text-gray-400 border-[#333]">
                        {spec}
                      </span>
                    ))}
                  </div>

                  <Link to={`/booking?barber=${barber.id}`} className="w-full brutal-btn-outline py-3 uppercase text-sm font-bold hover:bg-gold-500 hover:text-dark-500 transition-colors inline-block text-center">
                    Reservar con {barber.name.split(' ')[0]}
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
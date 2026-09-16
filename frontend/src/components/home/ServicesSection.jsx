import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BrutalCard from '../ui/BrutalCard';

const CATEGORIES = ['Todos', 'Corte', 'Barba', 'Combos'];

const SERVICES = [
  { id: 1, name: 'Corte Clásico', desc: 'Corte a tijera o máquina con acabados perfectos.', price: 25000, time: 45, cat: 'Corte' },
  { id: 2, name: 'Degradado / Fade', desc: 'Degradado limpio desde cero o navaja.', price: 30000, time: 50, cat: 'Corte' },
  { id: 3, name: 'Perfilado de Barba', desc: 'Diseño de barba con toalla caliente y navaja.', price: 15000, time: 30, cat: 'Barba' },
  { id: 4, name: 'Corte + Barba', desc: 'El paquete completo para lucir impecable.', price: 40000, time: 75, cat: 'Combos' },
  { id: 5, name: 'Corte VIP', desc: 'Incluye mascarilla negra y masaje capilar.', price: 50000, time: 90, cat: 'Combos' },
];

export default function ServicesSection() {
  const [activeCat, setActiveCat] = useState('Todos');

  const filtered = activeCat === 'Todos' ? SERVICES : SERVICES.filter(s => s.cat === activeCat);

  return (
    <section className="py-20 bg-dark-400">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-bold uppercase tracking-wider inline-block relative">
            Nuestros <span className="text-gold-500">Servicios</span>
            <div className="absolute -bottom-2 left-0 w-full h-2 bg-gold-500"></div>
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`brutal-badge text-sm px-6 py-3 cursor-pointer transition-all ${
                activeCat === cat ? 'bg-gold-500 text-dark-500 border-dark-500 shadow-brutal-sm' : 'bg-dark-300 text-white border-[#333] hover:border-gray-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <BrutalCard className="h-full flex flex-col group hover:-translate-y-2 hover:shadow-brutal-lg transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <span className="brutal-badge bg-gold-500/10 text-gold-500 border-gold-500/20">{service.cat}</span>
                  <span className="font-mono-price text-gray-400 text-sm">{service.time} min</span>
                </div>
                
                <h3 className="text-xl font-bold uppercase mb-2 group-hover:text-gold-500 transition-colors">{service.name}</h3>
                <p className="text-gray-400 text-sm flex-grow mb-6">{service.desc}</p>
                
                <div className="brutal-divider mb-4"></div>
                
                <div className="font-mono-price text-2xl font-bold text-white">
                  ${service.price.toLocaleString('es-CO')}
                </div>
              </BrutalCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
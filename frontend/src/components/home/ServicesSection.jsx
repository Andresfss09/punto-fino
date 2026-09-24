import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import BrutalCard from '../ui/BrutalCard';

const CATEGORIES = ['Todos', 'Experiencias', 'Corte', 'Barba'];

const SERVICES = [
  {
    id: 1,
    name: 'Experiencia White',
    badge: 'Popular',
    desc: 'Corte de cabello profesional, perfilación de cejas, orientación de corte según tu fisionomía y aplicación de productos profesionales.',
    price: 22000,
    time: 45,
    cat: 'Experiencias',
    highlight: false,
  },
  {
    id: 2,
    name: 'Experiencia Black',
    badge: 'Recomendada',
    desc: 'Corte de cabello profesional, mascarilla facial, exfoliación profunda, aceite hidratante y perfilación de cejas y barba.',
    price: 40000,
    time: 60,
    cat: 'Experiencias',
    highlight: false,
  },
  {
    id: 3,
    name: 'Experiencia Gold VIP 👑',
    badge: 'Exclusivo VIP',
    desc: 'Servicio completo de lujo: Corte + barba + cejas, asesoría personalizada de imagen, hidratación facial profunda y vaporozono frío y caliente.',
    price: 75000,
    time: 90,
    cat: 'Experiencias',
    highlight: true,
  },
  {
    id: 4,
    name: 'Perfilado de Barba',
    badge: 'Detalle',
    desc: 'Diseño de barba según tu estilo, navaja libre, toalla caliente, exfoliación y aplicación de aceite hidratante.',
    price: 16000,
    time: 30,
    cat: 'Barba',
    highlight: false,
  },
  {
    id: 5,
    name: 'Corte Clásico / Fade',
    badge: 'Esencial',
    desc: 'Degradado limpio a navaja o corte a tijera tradicional con acabado milimétrico y peinado.',
    price: 20000,
    time: 40,
    cat: 'Corte',
    highlight: false,
  },
  {
    id: 6,
    name: 'Mascarilla Facial',
    badge: 'Cuidado',
    desc: 'Tratamiento facial exfoliante, puntos negros e hidratación para revitalizar la piel del rostro.',
    price: 25000,
    time: 30,
    cat: 'Experiencias',
    highlight: false,
  },
];

export default function ServicesSection() {
  const [activeCat, setActiveCat] = useState('Todos');

  const filtered = activeCat === 'Todos' ? SERVICES : SERVICES.filter(s => s.cat === activeCat);

  return (
    <section id="servicios" className="py-24 bg-dark-400 border-t border-white/5">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-14">
          <span className="text-xs uppercase font-mono tracking-[0.3em] text-gold-500 font-bold block mb-2">
            CATÁLOGO EXCLUSIVO
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold uppercase tracking-wider inline-block">
            Elige tu <span className="text-gold-500">Experiencia</span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto mt-3">
            Tratamientos y cortes diseñados para elevar tu presencia y estilo personal.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-14">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`brutal-badge text-sm px-6 py-2.5 cursor-pointer rounded-xl transition-all ${
                activeCat === cat
                  ? 'bg-gold-500 text-black border-gold-500 font-bold shadow-brutal-gold-sm'
                  : 'bg-[#141414] text-gray-300 border-white/10 hover:border-gold-500/50'
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
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
            >
              <BrutalCard className={`h-full flex flex-col justify-between group hover:-translate-y-1.5 transition-all duration-300 rounded-2xl ${
                service.highlight ? 'border-2 border-gold-500 shadow-brutal-gold bg-gradient-to-b from-[#1a1811] to-[#111111]' : ''
              }`}>
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className={`text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full ${
                      service.highlight
                        ? 'bg-gold-500 text-black'
                        : 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
                    }`}>
                      {service.badge}
                    </span>
                    <span className="font-mono-price text-gray-400 text-xs flex items-center gap-1">
                      ⏱ {service.time} min
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold uppercase mb-2 group-hover:text-gold-400 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {service.desc}
                  </p>
                </div>
                
                <div>
                  <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-gray-500 block">Inversión</span>
                      <span className="font-mono-price text-2xl font-bold text-white">
                        ${service.price.toLocaleString('es-CO')}
                      </span>
                    </div>
                    <Link
                      to="/reservar"
                      className="px-4 py-2 text-xs uppercase font-bold tracking-wider rounded-lg bg-gold-500 text-black hover:bg-gold-400 transition-all shadow-sm"
                    >
                      Agendar
                    </Link>
                  </div>
                </div>
              </BrutalCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedCounter from '../ui/AnimatedCounter';

export default function HeroSection() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-dark-500 pt-16">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-500 via-dark-500 to-dark-500"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiMzMzMiLz48L3N2Zz4=')] z-0 opacity-30"></div>
      
      <div className="container mx-auto px-4 z-10 relative">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-5xl mx-auto text-center"
        >
          <motion.div variants={item} className="inline-block border-2 border-gold-500 px-4 py-1 mb-6 bg-dark-500 shadow-brutal-gold-sm">
            <span className="font-mono-price text-gold-500 font-bold uppercase text-sm tracking-widest">Estilo & Precisión</span>
          </motion.div>

          <motion.h1 
            variants={item}
            className="text-[clamp(3rem,8vw,8rem)] font-display font-bold text-gold-500 leading-none uppercase tracking-tighter mb-4"
            style={{ textShadow: '4px 4px 0 #000' }}
          >
            PUNTO FINO
          </motion.h1>

          <motion.p 
            variants={item}
            className="text-lg md:text-2xl text-gray-300 font-sans max-w-2xl mx-auto mb-10"
          >
            La mejor barbería de Colombia. Cortes clásicos, degradados perfectos y cuidado integral para el hombre moderno.
          </motion.p>

          <motion.div variants={item}>
            <Link to="/booking" className="inline-block brutal-btn-primary px-8 py-4 text-xl border-3 shadow-brutal-gold">
              RESERVAR CITA AHORA
            </Link>
          </motion.div>

          <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-3xl mx-auto border-t-2 border-dashed border-[#333] pt-10">
            <motion.div variants={item} className="flex flex-col items-center">
              <span className="text-4xl font-mono-price font-bold text-white mb-2"><AnimatedCounter value={5} />+</span>
              <span className="text-sm uppercase text-gray-400 font-bold tracking-wider">Años de Exp</span>
            </motion.div>
            <motion.div variants={item} className="flex flex-col items-center">
              <span className="text-4xl font-mono-price font-bold text-white mb-2"><AnimatedCounter value={1000} />+</span>
              <span className="text-sm uppercase text-gray-400 font-bold tracking-wider">Clientes Felices</span>
            </motion.div>
            <motion.div variants={item} className="flex flex-col items-center">
              <span className="text-4xl font-mono-price font-bold text-gold-500 mb-2"><AnimatedCounter value={4.9} /></span>
              <span className="text-sm uppercase text-gray-400 font-bold tracking-wider">Valoración Media</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
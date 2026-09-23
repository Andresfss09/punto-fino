import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedCounter from '../ui/AnimatedCounter';

export default function HeroSection() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
  };

  const item = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-dark-500 pt-20 pb-16">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-500/30 via-dark-500 to-dark-500 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 z-10 relative">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto text-center"
        >
          {/* Logo Badge in Hero */}
          <motion.div variants={item} className="mb-6 flex justify-center">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-gold-500 to-gold-300 opacity-30 blur-md group-hover:opacity-60 transition duration-500"></div>
              <img
                src="/logo.png"
                alt="Steel House Barberia's Logo"
                className="relative w-28 h-28 sm:w-36 sm:h-36 object-contain rounded-full border-3 border-gold-500 shadow-brutal-gold mx-auto"
              />
            </div>
          </motion.div>

          <motion.div variants={item} className="inline-block border-2 border-gold-500/60 px-4 py-1.5 mb-5 bg-[#141414] shadow-brutal-gold-sm rounded-full">
            <span className="font-mono-price text-gold-400 font-bold uppercase text-xs sm:text-sm tracking-[0.25em]">
              BARBERÍA DE EXPERIENCIA · CALI
            </span>
          </motion.div>

          <motion.h1 
            variants={item}
            className="text-[clamp(2.5rem,7vw,6.5rem)] font-display font-bold text-white leading-none uppercase tracking-tight mb-2"
          >
            STEEL <span className="text-gold-500" style={{ textShadow: '0 0 30px rgba(212,175,55,0.3)' }}>HOUSE</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="font-display font-semibold text-lg sm:text-2xl text-gold-400 tracking-[0.3em] uppercase mb-6"
          >
            BARBERIA'S 👑
          </motion.p>

          <motion.p 
            variants={item}
            className="text-base sm:text-xl text-gray-300 font-sans max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Más que un corte de cabello, <span className="text-white font-semibold">construimos presencia</span>. Cada experiencia está diseñada para cuidar tu imagen, tu tiempo y tu estilo de vida.
          </motion.p>

          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/reservar" className="w-full sm:w-auto brutal-btn-primary px-8 py-4 text-lg border-3 shadow-brutal-gold rounded-xl">
              RESERVAR TU CITA AHORA
            </Link>
            <a
              href="https://wa.me/573158965266?text=Hola,%20me%20gustar%C3%ADa%20agendar%20una%20cita%20en%20Steel%20House"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto brutal-btn bg-[#141414] text-gold-400 border-2 border-gold-500/50 hover:border-gold-500 px-6 py-4 text-base font-semibold rounded-xl transition-all"
            >
              WhatsApp Directo
            </a>
          </motion.div>

          {/* Stats Bar */}
          <motion.div variants={container} className="grid grid-cols-3 gap-4 sm:gap-6 mt-16 max-w-2xl mx-auto border-t-2 border-dashed border-[#333] pt-8">
            <motion.div variants={item} className="flex flex-col items-center">
              <span className="text-2xl sm:text-4xl font-mono-price font-bold text-white mb-1">
                <AnimatedCounter value={7} />+
              </span>
              <span className="text-[11px] sm:text-xs uppercase text-gray-400 font-bold tracking-wider">Años de Exp</span>
            </motion.div>
            <motion.div variants={item} className="flex flex-col items-center">
              <span className="text-2xl sm:text-4xl font-mono-price font-bold text-white mb-1">
                <AnimatedCounter value={2500} />+
              </span>
              <span className="text-[11px] sm:text-xs uppercase text-gray-400 font-bold tracking-wider">Cortes Realizados</span>
            </motion.div>
            <motion.div variants={item} className="flex flex-col items-center">
              <span className="text-2xl sm:text-4xl font-mono-price font-bold text-gold-500 mb-1">
                <AnimatedCounter value={4.9} />
              </span>
              <span className="text-[11px] sm:text-xs uppercase text-gray-400 font-bold tracking-wider">Valoración 👑</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
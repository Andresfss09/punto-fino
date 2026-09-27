import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Scissors, Sparkles, MessageCircle, Calendar } from 'lucide-react';
import AnimatedCounter from '../ui/AnimatedCounter';

export default function HeroSection() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  const featuredEntries = [
    {
      title: 'Experiencia White',
      category: 'Corte de Autor',
      notes: 'Visagismo según morfología craneal, lavado térmico y texturizado a tijera japonesa.',
      href: '#servicios',
      price: '$22.000 COP',
    },
    {
      title: 'Experiencia Black',
      category: 'Ritual Completo',
      notes: 'Corte milimétrico, mascarilla desintoxicante de carbón activado y toalla caliente.',
      href: '#servicios',
      price: '$40.000 COP',
    },
    {
      title: 'Experiencia Gold VIP',
      category: 'Edición Exclusiva',
      notes: 'Tratamiento supremo: corte + barba completa, vaporozono ozonizado y perfilado facial.',
      href: '#servicios',
      price: '$75.000 COP',
    },
    {
      title: 'Perfilado de Barba a Navaja Libre',
      category: 'Barbería Clásica',
      notes: 'Diseño geométrico a navaja clásica, exfoliación botánica y bálsamo nutritivo.',
      href: '#servicios',
      price: '$16.000 COP',
    },
  ];

  return (
    <div className="w-full bg-[#0e1311] text-white pt-28 sm:pt-32">
      {/* Primary Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Subtle warm ember/gold wash in backdrop (Assembly Coffee style) */}
        <div 
          className="absolute top-10 right-10 w-[500px] h-[500px] bg-[#cfa53b]/5 rounded-full blur-[140px] pointer-events-none" 
          aria-hidden="true"
        />

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-12"
        >
          {/* Header Typography Group */}
          <div className="border-b border-[#1f2723] pb-10">
            <motion.div variants={item} className="flex flex-wrap items-center gap-3 mb-6">
              <span className="editorial-tag bg-[#161d19] border-[#2b3630] text-gold-400">
                Atelier · Cali, Valle
              </span>
              <span className="font-sans text-[11px] uppercase tracking-widest text-[#808080]">
                Vol. 2026 — Edición No. 7
              </span>
            </motion.div>

            <motion.div variants={item} className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <h1 className="font-serif italic text-5xl sm:text-7xl lg:text-8xl font-normal tracking-tight text-white leading-none">
                  Punto Fino
                </h1>
                <p className="font-sans text-xs sm:text-sm uppercase tracking-[0.28em] text-gold-400 mt-3 font-medium">
                  Barbería de Autor · Visagismo & Estilo Masculino
                </p>
              </div>

              <div className="max-w-md">
                <p className="font-sans text-sm sm:text-base text-[#b3b3b3] leading-relaxed">
                  Más que un corte de cabello, esculpimos presencia y distinción. Una experiencia de calma, técnica milimétrica y atención personalizada en Cali.
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <a
                    href="#reservar"
                    className="price-pill hover:bg-white transition-all transform hover:scale-[1.02]"
                  >
                    Agendar Cita en Línea
                  </a>
                  <a
                    href="https://wa.me/573158965266?text=Hola,%20me%20gustar%C3%ADa%20agendar%20una%20cita%20en%20Punto%20Fino"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="editorial-link text-sm flex items-center gap-1.5"
                  >
                    <MessageCircle size={15} /> WhatsApp Directo
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Two-Column Editorial Hero Layout (Table of Contents + Studio Visual) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
            {/* Left Column: Featured Index / Table of Contents (35% width) */}
            <motion.div variants={item} className="lg:col-span-5 space-y-6">
              <div className="flex items-center justify-between border-b border-[#1f2723] pb-2">
                <span className="font-sans text-[11px] uppercase tracking-widest text-[#808080]">
                  Índice de Servicios Destacados
                </span>
                <span className="font-sans text-[11px] text-gold-400 uppercase tracking-wider">
                  Carta 2026
                </span>
              </div>

              <div className="divide-y divide-[#1f2723]">
                {featuredEntries.map((entry, idx) => (
                  <div key={idx} className="py-4.5 first:pt-1 last:pb-1 group">
                    <div className="flex items-baseline justify-between gap-4">
                      <a 
                        href={entry.href} 
                        className="font-serif italic text-xl text-white group-hover:text-gold-300 transition-colors flex items-center gap-1.5"
                      >
                        {entry.title}
                        <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-gold-400" />
                      </a>
                      <span className="font-mono text-xs text-gold-400 font-medium shrink-0">
                        {entry.price}
                      </span>
                    </div>
                    <span className="font-sans text-[11px] uppercase tracking-wider text-[#808080] block mt-0.5">
                      {entry.category}
                    </span>
                    <p className="font-sans text-xs text-[#b3b3b3] mt-1.5 leading-relaxed">
                      {entry.notes}
                    </p>
                  </div>
                ))}
              </div>

              {/* Stats Bar (Restrained & Elegant) */}
              <div className="pt-6 border-t border-[#1f2723] grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="font-serif italic text-2xl text-white">
                    <AnimatedCounter value={7} />+
                  </div>
                  <div className="font-sans text-[10px] uppercase tracking-wider text-[#808080] mt-0.5">
                    Años de Maestría
                  </div>
                </div>
                <div>
                  <div className="font-serif italic text-2xl text-white">
                    <AnimatedCounter value={2500} />+
                  </div>
                  <div className="font-sans text-[10px] uppercase tracking-wider text-[#808080] mt-0.5">
                    Servicios de Autor
                  </div>
                </div>
                <div>
                  <div className="font-serif italic text-2xl text-gold-400">
                    <AnimatedCounter value={4.9} />
                  </div>
                  <div className="font-sans text-[10px] uppercase tracking-wider text-[#808080] mt-0.5">
                    Calificación Promedio
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Studio Photograph Visual (65% width) */}
            <motion.div variants={item} className="lg:col-span-7">
              <div className="relative rounded-[4px] overflow-hidden border border-[#222a26] bg-[#121815] group shadow-subtle">
                {/* Studio Photograph with warm ember/charcoal atmosphere */}
                <div className="relative aspect-[16/11] sm:aspect-[16/10] overflow-hidden bg-[#0d1210]">
                  <img
                    src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1400&q=80"
                    alt="Atelier Punto Fino Barbería"
                    className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.05] group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e1311] via-transparent to-transparent opacity-80" />
                  
                  {/* Floating Price Pill at Bottom Left */}
                  <div className="absolute bottom-5 left-5 z-10 flex flex-wrap items-center gap-3">
                    <span className="price-pill shadow-md">
                      Servicios desde — $16.000 COP
                    </span>
                    <span className="editorial-tag bg-[#121815]/90 border-[#2b3530] text-[#dfdbca] backdrop-blur-sm hidden sm:inline-flex">
                      Atención Personalizada
                    </span>
                  </div>
                </div>

                {/* Caption / Studio Note */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs border-t border-[#1f2723]">
                  <div>
                    <p className="font-serif italic text-white text-sm">
                      Sede Principal — B/ Atanasio Girardot
                    </p>
                    <p className="font-sans text-[11px] text-[#808080] mt-0.5">
                      Cra. 16 #33F-31, Cali · Lunes a Sábado 9:00 a 20:00 · Domingos 10:00 a 17:00
                    </p>
                  </div>
                  <a
                    href="#reservar"
                    className="font-serif italic text-gold-400 hover:text-white underline underline-offset-4 text-xs transition-colors shrink-0"
                  >
                    Seleccionar barbero & fecha →
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Editorial Manifesto Block (Full-Width Black #0e1311 — Assembly Coffee Signature) */}
      <section className="border-y border-[#1f2723] bg-[#0c100e] py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="editorial-tag bg-[#161d19] border-[#2b3530] text-gold-400 mb-6">
            Manifiesto Punto Fino
          </span>
          <blockquote className="font-serif italic text-2xl sm:text-4xl lg:text-[40px] text-white font-normal leading-[1.3] text-balance">
            “Entendemos el corte de cabello como un ejercicio de visagismo y arquitectura. No perseguimos tendencias efímeras; esculpimos la presencia, la proporción y el carácter de cada hombre con técnica milimétrica y atención absoluta.”
          </blockquote>
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-gold-400/40"></span>
            <span className="font-sans text-xs uppercase tracking-[0.25em] text-[#b3b3b3]">
              Juan Muñeton · Master Barber & Fundador
            </span>
            <span className="w-8 h-px bg-gold-400/40"></span>
          </div>
        </div>
      </section>
    </div>
  );
}
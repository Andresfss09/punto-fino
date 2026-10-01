import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';
import AnimatedCounter from '../ui/AnimatedCounter';

const SLIDES = [
  {
    id: 1,
    eyebrow: 'TU BARBERÍA EN CALI',
    titleLine1: 'CORTES MODERNOS &',
    titleLine2: 'DEGRADADOS FADE',
    desc: 'Los mejores cortes clásicos y en tendencia. Fade limpio, textura a tijera y el estilo que estás buscando para tu día a día.',
    buttonText: 'RESERVAR CORTE',
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 2,
    eyebrow: 'ARREGLO DE BARBA',
    titleLine1: 'AFEITADO A NAVAJA &',
    titleLine2: 'TOALLA CALIENTE',
    desc: 'Delineado perfecto, toalla caliente y aceites especiales para dejar tu barba suave, perfilada y con la mejor forma.',
    buttonText: 'RESERVAR BARBA',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 3,
    eyebrow: 'EL COMBO FAVORITO',
    titleLine1: 'CORTE COMPLETO +',
    titleLine2: 'BARBA & CEJAS',
    desc: 'El paquete completo para salir renovado. Atención puntual con Andrés, Nicolás o Luis y una bebida bien fría de cortesía.',
    buttonText: 'RESERVAR COMBO',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1600&q=80',
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const active = SLIDES[currentSlide];

  return (
    <div className="w-full bg-[#000000] text-white pt-24">
      {/* Cinematic Hero Viewport */}
      <div className="relative w-full min-h-[580px] sm:min-h-[640px] lg:h-[680px] overflow-hidden bg-black select-none border-b border-[#1e1e1e]">
        {/* Background Slide Image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <img
              src={active.image}
              alt={active.titleLine1}
              className="w-full h-full object-cover object-center filter brightness-[0.80] contrast-[1.05]"
            />
            {/* Soft Ambient Overlay to ensure text readability without hiding the barbershop atmosphere */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
          </motion.div>
        </AnimatePresence>

        {/* Content Container (2 Columns on Desktop) */}
        <div className="relative z-10 max-w-7xl mx-auto h-full px-6 sm:px-8 lg:px-12 py-16 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
            
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 bg-[#cfa53b]"></span>
                    <span className="font-sans text-[11px] sm:text-xs font-medium uppercase tracking-[0.24em] text-[#cfa53b]">
                      {active.eyebrow}
                    </span>
                  </div>

                  <h1 className="font-sans uppercase text-3xl sm:text-5xl lg:text-6xl font-medium tracking-[0.12em] text-white leading-[1.08] mb-4">
                    <span>{active.titleLine1}</span>
                    <br />
                    <span className="text-[#cfa53b]">{active.titleLine2}</span>
                  </h1>

                  <p className="font-sans text-sm sm:text-base text-[#cccccc] max-w-lg mb-8 leading-relaxed">
                    {active.desc}
                  </p>

                  <div className="flex flex-wrap items-center gap-4">
                    <a
                      href="#reservar"
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById('reservar');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="btn-ferrari-primary !py-3.5 !px-8 text-xs flex items-center gap-2 shadow-lg"
                    >
                      <Calendar size={15} />
                      <span>{active.buttonText}</span>
                      <ArrowRight size={14} />
                    </a>

                    <a
                      href="#servicios"
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById('servicios');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="btn-ferrari-outline !py-3.5 !px-6 text-xs text-center"
                    >
                      Ver Precios y Cortes
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Column: Floating Quick Info Card with the Razor Logo */}
            <div className="hidden lg:flex lg:col-span-5 justify-end">
              <div className="w-full max-w-sm bg-[#0a0a0a]/90 backdrop-blur-md border border-[#222222] p-7 shadow-2xl relative">
                {/* Top Badge */}
                <div className="flex items-center justify-between border-b border-[#1e1e1e] pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <img 
                      src="/logo.png" 
                      alt="Barbería Triadix" 
                      className="w-11 h-11 object-contain p-0.5 bg-black border border-[#2e2e2e]" 
                    />
                    <div>
                      <h3 className="font-sans uppercase font-bold text-sm tracking-[0.2em] text-white leading-tight">
                        Triadix
                      </h3>
                      <span className="text-[10px] text-[#cfa53b] uppercase tracking-[0.16em] font-mono">
                        Barbería · Cali
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Abierto Hoy
                  </span>
                </div>

                <div className="space-y-3.5 text-xs font-sans mb-6">
                  <div className="flex items-start gap-2.5 text-[#cccccc]">
                    <CheckCircle2 size={15} className="text-[#cfa53b] shrink-0 mt-0.5" />
                    <span><strong>3 Barberos disponibles:</strong> Andrés, Nicolás y Luis</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-[#cccccc]">
                    <CheckCircle2 size={15} className="text-[#cfa53b] shrink-0 mt-0.5" />
                    <span><strong>Atención puntual:</strong> Reserva online y olvídate de hacer fila</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-[#cccccc]">
                    <CheckCircle2 size={15} className="text-[#cfa53b] shrink-0 mt-0.5" />
                    <span><strong>Bebida de cortesía:</strong> Café, agua o jugo mientras te atendemos</span>
                  </div>
                </div>

                <a
                  href="#reservar"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById('reservar');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full btn-ferrari-primary text-xs !py-3 flex items-center justify-center gap-2"
                >
                  <Calendar size={14} />
                  <span>Agendar Mi Cita Ahora</span>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
          {SLIDES.map((s, idx) => {
            const isActive = currentSlide === idx;
            return (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 transition-all cursor-pointer ${
                  isActive ? 'w-8 bg-[#cfa53b]' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            );
          })}
        </div>

        {/* Nav Arrows */}
        <button
          onClick={prevSlide}
          aria-label="Corte anterior"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 border border-white/20 hover:border-white text-white flex items-center justify-center transition-all bg-black/40 hover:bg-black/80 cursor-pointer"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Siguiente corte"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 border border-white/20 hover:border-white text-white flex items-center justify-center transition-all bg-black/40 hover:bg-black/80 cursor-pointer"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Stats Band */}
      <section className="bg-[#0a0a0a] border-b border-[#1e1e1e] py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-3 gap-4 text-center divide-x divide-[#1e1e1e]">
          <div>
            <div className="font-mono text-2xl sm:text-3xl text-white font-medium">
              <AnimatedCounter value={7} />+
            </div>
            <div className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#888888] mt-1">
              Años de Experiencia
            </div>
          </div>
          <div>
            <div className="font-mono text-2xl sm:text-3xl text-white font-medium">
              <AnimatedCounter value={2500} />+
            </div>
            <div className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#888888] mt-1">
              Clientes Atendidos
            </div>
          </div>
          <div>
            <div className="font-mono text-2xl sm:text-3xl text-white font-medium">
              <AnimatedCounter value={4.9} />
            </div>
            <div className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#888888] mt-1">
              Calificación en Cali
            </div>
          </div>
        </div>
      </section>

      {/* Barbershop Promise */}
      <section className="border-b border-[#1e1e1e] bg-[#000000] py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="font-sans text-[11px] uppercase tracking-[0.28em] text-[#cfa53b] block mb-4">
            LA EXPERIENCIA EN TRIADIX
          </span>
          <blockquote className="font-sans uppercase text-base sm:text-xl lg:text-2xl text-white font-medium tracking-[0.12em] leading-relaxed">
            “En Triadix nos enfocamos en que te sientas como en casa, disfrutes de un buen ambiente y salgas con el corte exacto que pediste. Atención puntual, buena música y la mejor vibra de Cali.”
          </blockquote>
          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-[#333333]"></span>
            <span className="font-sans text-xs uppercase tracking-[0.18em] text-[#888888]">
              Andrés Felipe Sarria · Nicolás Chávez · Luis De Ávila
            </span>
            <span className="w-8 h-px bg-[#333333]"></span>
          </div>
        </div>
      </section>
    </div>
  );
}
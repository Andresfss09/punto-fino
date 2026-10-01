import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Play, Pause } from 'lucide-react';
import AnimatedCounter from '../ui/AnimatedCounter';

const SLIDES = [
  {
    id: 1,
    eyebrow: 'RITUAL DE BARBA & VAPOR OZONO',
    titleLine1: 'PURIFICACIÓN &',
    titleLine2: 'RASURADO CLÁSICO',
    desc: 'Apertura de poros mediante vapor ozonizado, bálsamos botánicos esenciales y perfilado geométrico con técnica tradicional a navaja.',
    buttonText: 'AGENDAR BARBA',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 2,
    eyebrow: 'CORTE DE AUTOR & VISAGISMO',
    titleLine1: 'EXPERIENCIA',
    titleLine2: 'TRIADIX ATELIER',
    desc: 'Corte milimétrico adaptado a tu morfología craneal, lavado capilar revitalizante y ritual completo de barba con toallas calientes.',
    buttonText: 'AGENDAR EXPERIENCIA',
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 3,
    eyebrow: 'RITUAL SUPREMO VIP',
    titleLine1: 'EXPERIENCIA PLATINIUM',
    titleLine2: 'TRIADIX SIGNATURE',
    desc: 'Corte, visagismo, exfoliación dérmica, vapor ozono dual, velo hidratante, mascarilla desintoxicante y masaje craneofacial.',
    buttonText: 'AGENDAR PLATINIUM',
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 4,
    eyebrow: 'SERVICIO INSIGNIA',
    titleLine1: 'CORTE DE PRECISIÓN &',
    titleLine2: 'PERFILADO DE CEJAS',
    desc: 'Visagismo craneal, corte milimétrico de precisión, perfilado de cejas que enmarca tu rostro y peinado con producto profesional.',
    buttonText: 'AGENDAR CORTE',
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=1400&q=80',
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
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
      {/* Full-Bleed Cinematic Hero Viewport (Ferrari Spec: 100vw, Photography is the container) */}
      <div className="relative w-full h-[620px] sm:h-[680px] lg:h-[720px] overflow-hidden bg-black select-none border-b border-[#1e1e1e]">
        {/* Background Slide Image with Transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <img
              src={active.image}
              alt={active.titleLine1}
              className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.1]"
            />
            {/* Scrim Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-transparent sm:w-4/5 lg:w-3/5" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/30" />
          </motion.div>
        </AnimatePresence>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto h-full px-6 sm:px-8 lg:px-12 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-2xl sm:max-w-3xl"
            >
              {/* Category Eyebrow: 12px, weight 400, letterSpacing: 3px */}
              <div className="mb-4">
                <span className="font-sans text-[11px] sm:text-xs font-normal uppercase tracking-[0.28em] text-[#cfa53b] block">
                  {active.eyebrow} — TRIADIX ATELIER · CALI
                </span>
              </div>

              {/* Main Headline: Uppercase, weight 500, letterSpacing: 3px - 4px */}
              <h1 className="font-sans uppercase text-3xl sm:text-5xl lg:text-6xl font-medium tracking-[0.16em] text-white leading-[1.1] mb-5">
                <span>{active.titleLine1}</span>
                <br />
                <span className="text-white/95">{active.titleLine2}</span>
              </h1>

              {/* Description Body: 14px, weight 400, leading 20px */}
              <p className="font-sans text-xs sm:text-sm text-[#cccccc] max-w-lg mb-8 leading-relaxed">
                {active.desc}
              </p>

              {/* Ferrari CTA Recipe: Spaced Text Label + Circle Arrow Button */}
              <div className="flex items-center gap-4">
                <a
                  href="#reservar"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById('reservar');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group inline-flex items-center gap-3.5 bg-transparent text-white hover:text-white/80 transition-all cursor-pointer"
                >
                  <span className="font-sans font-medium uppercase tracking-[0.22em] text-xs">
                    {active.buttonText}
                  </span>
                  <div className="w-9 h-9 rounded-full border border-white/40 group-hover:border-white bg-transparent flex items-center justify-center transition-all group-hover:scale-105">
                    <ArrowRight size={14} className="text-white" />
                  </div>
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Indicators (Ferrari Spec: Red Ring for active, Solid Dots for inactive, Circle Pause) */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            {SLIDES.map((s, idx) => {
              const isActive = currentSlide === idx;
              return (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(idx)}
                  className="cursor-pointer flex items-center justify-center transition-all"
                  aria-label={`Ir al corte ${idx + 1}`}
                >
                  {isActive ? (
                    <div className="w-3.5 h-3.5 rounded-full border border-[#da291c] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-white/50 hover:bg-white" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="w-px h-3 bg-white/20" />

          {/* Circular Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 rounded-full border border-white/30 hover:border-white text-white flex items-center justify-center transition-all cursor-pointer bg-transparent"
            title={isPlaying ? 'Pausar slider' : 'Reproducir slider'}
          >
            {isPlaying ? <Pause size={10} /> : <Play size={10} />}
          </button>
        </div>

        {/* Left / Right Nav Arrows (Circle Minimal) */}
        <button
          onClick={prevSlide}
          aria-label="Corte anterior"
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-white/20 hover:border-white text-white flex items-center justify-center transition-all backdrop-blur-sm cursor-pointer bg-black/30 hover:bg-black/60"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Siguiente corte"
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-white/20 hover:border-white text-white flex items-center justify-center transition-all backdrop-blur-sm cursor-pointer bg-black/30 hover:bg-black/60"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Geistlab Precision Stats Band */}
      <section className="bg-[#0a0a0a] border-b border-[#1e1e1e] py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-3 gap-4 text-center divide-x divide-[#1e1e1e]">
          <div>
            <div className="font-mono text-2xl sm:text-3xl text-white font-medium">
              <AnimatedCounter value={7} />+
            </div>
            <div className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#888888] mt-1 font-normal">
              Años de Maestría
            </div>
          </div>
          <div>
            <div className="font-mono text-2xl sm:text-3xl text-white font-medium">
              <AnimatedCounter value={2500} />+
            </div>
            <div className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#888888] mt-1 font-normal">
              Servicios de Autor
            </div>
          </div>
          <div>
            <div className="font-mono text-2xl sm:text-3xl text-white font-medium">
              <AnimatedCounter value={4.9} />
            </div>
            <div className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#888888] mt-1 font-normal">
              Calificación Promedio
            </div>
          </div>
        </div>
      </section>

      {/* Section Band Dark — Manifesto */}
      <section className="border-b border-[#1e1e1e] bg-[#000000] py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="font-sans text-[11px] uppercase tracking-[0.28em] text-[#cfa53b] block mb-6">
            MANIFIESTO TRIADIX
          </span>
          <blockquote className="font-sans uppercase text-lg sm:text-2xl lg:text-3xl text-white font-medium tracking-[0.14em] leading-[1.5] text-balance">
            “Entendemos el corte de cabello como un ejercicio de visagismo, arquitectura y precisión milimétrica. En Triadix no seguimos modas efímeras; esculpimos presencia, identidad y distinción con técnica artesanal rigurosa.”
          </blockquote>
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-[#333333]"></span>
            <span className="font-sans text-[11px] uppercase tracking-[0.22em] text-[#cccccc]">
              Andrés Felipe Sarria · Lead Stylist & Co-Founder Triadix
            </span>
            <span className="w-8 h-px bg-[#333333]"></span>
          </div>
        </div>
      </section>
    </div>
  );
}
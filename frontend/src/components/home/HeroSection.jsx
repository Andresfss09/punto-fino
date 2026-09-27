import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Play, Pause, Sparkles } from 'lucide-react';
import AnimatedCounter from '../ui/AnimatedCounter';

const SLIDES = [
  {
    id: 1,
    tag: 'RITUAL DE BARBA & VAPOR OZONO — PUNTO FINO · CALI',
    titleLine1: 'PURIFICACIÓN &',
    titleLine2: 'RASURADO CLÁSICO',
    desc: 'Apertura de poros mediante vapor ozonizado, bálsamos botánicos esenciales y perfilado geométrico con técnica tradicional a navaja.',
    buttonText: 'AGENDAR BARBA',
    serviceTarget: 'Ritual de Barba',
    image: 'https://s3.weibook.co/punto_fino/services/0f55ddbc-1dd2-4eb0-8978-3a50b53fffbc.webp',
  },
  {
    id: 2,
    tag: 'CORTE DE AUTOR & VISAGISMO — PUNTO FINO · CALI',
    titleLine1: 'EXPERIENCIA',
    titleLine2: 'PUNTO FINO + BARBA',
    desc: 'La combinación perfecta: corte milimétrico adaptado a tu morfología craneal, lavado capilar revitalizante y ritual completo de barba con toallas calientes.',
    buttonText: 'AGENDAR EXPERIENCIA',
    serviceTarget: 'Experiencia Punto Fino + Ritual de Barba',
    image: 'https://s3.weibook.co/punto_fino/services/241a43d5-f365-4a78-a32d-9e4ffaffb801.webp',
  },
  {
    id: 3,
    tag: 'RITUAL SUPREMO VIP — PUNTO FINO · CALI',
    titleLine1: 'EXPERIENCIA PLATINIUM',
    titleLine2: 'GOL DE ORO',
    desc: 'Corte, visagismo, exfoliación dérmica, vapor ozono dual, velo hidratante, mascarilla desintoxicante de puntos negros y masaje craneofacial.',
    buttonText: 'AGENDAR PLATINIUM',
    serviceTarget: 'Experiencia Platinium / Gol de Oro',
    image: 'https://s3.weibook.co/punto_fino/services/f7e3bb87-4e93-4eed-8340-1a01e6fa0ff3.webp',
  },
  {
    id: 4,
    tag: 'SERVICIO INSIGNIA — PUNTO FINO · CALI',
    titleLine1: 'CORTE DE PRECISIÓN &',
    titleLine2: 'PERFILADO DE CEJAS',
    desc: 'Visagismo según morfología craneal, corte milimétrico de precisión, perfilado de cejas que enmarca tu rostro y peinado con producto profesional.',
    buttonText: 'AGENDAR CORTE',
    serviceTarget: 'Experiencia Punto Fino (Corte + Cejas)',
    image: 'https://s3.weibook.co/punto_fino/services/d9eb3738-2f6d-47bf-a98a-16135933c3f4.webp',
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
    <div className="w-full bg-[#0e1311] text-white pt-24 sm:pt-28">
      {/* Cinematic Hero Slider Viewport */}
      <div className="relative w-full h-[620px] sm:h-[680px] lg:h-[720px] overflow-hidden bg-[#0a0e0c] select-none border-b border-[#1f2723]">
        {/* Background Slide Image with Transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <img
              src={active.image}
              alt={active.titleLine1}
              className="w-full h-full object-cover object-center filter brightness-[0.75] contrast-[1.08]"
            />
            {/* Cinematic Gradient Overlays for Ultimate Text Legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0e1311] via-[#0e1311]/70 to-transparent sm:w-4/5 lg:w-3/5" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e1311] via-[#0e1311]/30 to-black/40" />
          </motion.div>
        </AnimatePresence>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto h-full px-6 sm:px-8 lg:px-12 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="max-w-2xl sm:max-w-3xl"
            >
              {/* Category / Subtitle Tag */}
              <div className="flex items-center gap-2 mb-4">
                <span className="font-sans text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">
                  {active.tag}
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif uppercase italic text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-white leading-[1.05] mb-5">
                <span>{active.titleLine1}</span>
                <br />
                <span className="text-white/95">{active.titleLine2}</span>
              </h1>

              {/* Description Body */}
              <p className="font-sans text-xs sm:text-sm lg:text-base text-[#dfdbca] max-w-xl mb-8 leading-relaxed">
                {active.desc}
              </p>

              {/* Direct Booking Call to Action */}
              <div className="flex items-center gap-4">
                <a
                  href="#reservar"
                  className="inline-flex items-center gap-2.5 bg-gold-400 hover:bg-gold-300 text-[#0e1311] font-sans font-semibold text-xs uppercase tracking-wider px-6 py-3.5 rounded-[4px] shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer"
                >
                  <span>{active.buttonText}</span>
                  <div className="w-5 h-5 rounded-full border border-[#0e1311]/40 flex items-center justify-center">
                    <ArrowRight size={12} strokeWidth={2.5} />
                  </div>
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Arrows (Left & Right) */}
        <button
          onClick={prevSlide}
          aria-label="Corte anterior"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#121815]/70 hover:bg-[#161d19] border border-[#26302a] hover:border-gold-400/60 text-white hover:text-gold-400 flex items-center justify-center transition-all backdrop-blur-sm cursor-pointer"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Siguiente corte"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#121815]/70 hover:bg-[#161d19] border border-[#26302a] hover:border-gold-400/60 text-white hover:text-gold-400 flex items-center justify-center transition-all backdrop-blur-sm cursor-pointer"
        >
          <ChevronRight size={20} />
        </button>

        {/* Bottom Pagination Dots & Play/Pause (Matching Reference Image) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 bg-[#121815]/70 border border-[#222a26] px-4 py-1.5 rounded-full backdrop-blur-md">
          <div className="flex items-center gap-2">
            {SLIDES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all rounded-full cursor-pointer ${
                  currentSlide === idx
                    ? 'w-6 h-2 bg-gold-400 border border-gold-400'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/80'
                }`}
                aria-label={`Ir al corte ${idx + 1}`}
              />
            ))}
          </div>

          <div className="w-px h-3.5 bg-[#2b3530]" />

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-[#8e9b94] hover:text-gold-400 transition-colors cursor-pointer"
            title={isPlaying ? 'Pausar slider' : 'Reproducir slider'}
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
          </button>
        </div>
      </div>

      {/* Elegant Editorial Stats Strip */}
      <section className="bg-[#121815] border-b border-[#1f2723] py-6 sm:py-7">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-3 gap-6 text-center divide-x divide-[#1f2723]">
          <div>
            <div className="font-serif italic text-2xl sm:text-3xl text-white font-normal">
              <AnimatedCounter value={7} />+
            </div>
            <div className="font-sans text-[10px] sm:text-xs uppercase tracking-wider text-[#8e9b94] mt-1">
              Años de Maestría
            </div>
          </div>
          <div>
            <div className="font-serif italic text-2xl sm:text-3xl text-white font-normal">
              <AnimatedCounter value={2500} />+
            </div>
            <div className="font-sans text-[10px] sm:text-xs uppercase tracking-wider text-[#8e9b94] mt-1">
              Servicios de Autor
            </div>
          </div>
          <div>
            <div className="font-serif italic text-2xl sm:text-3xl text-gold-400 font-normal">
              <AnimatedCounter value={4.9} />
            </div>
            <div className="font-sans text-[10px] sm:text-xs uppercase tracking-wider text-[#8e9b94] mt-1">
              Calificación Promedio
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Manifesto Block */}
      <section className="border-b border-[#1f2723] bg-[#0c100e] py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="editorial-tag bg-[#161d19] border-[#2b3630] text-gold-400 mb-5">
            Manifiesto Punto Fino
          </span>
          <blockquote className="font-serif italic text-xl sm:text-3xl lg:text-[34px] text-white font-normal leading-[1.35] text-balance">
            “Entendemos el corte de cabello como un ejercicio de visagismo y arquitectura. No perseguimos modas efímeras; esculpimos la presencia, la proporción y el carácter de cada hombre con técnica milimétrica y atención absoluta.”
          </blockquote>
          <div className="mt-7 flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-gold-400/40"></span>
            <span className="font-sans text-xs uppercase tracking-[0.25em] text-[#b3b3b3]">
              Juan David · Master Barber & Asesor de Imagen
            </span>
            <span className="w-8 h-px bg-gold-400/40"></span>
          </div>
        </div>
      </section>
    </div>
  );
}
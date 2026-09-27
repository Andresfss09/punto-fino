import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Pause, Play, ArrowRight, ShieldCheck, Star } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    image: '/images/punto-fino-corte.jpg',
    eyebrow: 'VISAGISMO & CORTE DE AUTOR',
    headline: 'ESCULTURA CAPILAR DE PRECISIÓN',
    description: 'Diagnóstico morfológico según fisonomía craneal y textura capilar. Degradados milimétricos y acabados con navaja libre en Cali.',
    cta: 'RESERVAR EXPERIENCIA',
    link: '#reservar',
  },
  {
    id: 2,
    image: '/images/punto-fino-ritual.jpg',
    eyebrow: 'EXPERIENCIA PLATINIUM',
    headline: 'EL RITUAL SUPREMO GOL DE ORO',
    description: 'Tratamiento integral de lujo: Visagismo, corte milimétrico, ritual de barba con toalla caliente, mascarilla dérmica y vapor ozono.',
    cta: 'EXPLORAR RITUAL',
    link: '#servicios',
  },
  {
    id: 3,
    image: '/images/punto-fino-vapor.jpg',
    eyebrow: 'RITUAL DE BARBA & VAPOR OZONO',
    headline: 'PURIFICACIÓN & RASURADO CLÁSICO',
    description: 'Apertura de poros mediante vapor ozonizado, bálsamos botánicos esenciales y perfilado geométrico con técnica tradicional.',
    cta: 'AGENDAR BARBA',
    link: '#reservar',
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef(null);

  // Auto-play slideshow interval
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
      }, 6500);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const goToSlide = (idx) => {
    setCurrentSlide(idx);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const activeSlide = SLIDES[currentSlide];

  return (
    <div className="relative w-full bg-black text-white overflow-hidden">
      {/* 100vw x 92vh Full-bleed Cinematic Hero Surface */}
      <div className="relative w-full h-[88vh] sm:h-[92vh] min-h-[580px] max-h-[1050px]">
        {/* Background Slide Imagery with cross-fade */}
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={activeSlide.image}
              alt={activeSlide.headline}
              fetchPriority={currentSlide === 0 ? 'high' : 'auto'}
              loading={currentSlide === 0 ? 'eager' : 'lazy'}
              className="w-full h-full object-cover object-center filter brightness-[0.78] contrast-[1.08] transform scale-[1.02]"
            />
            {/* Scrim Overlay for Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30 pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* Copy Cluster — Bottom-Centred / Bottom-Left Hierarchy */}
        <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-20 sm:pb-24">
          <div className="max-w-2xl space-y-4">
            {/* Category Eyebrow */}
            <motion.div
              key={`eyebrow-${activeSlide.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-3"
            >
              <span className="text-[11px] sm:text-xs font-display uppercase tracking-[3px] text-white/70 font-normal">
                {activeSlide.eyebrow}
              </span>
              <span className="h-px w-6 bg-white/30 hidden sm:inline-block" />
              <span className="text-[10px] sm:text-[11px] font-display uppercase tracking-[2px] text-white/50 hidden sm:inline-block">
                PUNTO FINO · CALI
              </span>
            </motion.div>

            {/* Slide Main Headline */}
            <motion.h1
              key={`headline-${activeSlide.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="font-display font-medium text-3xl sm:text-5xl lg:text-6xl text-white tracking-[3px] sm:tracking-[4px] uppercase leading-[1.12]"
            >
              {activeSlide.headline}
            </motion.h1>

            {/* Description */}
            <motion.p
              key={`desc-${activeSlide.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/80 text-xs sm:text-sm max-w-xl font-sans font-light leading-relaxed tracking-wide"
            >
              {activeSlide.description}
            </motion.p>

            {/* Ferrari-Style CTA: Spaced Label + Circle Arrow Button */}
            <motion.div
              key={`cta-${activeSlide.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="pt-2 sm:pt-4"
            >
              <a
                href={activeSlide.link}
                className="group inline-flex items-center gap-4 text-xs font-display uppercase tracking-[2px] text-white transition-all cursor-pointer"
              >
                <span className="border-b border-transparent group-hover:border-white transition-colors duration-200">
                  {activeSlide.cta}
                </span>
                <span className="w-9 h-9 rounded-full border border-white/80 group-hover:border-white group-hover:bg-white group-hover:text-black flex items-center justify-center text-white transition-all duration-300">
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </a>
            </motion.div>
          </div>
        </div>

        {/* Carousel Desktop Side Nav Arrows */}
        <div className="hidden sm:flex absolute inset-y-0 left-4 right-4 z-20 items-center justify-between pointer-events-none">
          <button
            onClick={handlePrev}
            aria-label="Diapositiva anterior"
            className="w-10 h-10 rounded-full border border-white/30 hover:border-white text-white/70 hover:text-white flex items-center justify-center bg-black/30 backdrop-blur-sm pointer-events-auto transition-all cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={handleNext}
            aria-label="Siguiente diapositiva"
            className="w-10 h-10 rounded-full border border-white/30 hover:border-white text-white/70 hover:text-white flex items-center justify-center bg-black/30 backdrop-blur-sm pointer-events-auto transition-all cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Carousel Controls: Centred Dot Indicators + Bottom-Right Pause/Play */}
        <div className="absolute bottom-6 inset-x-0 z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="w-10 hidden sm:block" />

          {/* Centred Dots: Active has Rosso Corsa (#da291c) ring */}
          <div className="flex items-center gap-3 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 mx-auto sm:mx-0">
            {SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => goToSlide(idx)}
                aria-label={`Ir a la diapositiva ${idx + 1}`}
                className="p-1 focus:outline-none cursor-pointer flex items-center justify-center"
              >
                {currentSlide === idx ? (
                  /* Active indicator: Rosso Corsa ring with white inner dot */
                  <span className="w-3.5 h-3.5 rounded-full border border-[#da291c] flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </span>
                ) : (
                  /* Inactive indicator: solid white dot */
                  <span className="w-2 h-2 rounded-full bg-white/40 hover:bg-white transition-colors" />
                )}
              </button>
            ))}
          </div>

          {/* Pause / Play Circular Button */}
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pausar carrusel' : 'Reanudar carrusel'}
            className="w-9 h-9 rounded-full border border-white/50 hover:border-white text-white/80 hover:text-white flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all cursor-pointer"
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
          </button>
        </div>
      </div>

      {/* Atelier Metrics & Authority Band (Ferrari Minimalist Section Band) */}
      <section className="bg-[#0c0c0c] border-y border-[#1f1f1f] py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 items-center divide-y md:divide-y-0 md:divide-x divide-[#222222]">
            {/* Metric 1 */}
            <div className="pt-4 md:pt-0 md:px-4">
              <span className="text-[10px] font-display uppercase tracking-[2px] text-[#888888] block">
                UBICACIÓN OFICIAL
              </span>
              <p className="font-display font-medium text-white text-sm sm:text-base tracking-[1.5px] uppercase mt-1">
                VILLACOLOMBIA, CALI
              </p>
              <p className="text-[11px] text-[#777777] font-sans mt-0.5">Cra 12 #53-51</p>
            </div>

            {/* Metric 2 */}
            <div className="pt-4 md:pt-0 md:px-4">
              <span className="text-[10px] font-display uppercase tracking-[2px] text-[#888888] block">
                VALORACIÓN CLIENTES
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="font-display font-medium text-white text-sm sm:text-base tracking-[1.5px]">
                  4.9 / 5.0
                </span>
                <span className="text-white text-xs">★</span>
              </div>
              <p className="text-[11px] text-[#777777] font-sans mt-0.5">Opiniones verificadas en Weibook</p>
            </div>

            {/* Metric 3 */}
            <div className="pt-4 md:pt-0 md:px-4">
              <span className="text-[10px] font-display uppercase tracking-[2px] text-[#888888] block">
                MAESTROS BARBEROS
              </span>
              <p className="font-display font-medium text-white text-sm sm:text-base tracking-[1.5px] uppercase mt-1">
                3 ESPECIALISTAS
              </p>
              <p className="text-[11px] text-[#777777] font-sans mt-0.5">Juan David · Juan Diego · Emanuel</p>
            </div>

            {/* Metric 4 */}
            <div className="pt-4 md:pt-0 md:px-4">
              <span className="text-[10px] font-display uppercase tracking-[2px] text-[#888888] block">
                AGENDAMIENTO EN LÍNEA
              </span>
              <p className="font-display font-medium text-white text-sm sm:text-base tracking-[1.5px] uppercase mt-1">
                CONFIRMACIÓN INMEDIATA
              </p>
              <p className="text-[11px] text-[#777777] font-sans mt-0.5">Sin registro previo obligatorio</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
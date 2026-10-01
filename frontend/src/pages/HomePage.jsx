import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/home/HeroSection';
import ServicesSection from '../components/home/ServicesSection';
import BeveragesSection from '../components/home/BeveragesSection';
import BarbersSection from '../components/home/BarbersSection';
import ReviewsSection from '../components/home/ReviewsSection';
import LocationSection from '../components/home/LocationSection';
import BookingWizard from '../components/booking/BookingWizard';

export default function HomePage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const timer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location.hash]);

  return (
    <div className="bg-[#0e1311]">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <BeveragesSection />

      {/* Sección de Reserva directa en la página principal */}
      <section id="reservar" className="py-24 sm:py-32 bg-[#000000] border-b border-[#1e1e1e] relative scroll-mt-24">
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-2 h-2 bg-[#cfa53b]"></span>
              <span className="font-sans text-[11px] uppercase tracking-[0.28em] text-[#cfa53b] font-medium">
                04 · RESERVA OFICIAL TRIADIX
              </span>
            </div>
            <h2 className="font-sans uppercase text-3xl sm:text-4xl lg:text-5xl text-white font-medium tracking-[0.16em] leading-tight">
              Agenda tu Experiencia
            </h2>
            <p className="text-[#888888] text-xs sm:text-sm max-w-xl mx-auto mt-3 font-sans leading-relaxed">
              Selecciona tu servicio, tu barbero fundador y el horario ideal. No requieres crear cuenta para agendar; confirmación inmediata por correo electrónico.
            </p>
          </div>

          <BookingWizard isEmbedded={true} />
        </div>
      </section>

      <BarbersSection />
      <ReviewsSection />
      <LocationSection />
    </div>
  );
}
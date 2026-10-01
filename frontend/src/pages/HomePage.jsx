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
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2.5 mb-3">
              <span className="w-2.5 h-2.5 bg-[#cfa53b]"></span>
              <span className="font-sans text-xs sm:text-sm uppercase tracking-[0.26em] text-[#cfa53b] font-bold">
                04 · RESERVA TU CITA EN TRIADIX
              </span>
            </div>
            <h2 className="font-sans uppercase text-4xl sm:text-5xl lg:text-6xl text-white font-black tracking-normal sm:tracking-[0.02em] leading-tight">
              Agenda tu Cita
            </h2>
            <p className="text-[#aaaaaa] text-sm sm:text-base max-w-2xl mx-auto mt-4 font-sans leading-relaxed">
              Selecciona tu servicio, tu barbero de confianza y el horario que mejor te quede. Reserva online en menos de 1 minuto sin necesidad de crear cuenta.
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
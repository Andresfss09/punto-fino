import React from 'react';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/home/HeroSection';
import ServicesSection from '../components/home/ServicesSection';
import BarbersSection from '../components/home/BarbersSection';
import ReviewsSection from '../components/home/ReviewsSection';
import LocationSection from '../components/home/LocationSection';
import BookingWizard from '../components/booking/BookingWizard';

export default function HomePage() {
  return (
    <div className="bg-[#0e1311]">
      <Navbar />
      <HeroSection />
      <ServicesSection />

      {/* Sección de Reserva directa en la página principal */}
      <section id="reservar" className="py-24 sm:py-32 bg-[#0c100e] border-b border-[#1f2723] relative scroll-mt-16">
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="text-center mb-12">
            <span className="editorial-tag bg-[#161d19] border-[#2b3630] text-gold-400 mb-3">
              Reserva en Línea · Punto Fino
            </span>
            <h2 className="font-serif italic text-4xl sm:text-5xl text-white font-normal leading-tight">
              Agenda tu Experiencia
            </h2>
            <p className="text-[#b3b3b3] text-xs sm:text-sm max-w-xl mx-auto mt-3 font-sans leading-relaxed">
              Selecciona tu servicio, tu barbero favorito y el horario ideal. No requieres crear cuenta; incluye bebida de cortesía y confirmación por correo y WhatsApp.
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
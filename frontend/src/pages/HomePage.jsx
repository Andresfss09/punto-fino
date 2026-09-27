import React from 'react';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/home/HeroSection';
import ServicesSection from '../components/home/ServicesSection';
import BarbersSection from '../components/home/BarbersSection';
import ReviewsSection from '../components/home/ReviewsSection';
import BookingWizard from '../components/booking/BookingWizard';

export default function HomePage() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <HeroSection />
      <ServicesSection />

      {/* Booking Section — Ferrari Digital Surface Spec */}
      <section id="reservar" className="py-24 sm:py-32 bg-black border-b border-[#222222] relative scroll-mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] font-display uppercase tracking-[3px] text-[#888888] font-normal block mb-2">
              AGENDAMIENTO EN LÍNEA · CONFIRMACIÓN INMEDIATA
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium uppercase tracking-[3px] text-white">
              AGENDA TU CITA
            </h2>
            <p className="text-[#888888] text-xs sm:text-sm max-w-lg mx-auto mt-3 font-sans leading-relaxed">
              Elige tu experiencia, selecciona a tu maestro barbero y la fecha ideal. No requieres crear cuenta previa para reservar tu cupo en Cali.
            </p>
          </div>

          <BookingWizard isEmbedded={true} />
        </div>
      </section>

      <BarbersSection />
      <ReviewsSection />
    </div>
  );
}
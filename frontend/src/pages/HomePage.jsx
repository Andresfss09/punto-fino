import React from 'react';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/home/HeroSection';
import ServicesSection from '../components/home/ServicesSection';
import BarbersSection from '../components/home/BarbersSection';
import ReviewsSection from '../components/home/ReviewsSection';
import BookingWizard from '../components/booking/BookingWizard';

export default function HomePage() {
  return (
    <div className="bg-dark-400">
      <Navbar />
      <HeroSection />
      <ServicesSection />

      {/* Sección de Reserva directa en la página principal (Sin necesidad de crear cuenta) */}
      <section id="reservar" className="py-24 bg-[#0d0d0d] border-t-2 border-white/5 relative scroll-mt-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="text-center mb-12">
            <span className="text-xs uppercase font-mono tracking-[0.3em] text-gold-500 font-bold block mb-2">
              RESERVA RÁPIDA Y DIRECTA
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold uppercase tracking-wider text-white">
              Agenda tu <span className="text-gold-500">Cita</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto mt-3 font-sans">
              Selecciona tu servicio, tu barbero favorito y la hora. No requieres crear cuenta previa; llena tus datos y te enviaremos la confirmación a tu correo.
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
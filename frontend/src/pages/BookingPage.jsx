import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import PageTransition from '../components/ui/PageTransition';
import useAuthStore from '../store/useAuthStore';
import BookingWizard from '../components/booking/BookingWizard';

export default function BookingPage() {
  const { isAuthenticated, user, isBarber, isAdmin } = useAuthStore();
  const navigate = useNavigate();

  // Si un barbero o admin intenta agendar citas como cliente, redirigir a su propio panel
  useEffect(() => {
    if (isAuthenticated) {
      if (isBarber?.() || user?.role === 'barbero') {
        navigate('/barber', { replace: true });
      } else if (isAdmin?.() || user?.role === 'admin') {
        navigate('/admin', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, isBarber, isAdmin]);

  if (isAuthenticated && (user?.role === 'barbero' || user?.role === 'admin')) {
    return null;
  }

  return (
    <PageTransition>
      <Navbar />
      <div className="min-h-screen bg-[#0e1311] text-white pt-28 pb-32 sm:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="mb-12 text-center">
            <span className="editorial-tag bg-[#161d19] border-[#2b3630] text-gold-400 mb-3">
              Punto Fino · Barbería de Autor · Cali
            </span>
            <h1 className="font-serif italic text-4xl sm:text-6xl text-white font-normal mb-3 leading-tight">
              Agenda tu Cita de Autor
            </h1>
            <p className="text-[#b3b3b3] font-sans text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              Elige tu corte o experiencia, tu maestro barbero y el horario de tu preferencia. Sin necesidad de crear cuenta previa.
            </p>
          </div>

          <BookingWizard />
        </div>
      </div>
    </PageTransition>
  );
}
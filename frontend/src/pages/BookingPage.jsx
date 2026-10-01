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
      <div className="min-h-screen bg-[#000000] text-white pt-28 pb-32 sm:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="mb-12 text-center">
            <span className="px-2.5 py-0.5 border border-[#222222] bg-[#141414] text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-[#cfa53b] inline-block mb-4">
              Triadix Barber Studio · Cali
            </span>
            <h1 className="font-sans font-medium uppercase tracking-[0.2em] text-3xl sm:text-4xl text-white mb-3">
              Agenda tu Cita
            </h1>
            <p className="text-[#888888] font-sans text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              Elige tu corte o experiencia, tu barbero y el horario de tu preferencia. Sin necesidad de crear cuenta previa.
            </p>
          </div>

          <BookingWizard />
        </div>
      </div>
    </PageTransition>
  );
}
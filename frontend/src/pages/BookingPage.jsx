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
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-32 sm:pb-20">
        <div className="mb-10 text-center">
          <span className="text-gold-500 font-mono text-xs uppercase tracking-[0.3em] font-bold block mb-2">
            STEEL HOUSE BARBERIA'S 👑 · CALI
          </span>
          <h1 className="font-display text-4xl sm:text-5xl uppercase text-white mb-2 leading-tight">
            AGENDA TU <span className="text-gold-500">CITA</span>
          </h1>
          <p className="text-gray-400 font-sans text-sm max-w-lg mx-auto">
            Elige tu corte, barbero preferido y horario disponible. Sin necesidad de crear cuenta previa.
          </p>
        </div>

        <BookingWizard />
      </div>
    </PageTransition>
  );
}
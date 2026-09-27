import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import PageTransition from '../components/ui/PageTransition';
import useAuthStore from '../store/useAuthStore';
import BookingWizard from '../components/booking/BookingWizard';

export default function BookingPage() {
  const { isAuthenticated, user, isBarber, isAdmin } = useAuthStore();
  const navigate = useNavigate();

  // If a barber or admin navigates here, redirect to their panel
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
      <div className="min-h-screen bg-black text-white pt-32 pb-32 sm:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="mb-12 text-center">
            <span className="text-[11px] font-display uppercase tracking-[3px] text-[#888888] block mb-2 font-normal">
              PUNTO FINO · VILLACOLOMBIA, CALI
            </span>
            <h1 className="font-display font-medium text-3xl sm:text-5xl text-white uppercase tracking-[3px] mb-3 leading-tight">
              AGENDAR CITA
            </h1>
            <p className="text-[#888888] font-sans text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              Elige tu experiencia, tu maestro barbero y la fecha ideal. Confirmación instantánea y recordatorio directo a tu WhatsApp.
            </p>
          </div>

          <BookingWizard />
        </div>
      </div>
    </PageTransition>
  );
}
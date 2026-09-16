import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, User, Calendar, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import PageTransition from '../components/ui/PageTransition';
import useAuthStore from '../store/useAuthStore';
import { serviceService } from '../services/serviceService';
import { barberService } from '../services/barberService';
import { appointmentService } from '../services/appointmentService';
import toast from 'react-hot-toast';

import ServiceSelector from '../components/booking/ServiceSelector';
import BarberSelector from '../components/booking/BarberSelector';
import TimeSlotPicker from '../components/booking/TimeSlotPicker';
import BookingConfirmation from '../components/booking/BookingConfirmation';

const STEPS = [
  { id: 1, label: 'Servicio', icon: Scissors },
  { id: 2, label: 'Barbero', icon: User },
  { id: 3, label: 'Fecha/Hora', icon: Calendar },
  { id: 4, label: 'Confirmar', icon: Check },
];

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0
  })
};

export default function BookingPage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingBarbers, setLoadingBarbers] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setLoadingServices(true);
    serviceService
      .getAll({ isActive: true })
      .then((res) => {
        const lista = res.services || [];
        setServices(Array.isArray(lista) ? lista : []);
      })
      .catch(() => toast.error('Error cargando servicios'))
      .finally(() => setLoadingServices(false));

    setLoadingBarbers(true);
    barberService
      .getAll()
      .then((res) => {
        const lista = res.barbers || [];
        setBarbers(Array.isArray(lista) ? lista : []);
      })
      .catch(() => {})
      .finally(() => setLoadingBarbers(false));
  }, []);

  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);

  useEffect(() => {
    if (selectedBarber && selectedDate && totalDuration > 0) {
      setLoadingSlots(true);
      setSelectedSlot('');
      
      const barberId = selectedBarber._id === 'any' ? null : (selectedBarber.user?._id || selectedBarber._id);
      
      const params = {
        date: selectedDate,
        duration: totalDuration,
      };
      if (barberId) params.barberId = barberId;

      appointmentService
        .getAvailableSlots(params)
        .then((res) => {
          const lista = res.slots || [];
          setSlots(Array.isArray(lista) ? lista : []);
        })
        .catch(() => setSlots([]))
        .finally(() => setLoadingSlots(false));
    }
  }, [selectedBarber, selectedDate, selectedServices, totalDuration]);

  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.find((s) => s._id === service._id)
        ? prev.filter((s) => s._id !== service._id)
        : [...prev, service]
    );
  };

  const getTodayDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const canProceed = () => {
    if (step === 1) return selectedServices.length > 0;
    if (step === 2) return selectedBarber !== null;
    if (step === 3) {
      if (!selectedDate || !selectedSlot) return false;
      if (selectedDate < getTodayDate()) return false;
      return true;
    }
    return true;
  };

  const nextStep = () => {
    if (canProceed()) {
      setDirection(1);
      setStep(s => s + 1);
    }
  };

  const prevStep = () => {
    setDirection(-1);
    setStep(s => s - 1);
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para reservar');
      navigate('/login');
      return;
    }
    setSubmitting(true);
    try {
      await appointmentService.create({
        barberId: selectedBarber._id === 'any' ? null : (selectedBarber.user?._id || selectedBarber._id),
        serviceIds: selectedServices.map((s) => s._id),
        date: selectedDate,
        startTime: selectedSlot,
        paymentMethod,
        notes,
      });
      toast.success('¡Cita reservada exitosamente! 🎉');
      navigate('/cliente');
    } catch (error) {
      toast.error(error.message || 'Error al reservar');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-32 sm:pb-16">
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl sm:text-5xl uppercase text-white mb-2 leading-tight">
            AGENDA TU <span className="text-[#d4af37]">CITA</span>
          </h1>
          <p className="text-[#a0a0a0] font-mono text-sm uppercase tracking-widest">
            SISTEMA DE RESERVAS PUNTO FINO
          </p>
        </div>

        {/* Neo-brutalist Stepper */}
        <div className="mb-12 relative px-2">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#333] -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-0 h-1 bg-[#d4af37] -translate-y-1/2 z-0 transition-all duration-500 ease-out"
            style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
          />
          <div className="flex justify-between relative z-10">
            {STEPS.map((s) => {
              const isActive = step === s.id;
              const isCompleted = step > s.id;
              return (
                <div key={s.id} className="flex flex-col items-center">
                  <div 
                    className={`w-12 h-12 flex items-center justify-center border-2 transition-all duration-300 ${
                      isActive 
                        ? 'bg-[#d4af37] border-[#0a0a0a] shadow-[4px_4px_0_#0a0a0a] scale-110' 
                        : isCompleted
                        ? 'bg-[#22c55e] border-[#0a0a0a] shadow-[2px_2px_0_#0a0a0a] text-black'
                        : 'bg-[#111111] border-[#333] text-[#666]'
                    }`}
                  >
                    {isCompleted ? <Check size={20} strokeWidth={3} /> : <s.icon size={20} strokeWidth={isActive ? 3 : 2} className={isActive ? 'text-black' : ''} />}
                  </div>
                  <span className={`mt-3 font-bold text-xs uppercase tracking-wider hidden sm:block ${
                    isActive ? 'text-[#d4af37]' : isCompleted ? 'text-[#22c55e]' : 'text-[#666]'
                  }`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
              className="w-full"
            >
              {step === 1 && (
                <ServiceSelector 
                  services={services}
                  selectedServices={selectedServices}
                  onToggleService={toggleService}
                  isLoading={loadingServices}
                />
              )}
              {step === 2 && (
                <BarberSelector 
                  barbers={barbers}
                  selectedBarber={selectedBarber}
                  onSelectBarber={setSelectedBarber}
                  isLoading={loadingBarbers}
                />
              )}
              {step === 3 && (
                <TimeSlotPicker 
                  selectedDate={selectedDate}
                  onSelectDate={(d) => { setSelectedDate(d); setSelectedSlot(''); }}
                  availableSlots={slots}
                  selectedSlot={selectedSlot}
                  onSelectSlot={setSelectedSlot}
                  isLoading={loadingSlots}
                />
              )}
              {step === 4 && (
                <BookingConfirmation 
                  bookingData={{
                    selectedServices,
                    selectedBarber,
                    selectedDate,
                    selectedSlot,
                    totalPrice: selectedServices.reduce((sum, s) => sum + s.price, 0),
                    totalDuration,
                    paymentMethod,
                    setPaymentMethod,
                    notes,
                    setNotes
                  }}
                  onConfirm={handleSubmit}
                  onBack={prevStep}
                  isSubmitting={submitting}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        {step < 4 && (
          <div className="fixed sm:relative bottom-0 left-0 right-0 p-4 sm:p-0 bg-[#0a0a0a] sm:bg-transparent border-t-2 sm:border-0 border-[#333] mt-8 flex gap-4 z-50">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="brutal-btn-outline px-6 py-4 flex-1 sm:flex-none flex justify-center items-center gap-2"
              >
                <ChevronLeft size={20} strokeWidth={3} />
                <span className="hidden sm:inline">Atrás</span>
              </button>
            )}
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className={`brutal-btn-primary px-6 py-4 flex-[2] sm:flex-1 flex justify-center items-center gap-2 ${
                !canProceed() ? 'opacity-50 cursor-not-allowed bg-[#333] border-[#333] shadow-none text-[#666] active:translate-x-0 active:translate-y-0' : ''
              }`}
            >
              <span className="hidden sm:inline">Siguiente</span>
              <span className="sm:hidden">Continuar</span>
              <ChevronRight size={20} strokeWidth={3} />
            </button>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
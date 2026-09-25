import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scissors, 
  User, 
  Calendar, 
  Check, 
  Clock, 
  CheckCircle2, 
  Copy, 
  MessageSquare, 
  ExternalLink, 
  RotateCcw,
  Sparkles,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/useAuthStore';
import { serviceService } from '../../services/serviceService';
import { barberService } from '../../services/barberService';
import { appointmentService } from '../../services/appointmentService';
import BrutalCard from '../ui/BrutalCard';
import { formatTime, formatPrice } from '../../utils/formatters';

import ServiceSelector from './ServiceSelector';
import BarberSelector from './BarberSelector';
import TimeSlotPicker from './TimeSlotPicker';
import BookingConfirmation from './BookingConfirmation';

const STEPS = [
  { id: 1, label: 'Servicio', icon: Scissors },
  { id: 2, label: 'Barbero', icon: User },
  { id: 3, label: 'Fecha/Hora', icon: Calendar },
  { id: 4, label: 'Tus Datos & Confirmación', icon: Check },
];

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? 80 : -80,
    opacity: 0,
  }),
};

export default function BookingWizard({ isEmbedded = false, initialServiceId = null }) {
  const { user, isAuthenticated } = useAuthStore();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingBarbers, setLoadingBarbers] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Booking selections
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [notes, setNotes] = useState('');

  // Client Details Form (No need to create an account)
  const [clientData, setClientData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  // Success view state
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Sync user info if logged in
  useEffect(() => {
    if (user) {
      setClientData((prev) => ({
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        address: prev.address || user.address || '',
      }));
    }
  }, [user]);

  // Load services and barbers
  useEffect(() => {
    setLoadingServices(true);
    serviceService
      .getAll({ isActive: true })
      .then((res) => {
        const lista = res.services || [];
        const validList = Array.isArray(lista) ? lista : [];
        setServices(validList);

        // Preselect initial service if requested
        if (initialServiceId && validList.length > 0) {
          const match = validList.find((s) => s._id === initialServiceId || s.name === initialServiceId);
          if (match) setSelectedServices([match]);
        }
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
  }, [initialServiceId]);

  const totalDuration = selectedServices.reduce((sum, s) => sum + (s.duration || 40), 0);
  const totalPrice = selectedServices.reduce((sum, s) => sum + (s.price || 0), 0);

  // Load available time slots when barber, date and duration are set
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
  }, [selectedBarber, selectedDate, totalDuration]);

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
      setStep((s) => s + 1);
    }
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  // Submit appointment (Supports guest and logged in clients)
  const handleSubmit = async () => {
    // Validate client details
    if (!clientData.name?.trim()) {
      toast.error('Por favor ingresa tu nombre completo');
      return;
    }
    if (!clientData.email?.trim() || !clientData.email.includes('@')) {
      toast.error('Por favor ingresa un correo electrónico válido');
      return;
    }
    if (!clientData.phone?.trim() || clientData.phone.replace(/\D/g, '').length < 7) {
      toast.error('Por favor ingresa un número de teléfono válido');
      return;
    }
    if (!clientData.address?.trim()) {
      toast.error('Por favor ingresa tu dirección');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        barberId: selectedBarber._id === 'any' ? null : (selectedBarber.user?._id || selectedBarber._id),
        serviceIds: selectedServices.map((s) => s._id),
        date: selectedDate,
        startTime: selectedSlot,
        paymentMethod,
        notes,
        clientName: clientData.name.trim(),
        clientEmail: clientData.email.trim(),
        clientPhone: clientData.phone.trim(),
        clientAddress: clientData.address.trim(),
      };

      const res = await appointmentService.create(payload);
      const appointmentData = res.data || res;
      setBookingSuccess(appointmentData);
      toast.success('¡Cita reservada exitosamente! Se envió confirmación a tu correo. 🎉');
    } catch (error) {
      console.error('Error al reservar:', error);
      toast.error(error.message || 'Error al agendar la cita. Por favor intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetBooking = () => {
    setBookingSuccess(null);
    setStep(1);
    setSelectedServices([]);
    setSelectedBarber(null);
    setSelectedDate('');
    setSelectedSlot('');
    setNotes('');
  };

  const handleCopyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    toast.success('¡Código copiado al portapapeles!');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // SUCCESS SCREEN
  if (bookingSuccess) {
    const apt = bookingSuccess.appointment || {};
    const code = bookingSuccess.confirmationCode || apt.confirmationCode || 'SH-CONFIRMADA';
    const barberName = apt.barber?.name || selectedBarber?.user?.name || 'Barbero Steel House';
    const clientEmail = clientData.email;

    return (
      <div className="max-w-3xl mx-auto py-8">
        <BrutalCard variant="gold" className="text-center p-8 sm:p-12 relative overflow-hidden">
          {/* Top Crown Badge */}
          <div className="inline-flex items-center gap-2 bg-black border-2 border-gold-500 px-4 py-2 rounded-full mb-6 shadow-brutal-gold-sm">
            <Sparkles size={18} className="text-gold-500 animate-pulse" />
            <span className="text-xs uppercase font-mono tracking-widest text-gold-400 font-bold">
              RESERVA CONFIRMADA · STEEL HOUSE
            </span>
          </div>

          <div className="w-20 h-20 bg-green-500/10 border-3 border-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} className="text-green-400" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-display font-bold uppercase text-white tracking-wide mb-3">
            ¡Tu Cita Ha Sido Agendada!
          </h2>

          <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed font-sans">
            Hemos enviado un correo con todos los detalles a <span className="text-gold-400 font-bold">{clientEmail}</span> y tu barbero <span className="text-white font-semibold">{barberName}</span> ha sido notificado.
          </p>

          {/* Reservation Code Box */}
          <div className="bg-[#111111] border-2 border-gold-500 p-5 rounded-xl max-w-md mx-auto mb-8 shadow-brutal-gold-sm">
            <p className="text-xs uppercase font-mono text-gray-400 font-bold mb-1">
              Código Único de Reserva
            </p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl sm:text-3xl font-mono-price font-bold text-gold-400 tracking-wider">
                {code}
              </span>
              <button
                onClick={() => handleCopyCode(code)}
                className="p-2 bg-[#222] hover:bg-gold-500 hover:text-black border border-white/20 rounded-lg text-gray-300 transition-all"
                title="Copiar código"
              >
                {copiedCode ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          {/* Compact Appointment Details */}
          <div className="bg-[#141414] border-2 border-[#333] p-6 rounded-xl text-left max-w-lg mx-auto mb-8 space-y-3 font-sans text-sm">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-gray-400">Cliente:</span>
              <span className="font-semibold text-white uppercase">{clientData.name}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-gray-400">Barbero Asignado:</span>
              <span className="font-semibold text-gold-400">{barberName}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-gray-400">Fecha y Hora:</span>
              <span className="font-mono font-semibold text-white capitalize">
                {new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' })} · {formatTime(selectedSlot)}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-gray-400">Servicio(s):</span>
              <span className="font-medium text-white text-right">
                {selectedServices.map((s) => s.name).join(' + ')}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-gray-400">Dirección registrada:</span>
              <span className="font-medium text-gray-300 text-right">{clientData.address}</span>
            </div>
            <div className="flex justify-between items-center pt-1 text-base">
              <span className="text-gray-300 font-bold uppercase font-mono">Total a pagar:</span>
              <span className="font-mono-price font-bold text-gold-400 text-xl">
                {formatPrice(totalPrice)} <span className="text-xs text-gray-400">({paymentMethod})</span>
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <button
              onClick={handleResetBooking}
              className="w-full sm:w-auto brutal-btn bg-[#1a1a1a] text-white border-2 border-[#333] hover:border-gold-500 px-6 py-3.5 flex items-center justify-center gap-2 text-sm font-bold uppercase rounded-xl transition-all"
            >
              <RotateCcw size={16} />
              Agendar Otra Cita
            </button>
            <a
              href={`https://wa.me/573158965266?text=Hola,%20acabo%20de%20agendar%20mi%20cita%20con%20c%C3%B3digo%20${code}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto brutal-btn-primary px-6 py-3.5 flex items-center justify-center gap-2 text-sm rounded-xl"
            >
              <MessageSquare size={16} />
              WhatsApp Barbería
            </a>
          </div>
        </BrutalCard>
      </div>
    );
  }

  // WIZARD SCREEN
  return (
    <div className="w-full">
      {/* Stepper */}
      <div className="mb-10 relative px-2 max-w-2xl mx-auto">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#333] -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-0 h-1 bg-gold-500 -translate-y-1/2 z-0 transition-all duration-500 ease-out"
          style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
        />
        <div className="flex justify-between relative z-10">
          {STEPS.map((s) => {
            const isActive = step === s.id;
            const isCompleted = step > s.id;
            return (
              <div key={s.id} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => {
                    if (isCompleted) {
                      setDirection(-1);
                      setStep(s.id);
                    }
                  }}
                  disabled={!isCompleted && !isActive}
                  className={`w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center border-2 transition-all duration-300 rounded-xl cursor-pointer ${
                    isActive
                      ? 'bg-gold-500 border-black shadow-brutal-gold scale-110 text-black'
                      : isCompleted
                      ? 'bg-green-500 border-black text-black shadow-sm'
                      : 'bg-[#141414] border-[#333] text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isCompleted ? (
                    <Check size={20} strokeWidth={3} />
                  ) : (
                    <s.icon size={18} strokeWidth={isActive ? 3 : 2} />
                  )}
                </button>
                <span
                  className={`mt-2 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider hidden sm:block ${
                    isActive ? 'text-gold-400' : isCompleted ? 'text-green-400' : 'text-gray-500'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="relative min-h-[380px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
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
                slots={slots}
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                onSelectDate={setSelectedDate}
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
                  totalPrice,
                  totalDuration,
                  paymentMethod,
                  setPaymentMethod,
                  notes,
                  setNotes,
                  clientData,
                  setClientData,
                }}
                onConfirm={handleSubmit}
                onBack={prevStep}
                isSubmitting={submitting}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons for Steps 1-3 */}
      {step < 4 && (
        <div className="flex justify-between items-center gap-4 mt-8 pt-6 border-t-2 border-dashed border-[#333]">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 1}
            className={`brutal-btn-outline px-6 py-3 text-sm uppercase font-bold rounded-xl transition-all ${
              step === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:border-gold-500'
            }`}
          >
            Atrás
          </button>

          <button
            type="button"
            onClick={nextStep}
            disabled={!canProceed()}
            className={`brutal-btn-primary px-8 py-3 text-sm uppercase font-bold rounded-xl shadow-brutal-gold transition-all ${
              !canProceed() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Continuar
          </button>
        </div>
      )}
    </div>
  );
}

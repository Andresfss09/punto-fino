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

const FALLBACK_SERVICES = [
  {
    _id: '6ab429b351b742ce20f96ab4',
    name: 'Experiencia White',
    description: 'Corte de cabello profesional, perfilación de cejas, orientación según fisionomía y acabado profesional.',
    price: 22000,
    duration: 35,
    category: 'combo',
    isPopular: true,
    isActive: true,
  },
  {
    _id: '6ab429b351b742ce20f96ab5',
    name: 'Experiencia Black',
    description: 'Corte de cabello profesional, mascarilla facial purificante, exfoliación, aceite hidratante, perfilado de cejas y barba.',
    price: 40000,
    duration: 45,
    category: 'combo',
    isPopular: true,
    isActive: true,
  },
  {
    _id: '6ab429b351b742ce20f96ab6',
    name: 'Experiencia Gold VIP 👑',
    description: 'Servicio de lujo total: Corte + barba + cejas, asesoría personalizada de imagen, hidratación facial profunda y vaporozono frío/caliente.',
    price: 75000,
    duration: 60,
    category: 'combo',
    isPopular: true,
    isActive: true,
  },
  {
    _id: '6ab429b351b742ce20f96ab7',
    name: 'Perfilado de Barba',
    description: 'Diseño de barba a navaja libre, toalla caliente relajante, exfoliación y aplicación de aceites esenciales.',
    price: 16000,
    duration: 25,
    category: 'barba',
    isPopular: false,
    isActive: true,
  },
  {
    _id: '6ab429b351b742ce20f96ab8',
    name: 'Corte Clásico / Fade',
    description: 'Degradado limpio a navaja o corte clásico a tijera con pulido milimétrico.',
    price: 20000,
    duration: 35,
    category: 'corte',
    isPopular: false,
    isActive: true,
  },
  {
    _id: '6ab429b351b742ce20f96ab9',
    name: 'Mascarilla Facial Hidratante',
    description: 'Tratamiento facial limpiador, exfoliación de poros e hidratación profunda con aceites revitalizantes.',
    price: 25000,
    duration: 30,
    category: 'tratamiento',
    isPopular: false,
    isActive: true,
  },
];

const FALLBACK_BARBERS = [
  {
    _id: '6ab429b62a8371bc3f9ee10c',
    user: {
      _id: '6ab429b52a8371bc3f9ee10b',
      name: 'Juan Muñeton',
      email: 'juan@puntofino.com',
      phone: '3158965266',
    },
    bio: 'Fundador y Master Barber. Especialista en la Experiencia Gold, visagismo y cortes de alta precisión.',
    specialties: ['degradado', 'corte clásico', 'barba', 'diseño'],
    rating: { average: 5.0, count: 42 },
    isAvailable: true,
  },
  {
    _id: '6ab429b62a8371bc3f9ee115',
    user: {
      _id: '6ab429b62a8371bc3f9ee114',
      name: 'Carlos Mendoza',
      email: 'carlos@puntofino.com',
      phone: '3109876543',
    },
    bio: 'Especialista en degradados limpios, perfilado de barba al detalle y cuidado capilar.',
    specialties: ['degradado', 'corte clásico', 'barba'],
    rating: { average: 4.9, count: 28 },
    isAvailable: true,
  },
  {
    _id: '6ab4239e4bfe1bd8baae880d',
    user: {
      _id: '6ab4239d4bfe1bd8baae880c',
      name: 'Mateo Gómez',
      email: 'mateo@puntofino.com',
      phone: '3205556677',
    },
    bio: 'Especialista en perfilado de barba al detalle, diseños urbanos y tratamientos faciales.',
    specialties: ['barba', 'diseño', 'mascarilla'],
    rating: { average: 4.8, count: 19 },
    isAvailable: true,
  },
];

export default function BookingWizard({ isEmbedded = false, initialServiceId = null }) {
  const { user, isAuthenticated } = useAuthStore();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const [services, setServices] = useState(FALLBACK_SERVICES);
  const [barbers, setBarbers] = useState(FALLBACK_BARBERS);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingBarbers, setLoadingBarbers] = useState(false);
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

  // Load services and barbers from API (updates seamlessly)
  useEffect(() => {
    serviceService
      .getAll({ isActive: true })
      .then((res) => {
        const lista = res.services || res.data?.services || [];
        if (Array.isArray(lista) && lista.length > 0) {
          setServices(lista);
          if (initialServiceId) {
            const match = lista.find((s) => s._id === initialServiceId || s.name === initialServiceId);
            if (match) setSelectedServices([match]);
          }
        }
      })
      .catch((err) => {
        console.warn('Servicios iniciales cargados desde Punto Fino:', err);
      });

    barberService
      .getAll()
      .then((res) => {
        const lista = res.barbers || res.data?.barbers || [];
        if (Array.isArray(lista) && lista.length > 0) {
          setBarbers(lista);
        }
      })
      .catch((err) => {
        console.warn('Barberos iniciales cargados desde Punto Fino:', err);
      });
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
          const lista = res.slots || res.data?.slots || [];
          setSlots(Array.isArray(lista) ? lista : []);
        })
        .catch((err) => {
          console.error('Error al obtener horarios disponibles:', err);
          setSlots([]);
        })
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
    const code = bookingSuccess.confirmationCode || apt.confirmationCode || 'PF-CONFIRMADA';
    const barberName = apt.barber?.name || selectedBarber?.user?.name || 'Master Barber Punto Fino';
    const clientEmail = clientData.email;

    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-[#121815] border border-[#cfa53b]/40 rounded-[4px] text-center p-8 sm:p-12 relative overflow-hidden shadow-subtle">
          {/* Top Crown Badge */}
          <div className="inline-flex items-center gap-2 bg-[#161d19] border border-gold-400/40 px-4 py-1.5 rounded-[4px] mb-6">
            <Sparkles size={14} className="text-gold-400 animate-pulse" />
            <span className="text-xs uppercase font-sans tracking-[0.2em] text-gold-400 font-semibold">
              Reserva Confirmada · Punto Fino
            </span>
          </div>

          <div className="w-16 h-16 bg-green-500/10 border border-green-500/40 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={36} className="text-green-400" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif italic text-white font-normal mb-3">
            ¡Tu Cita Ha Sido Agendada!
          </h2>

          <p className="text-[#b3b3b3] text-xs sm:text-sm max-w-lg mx-auto mb-8 leading-relaxed font-sans">
            Hemos enviado un correo con todos los detalles a <span className="text-gold-400 font-medium">{clientEmail}</span> y tu maestro barbero <span className="text-white font-medium">{barberName}</span> ha sido notificado.
          </p>

          {/* Reservation Code Box */}
          <div className="bg-[#161d19] border border-[#2b3530] p-4.5 rounded-[4px] max-w-sm mx-auto mb-8">
            <p className="text-[11px] uppercase font-sans text-[#808080] font-medium tracking-wider mb-1">
              Código Único de Reserva
            </p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-mono text-gold-400 tracking-wider font-semibold">
                {code}
              </span>
              <button
                onClick={() => handleCopyCode(code)}
                className="p-1.5 bg-[#1f2723] hover:bg-gold-400 hover:text-[#0e1311] border border-[#333d38] rounded-[4px] text-[#dfdbca] transition-all cursor-pointer"
                title="Copiar código"
              >
                {copiedCode ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          {/* Compact Appointment Details */}
          <div className="bg-[#161d19] border border-[#222a26] p-5 sm:p-6 rounded-[4px] text-left max-w-md mx-auto mb-8 space-y-3 font-sans text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-[#222a26]">
              <span className="text-[#808080]">Cliente:</span>
              <span className="font-medium text-white uppercase">{clientData.name}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[#222a26]">
              <span className="text-[#808080]">Barbero Asignado:</span>
              <span className="font-serif italic text-sm text-gold-400">{barberName}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[#222a26]">
              <span className="text-[#808080]">Fecha y Hora:</span>
              <span className="font-mono text-white capitalize">
                {new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' })} · {formatTime(selectedSlot)}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[#222a26]">
              <span className="text-[#808080]">Servicio(s):</span>
              <span className="font-serif italic text-white text-right">
                {selectedServices.map((s) => s.name).join(' + ')}
              </span>
            </div>
            {clientData.address && (
              <div className="flex justify-between items-center pb-2 border-b border-[#222a26]">
                <span className="text-[#808080]">Dirección registrada:</span>
                <span className="text-[#b3b3b3] text-right truncate max-w-[200px]">{clientData.address}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-1 text-sm">
              <span className="text-[#dfdbca] uppercase font-sans text-xs font-semibold">Total:</span>
              <span className="price-pill">
                {formatPrice(totalPrice)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-sm mx-auto">
            <button
              onClick={handleResetBooking}
              className="w-full sm:w-auto btn-secondary text-xs uppercase tracking-wider py-2.5 px-5"
            >
              <RotateCcw size={14} />
              Agendar Otra
            </button>
            <a
              href={`https://wa.me/573158965266?text=Hola,%20acabo%20de%20agendar%20mi%20cita%20con%20c%C3%B3digo%20${code}%20en%20Punto%20Fino`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto btn-primary text-xs uppercase tracking-wider py-2.5 px-5"
            >
              <MessageSquare size={14} />
              WhatsApp Atelier
            </a>
          </div>
        </div>
      </div>
    );
  }

  // WIZARD SCREEN
  return (
    <div className="w-full">
      {/* Stepper */}
      <div className="mb-10 relative px-2 max-w-2xl mx-auto">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-[#222a26] -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-0 h-px bg-gold-400 -translate-y-1/2 z-0 transition-all duration-500 ease-out"
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
                  className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center border transition-all duration-200 rounded-[4px] cursor-pointer ${
                    isActive
                      ? 'bg-gold-400 border-gold-400 text-[#0e1311] shadow-sm font-semibold'
                      : isCompleted
                      ? 'bg-[#19221d] border-gold-400/50 text-gold-400'
                      : 'bg-[#121815] border-[#222a26] text-[#808080] cursor-not-allowed'
                  }`}
                >
                  {isCompleted ? (
                    <Check size={18} strokeWidth={2.5} />
                  ) : (
                    <s.icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                  )}
                </button>
                <span
                  className={`mt-2 font-sans text-[11px] uppercase tracking-wider hidden sm:block ${
                    isActive ? 'text-gold-400 font-semibold' : isCompleted ? 'text-white' : 'text-[#808080]'
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
                availableSlots={slots}
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
        <div className="flex justify-between items-center gap-4 mt-8 pt-6 border-t border-[#1f2723]">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 1}
            className={`btn-secondary text-xs uppercase tracking-wider py-2.5 px-6 ${
              step === 1 ? 'opacity-30 cursor-not-allowed' : ''
            }`}
          >
            Atrás
          </button>

          <button
            type="button"
            onClick={nextStep}
            disabled={!canProceed()}
            className={`btn-primary text-xs uppercase tracking-wider py-2.5 px-7 ${
              !canProceed() ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            Continuar
          </button>
        </div>
      )}
    </div>
  );
}

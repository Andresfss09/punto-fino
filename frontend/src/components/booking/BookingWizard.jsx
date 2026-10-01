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
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? 60 : -60,
    opacity: 0,
  }),
};

const FALLBACK_SERVICES = [
  {
    _id: '6ab429b351b742ce20f96ab4',
    name: 'Experiencia Triadix Signature (Gol de Oro)',
    description: 'Una experiencia integral: orientación personalizada, corte de cabello, cejas, afeitado facial, exfoliación, vapor ozono frío/caliente, mascarilla para puntos negros, velo hidratante, lavado capilar y masaje relajante.',
    price: 55000,
    duration: 60,
    category: 'combo',
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80',
    isPopular: true,
    isActive: true,
  },
  {
    _id: '6ab429b351b742ce20f96ab5',
    name: 'Experiencia Triadix + Ritual de Barba',
    description: 'Orientación personalizada, corte de cabello, lavado capilar y producto profesional. Además, Ritual de Barba con vapor ozono frío y caliente, exfoliación facial, suave afeitado a navaja y aceites hidratantes.',
    price: 34000,
    duration: 45,
    category: 'combo',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1200&q=80',
    isPopular: true,
    isActive: true,
  },
  {
    _id: '6ab429b351b742ce20f96ab6',
    name: 'Experiencia Triadix (Corte + Cejas)',
    description: 'Servicio insignia de Corte y Ceja. Incluye visagismo según morfología craneal, corte milimétrico de precisión, perfilado de cejas, lavado capilar y peinado con producto profesional.',
    price: 24000,
    duration: 35,
    category: 'corte',
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=1200&q=80',
    isPopular: true,
    isActive: true,
  },
  {
    _id: '6ab429b351b742ce20f96ab7',
    name: 'Ritual de Barba',
    description: 'Cuidado integral de barba: diseño según tu tipo de rostro, exfoliación facial, vapor ozono frío y caliente para abrir poros y suavizar vello, afeitado preciso y aceites nutritivos.',
    price: 12000,
    duration: 20,
    category: 'barba',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80',
    isPopular: false,
    isActive: true,
  },
  {
    _id: '6ab429b351b742ce20f96ab8',
    name: 'Corte Tradicional de Precisión',
    description: 'Corte clásico con tijera y máquina, perfilado de contornos, lavado y peinado.',
    price: 20000,
    duration: 30,
    category: 'corte',
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1200&q=80',
    isPopular: false,
    isActive: true,
  },
  {
    _id: '6ab429b351b742ce20f96ab9',
    name: 'Limpieza Facial Profunda',
    description: 'Vapor ozono, extracción de comedones, mascarilla de carbón activado, tónico y bloqueador solar.',
    price: 35000,
    duration: 40,
    category: 'facial',
    image: 'https://images.unsplash.com/photo-1512690459411-b9245aed614b?auto=format&fit=crop&w=1200&q=80',
    isPopular: false,
    isActive: true,
  }
];

const FALLBACK_BARBERS = [
  {
    _id: 'a1111111-1111-1111-1111-111111111111',
    user: {
      name: 'Andrés Felipe Sarria',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    specialties: ['Visagismo Craneal', 'Experiencia Signature', 'Degradados de Autor'],
    rating: { average: 4.9, count: 24 },
    isAvailable: true,
  },
  {
    _id: 'b2222222-2222-2222-2222-222222222222',
    user: {
      name: 'Nicolás Chávez',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    },
    specialties: ['Ritual de Barba', 'Navaja Libre', 'Vapor Ozono'],
    rating: { average: 5.0, count: 28 },
    isAvailable: true,
  },
  {
    _id: 'c3333333-3333-3333-3333-333333333333',
    user: {
      name: 'Luis De Ávila',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    },
    specialties: ['Fade Milimétrico', 'Perfilado Geométrico', 'Texturizado'],
    rating: { average: 4.9, count: 19 },
    isAvailable: true,
  },
];

export default function BookingWizard() {
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);

  // Selections
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [selectedBeverage, setSelectedBeverage] = useState('Sin bebida');

  // Client Data
  const [clientData, setClientData] = useState({
    name: user?.name || user?.nombre || '',
    email: user?.email || '',
    phone: user?.phone || user?.telefono || '',
    address: 'Triadix Atelier · Cali, Colombia',
  });

  // State lists
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [slots, setSlots] = useState([]);

  // Loaders
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingBarbers, setLoadingBarbers] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Confirmation Success State
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Fetch Services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoadingServices(true);
        const res = await serviceService.getAll();
        const list = res.services || res.data?.services || (Array.isArray(res) ? res : []);
        if (list && list.length > 0) {
          setServices(list.filter(s => s.category?.toLowerCase() !== 'bebidas'));
        } else {
          setServices(FALLBACK_SERVICES);
        }
      } catch (error) {
        console.error('Error cargando servicios:', error);
        setServices(FALLBACK_SERVICES);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  // Fetch Barbers
  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        setLoadingBarbers(true);
        const res = await barberService.getAll();
        const list = res.barbers || res.data?.barbers || [];
        if (list && list.length > 0) {
          setBarbers(list);
        } else {
          setBarbers(FALLBACK_BARBERS);
        }
      } catch (error) {
        console.error('Error cargando barberos:', error);
        setBarbers(FALLBACK_BARBERS);
      } finally {
        setLoadingBarbers(false);
      }
    };
    fetchBarbers();
  }, []);

  // Fetch Time Slots
  useEffect(() => {
    if (!selectedDate) {
      setSlots([]);
      return;
    }

    const fetchSlots = async () => {
      try {
        setLoadingSlots(true);
        const barberId = selectedBarber && selectedBarber._id !== 'any' ? selectedBarber._id : undefined;
        const totalDuration = selectedServices.reduce((sum, s) => sum + (s.duration || 30), 0) || 30;

        const res = await appointmentService.getAvailableSlots({
          date: selectedDate,
          barberId,
          serviceDuration: totalDuration,
        });

        const list = res.slots || res.data?.slots || res.availableSlots || [];
        setSlots(list);
      } catch (error) {
        console.error('Error cargando horarios disponibles:', error);
        toast.error('No se pudieron cargar los horarios para la fecha');
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDate, selectedBarber, selectedServices]);

  // Handle Multi-Service toggle
  const toggleService = (service) => {
    setSelectedServices(prev => {
      const exists = prev.find(s => s._id === service._id);
      if (exists) {
        return prev.filter(s => s._id !== service._id);
      } else {
        return [...prev, service];
      }
    });
  };

  // Calculation helpers
  const totalPrice = selectedServices.reduce((sum, s) => sum + (s.price || 0), 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + (s.duration || 30), 0);

  // Stepper navigation
  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedServices.length > 0;
      case 2:
        return selectedBarber !== null;
      case 3:
        return selectedDate !== '' && selectedSlot !== '';
      case 4:
        return clientData.name.trim() !== '' && clientData.email.trim() !== '' && clientData.phone.trim() !== '';
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (canProceed()) {
      setDirection(1);
      setStep(prev => prev + 1);
    } else {
      if (step === 1) toast.error('Selecciona al menos un servicio');
      if (step === 2) toast.error('Selecciona un maestro barbero');
      if (step === 3) toast.error('Selecciona la fecha y la hora deseada');
    }
  };

  const prevStep = () => {
    setDirection(-1);
    setStep(prev => Math.max(prev - 1, 1));
  };

  // Submit Booking
  const handleSubmit = async () => {
    if (!clientData.name || !clientData.email || !clientData.phone) {
      toast.error('Por favor completa tu nombre, correo y teléfono');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        services: selectedServices.map(s => s._id),
        barberId: selectedBarber._id === 'any' ? undefined : selectedBarber._id,
        date: selectedDate,
        startTime: selectedSlot,
        totalPrice,
        totalDuration,
        paymentMethod,
        notes: [notes, selectedBeverage && selectedBeverage !== 'Sin bebida' ? `Bebida: ${selectedBeverage}` : ''].filter(Boolean).join(' | '),
        clientName: clientData.name,
        clientEmail: clientData.email,
        clientPhone: clientData.phone,
        clientAddress: clientData.address,
      };

      const res = await appointmentService.createGuestAppointment(payload);
      const appointmentData = res.data || res;

      setBookingSuccess(appointmentData);
      toast.success('¡Cita reservada exitosamente! Se envió confirmación a tu correo.');
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
    const code = bookingSuccess.confirmationCode || apt.confirmationCode || 'TX-CONFIRMADA';
    const barberName = apt.barber?.name || selectedBarber?.user?.name || 'Master Barber Triadix';
    const clientEmail = clientData.email;

    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-none text-center p-8 sm:p-12 relative overflow-hidden">
          {/* Top Crown Badge */}
          <div className="inline-flex items-center gap-2 bg-[#141414] border border-[#262626] px-4 py-1.5 rounded-none mb-6">
            <Sparkles size={14} className="text-white" />
            <span className="text-xs uppercase font-sans tracking-[0.2em] text-white font-medium">
              Reserva Confirmada · Triadix
            </span>
          </div>

          <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-none flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={30} className="text-emerald-400" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-sans font-medium uppercase tracking-[0.16em] text-white mb-3">
            ¡Tu Cita Ha Sido Agendada!
          </h2>

          <p className="text-[#888888] text-xs sm:text-sm max-w-lg mx-auto mb-8 leading-relaxed font-sans">
            Hemos enviado un correo con todos los detalles a <span className="text-white font-medium">{clientEmail}</span> y tu maestro barbero <span className="text-white font-medium">{barberName}</span> ha sido notificado.
          </p>

          {/* Reservation Code Box */}
          <div className="bg-[#141414] border border-[#222222] p-4.5 rounded-none max-w-sm mx-auto mb-8">
            <p className="text-[10px] uppercase font-sans text-[#888888] font-medium tracking-[0.16em] mb-1">
              Código Único de Reserva
            </p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-mono text-white tracking-wider font-medium">
                {code}
              </span>
              <button
                onClick={() => handleCopyCode(code)}
                className="p-1.5 bg-[#1c1c1c] hover:bg-white hover:text-black border border-[#2e2e2e] rounded-none text-white transition-all cursor-pointer"
                title="Copiar código"
              >
                {copiedCode ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
              </button>
            </div>
          </div>

          {/* Compact Appointment Details */}
          <div className="bg-[#141414] border border-[#222222] p-5 sm:p-6 rounded-none text-left max-w-md mx-auto mb-8 space-y-3 font-sans text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-[#222222]">
              <span className="text-[#888888]">Cliente:</span>
              <span className="font-medium text-white uppercase tracking-wider">{clientData.name}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[#222222]">
              <span className="text-[#888888]">Barbero Asignado:</span>
              <span className="text-white font-medium uppercase tracking-wider">{barberName}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[#222222]">
              <span className="text-[#888888]">Fecha y Hora:</span>
              <span className="font-mono text-white capitalize">
                {new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' })} · {formatTime(selectedSlot)}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[#222222]">
              <span className="text-[#888888]">Servicio(s):</span>
              <span className="text-white text-right">
                {selectedServices.map((s) => s.name).join(' + ')}
              </span>
            </div>
            {clientData.address && (
              <div className="flex justify-between items-center pb-2 border-b border-[#222222]">
                <span className="text-[#888888]">Dirección registrada:</span>
                <span className="text-[#888888] text-right truncate max-w-[200px]">{clientData.address}</span>
              </div>
            )}
            {selectedBeverage && selectedBeverage !== 'Sin bebida' && (
              <div className="flex justify-between items-center pb-2 border-b border-[#222222]">
                <span className="text-[#888888]">Bebida solicitada:</span>
                <span className="text-gold-400 text-right font-mono">{selectedBeverage}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-1 text-sm">
              <span className="text-white uppercase font-sans text-xs font-semibold tracking-wider">Total:</span>
              <span className="price-pill">
                {formatPrice(totalPrice)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-sm mx-auto">
            <button
              onClick={handleResetBooking}
              className="w-full sm:w-auto btn-ferrari-outline text-xs !py-2.5 !px-5"
            >
              <RotateCcw size={14} />
              Agendar Otra
            </button>
            <a
              href={`https://wa.me/573122398964?text=Hola,%20acabo%20de%20agendar%20mi%20cita%20con%20c%C3%B3digo%20${code}%20en%20Triadix`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto btn-ferrari-primary text-xs !py-2.5 !px-5"
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
        <div className="absolute top-1/2 left-0 right-0 h-px bg-[#222222] -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-0 h-px bg-white -translate-y-1/2 z-0 transition-all duration-300 ease-out"
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
                  className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center border transition-all duration-200 rounded-none cursor-pointer ${
                    isActive
                      ? 'bg-white border-white text-black font-medium'
                      : isCompleted
                      ? 'bg-[#141414] border-white text-white'
                      : 'bg-[#0a0a0a] border-[#222222] text-[#666666] cursor-not-allowed'
                  }`}
                >
                  {isCompleted ? (
                    <Check size={16} strokeWidth={2.5} />
                  ) : (
                    <s.icon size={15} strokeWidth={isActive ? 2.5 : 2} />
                  )}
                </button>
                <span
                  className={`mt-2 font-sans text-[10px] uppercase tracking-[0.16em] hidden sm:block ${
                    isActive ? 'text-white font-medium' : isCompleted ? 'text-[#888888]' : 'text-[#555555]'
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
            transition={{ x: { type: 'spring', stiffness: 350, damping: 32 }, opacity: { duration: 0.15 } }}
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
                  selectedBeverage,
                  setSelectedBeverage,
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
        <div className="flex justify-between items-center gap-4 mt-8 pt-6 border-t border-[#1e1e1e]">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 1}
            className={`btn-ferrari-outline text-xs !py-2.5 !px-6 ${
              step === 1 ? 'opacity-30 cursor-not-allowed' : ''
            }`}
          >
            Atrás
          </button>

          <button
            type="button"
            onClick={nextStep}
            disabled={!canProceed()}
            className={`btn-ferrari-primary text-xs !py-2.5 !px-7 ${
              !canProceed() ? 'opacity-30 cursor-not-allowed' : ''
            }`}
          >
            Continuar
          </button>
        </div>
      )}
    </div>
  );
}

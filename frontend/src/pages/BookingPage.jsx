import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, ChevronRight, ChevronLeft, Check, Calendar, Clock, User } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import useAuthStore from '../store/useAuthStore';
import { serviceService } from '../services/serviceService';
import { barberService } from '../services/barberService';
import { appointmentService } from '../services/appointmentService';
import { formatTime } from '../utils/formatters';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const STEPS = [
  { id: 1, label: 'Servicio', icon: Scissors },
  { id: 2, label: 'Barbero', icon: User },
  { id: 3, label: 'Fecha y hora', icon: Calendar },
  { id: 4, label: 'Confirmar', icon: Check },
];

export default function BookingPage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);
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

    barberService
      .getAll()
      .then((res) => {
        const lista = res.barbers || [];
        setBarbers(Array.isArray(lista) ? lista : []);
      })
      .catch(() => {});
  }, []);

  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);

  useEffect(() => {
    if (selectedBarber && selectedDate && totalDuration > 0) {
      setLoadingSlots(true);
      setSelectedSlot('');
      appointmentService
        .getAvailableSlots({
          barberId: selectedBarber.user?._id || selectedBarber._id,
          date: selectedDate,
          duration: totalDuration,
        })
        .then((res) => {
          const lista = res.slots || [];
          setSlots(Array.isArray(lista) ? lista : []);
        })
        .catch(() => setSlots([]))
        .finally(() => setLoadingSlots(false));
    }
  }, [selectedBarber, selectedDate, selectedServices]);

  const getTodayDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getMaxDate = () => {
    const d = new Date();
    d.setMonth(d.getMonth() + 2);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.find((s) => s._id === service._id)
        ? prev.filter((s) => s._id !== service._id)
        : [...prev, service]
    );
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

  const handleDateChange = (e) => {
    const today = getTodayDate();
    if (e.target.value < today) {
      toast.error('No puedes agendar en fechas pasadas');
      return;
    }
    setSelectedDate(e.target.value);
    setSelectedSlot('');
    setSlots([]);
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
        barberId: selectedBarber.user?._id || selectedBarber._id,
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
    <div className="min-h-screen bg-dark-400">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-16">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-display text-4xl font-bold text-white mb-2">
            Reserva tu <span className="gold-text">cita</span>
          </h1>
          <p className="text-gray-400">Elige tu servicio, barbero y horario favorito</p>
        </motion.div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-10 relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-dark-100 z-0" />
          <div
            className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-gold-500 to-gold-400 transition-all duration-500 z-0"
            style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
          />
          {STEPS.map(({ id, label, icon: Icon }) => (
            <div key={id} className="flex flex-col items-center gap-2 relative z-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                step > id
                  ? 'bg-gold-500 text-black'
                  : step === id
                  ? 'bg-gold-500/20 border-2 border-gold-500 text-gold-500'
                  : 'bg-dark-100 border border-white/10 text-gray-600'
              }`}>
                {step > id ? <Check size={18} /> : <Icon size={18} />}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${step >= id ? 'text-gold-400' : 'text-gray-600'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* PASO 1: Servicios */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">¿Qué servicio deseas?</h2>
                <p className="text-gray-400 text-sm mb-6">Puedes seleccionar varios servicios</p>

                {loadingServices ? (
                  <div className="flex justify-center py-16">
                    <LoadingSpinner text="Cargando servicios..." />
                  </div>
                ) : services.length === 0 ? (
                  <div className="text-center py-16 bg-dark-100 rounded-2xl border border-white/10">
                    <Scissors size={40} className="text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">No hay servicios disponibles</p>
                    <p className="text-gray-600 text-sm mt-1">Contacta al administrador</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {services.map((service) => {
                      const isSelected = selectedServices.find((s) => s._id === service._id);
                      return (
                        <button
                          key={service._id}
                          onClick={() => toggleService(service)}
                          className={`p-5 rounded-2xl border text-left transition-all duration-200 ${
                            isSelected
                              ? 'border-gold-500 bg-gold-500/10 shadow-lg shadow-gold-500/10'
                              : 'border-white/10 bg-dark-100 hover:border-gold-500/30'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-gold-500' : 'bg-dark-50'}`}>
                              {isSelected
                                ? <Check size={18} className="text-black" />
                                : <Scissors size={18} className="text-gray-500 rotate-45" />
                              }
                            </div>
                            {service.isPopular && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold-500/20 text-gold-400 border border-gold-500/30">
                                🔥 Popular
                              </span>
                            )}
                          </div>
                          <p className="text-white font-medium capitalize mb-1">{service.name}</p>
                          {service.description && (
                            <p className="text-gray-500 text-xs mb-2">{service.description}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500 text-sm flex items-center gap-1">
                              <Clock size={12} /> {service.duration} min
                            </span>
                            <span className="text-gold-400 font-bold">
                              ${service.price.toLocaleString('es-CO')}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {selectedServices.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-gold-500/10 border border-gold-500/30 rounded-2xl"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{selectedServices.length} servicio(s) seleccionado(s)</p>
                        <p className="text-gray-400 text-sm">{totalDuration} min en total</p>
                      </div>
                      <p className="text-gold-400 font-bold text-xl">
                        ${totalPrice.toLocaleString('es-CO')}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* PASO 2: Barbero */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">¿Con quién quieres tu cita?</h2>
                <p className="text-gray-400 text-sm mb-6">Elige tu barbero de confianza</p>

                {barbers.length === 0 ? (
                  <div className="text-center py-16 bg-dark-100 rounded-2xl border border-white/10">
                    <User size={40} className="text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">No hay barberos disponibles</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {barbers.map((barber) => {
                      const isSelected = selectedBarber?._id === barber._id;
                      return (
                        <button
                          key={barber._id}
                          onClick={() => setSelectedBarber(barber)}
                          className={`w-full p-5 rounded-2xl border text-left transition-all duration-200 flex items-center gap-4 ${
                            isSelected
                              ? 'border-gold-500 bg-gold-500/10'
                              : 'border-white/10 bg-dark-100 hover:border-gold-500/30'
                          }`}
                        >
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden bg-gradient-to-br from-gold-500/30 to-gold-700/30 ${
                            isSelected ? 'ring-2 ring-gold-500' : ''
                          }`}>
                            {barber.user?.avatar ? (
                              <img src={barber.user.avatar} alt={barber.user?.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className={`text-xl font-bold ${isSelected ? 'text-gold-400' : 'text-gold-500'}`}>
                                {barber.user?.name?.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-semibold">{barber.user?.name}</p>
                            <p className="text-gray-400 text-sm">Barbero Profesional</p>
                            <div className="flex items-center gap-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={`text-xs ${i < Math.floor(barber.rating?.average || 5) ? 'text-gold-500' : 'text-gray-600'}`}>★</span>
                              ))}
                              <span className="text-gray-500 text-xs ml-1">({barber.rating?.count || 0} reseñas)</span>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <Check size={14} className="text-black" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* PASO 3: Fecha y hora */}
            {step === 3 && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">¿Cuándo quieres tu cita?</h2>
                <p className="text-gray-400 text-sm mb-6">Selecciona fecha y hora disponible</p>

                <div className="mb-6">
                  <label className="label">Fecha</label>
                  <input
                    type="date"
                    value={selectedDate}
                    min={getTodayDate()}
                    max={getMaxDate()}
                    onChange={handleDateChange}
                    className="input-field"
                  />
                  {selectedDate && selectedDate < getTodayDate() && (
                    <p className="text-red-400 text-xs mt-1">No puedes agendar en fechas pasadas</p>
                  )}
                </div>

                {selectedDate && selectedDate >= getTodayDate() && (
                  <div>
                    <label className="label">Hora disponible</label>
                    {loadingSlots ? (
                      <div className="flex justify-center py-8">
                        <LoadingSpinner text="Buscando horarios..." />
                      </div>
                    ) : slots.length === 0 ? (
                      <div className="text-center py-8 bg-dark-100 rounded-2xl border border-white/10">
                        <Clock size={32} className="text-gray-600 mx-auto mb-2" />
                        <p className="text-gray-400">No hay horarios disponibles este día</p>
                        <p className="text-gray-600 text-sm">Intenta con otra fecha</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                        {slots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
                              selectedSlot === slot
                                ? 'bg-gold-500 text-black'
                                : 'bg-dark-100 border border-white/10 text-gray-300 hover:border-gold-500/30 hover:text-gold-400'
                            }`}
                          >
                            {formatTime(slot)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* PASO 4: Confirmar */}
            {step === 4 && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Confirma tu cita</h2>
                <p className="text-gray-400 text-sm mb-6">Revisa los detalles antes de reservar</p>

                <div className="card p-6 mb-6 space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                    <div className="w-10 h-10 bg-gold-500/20 rounded-xl flex items-center justify-center">
                      <Scissors size={18} className="text-gold-500 rotate-45" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Servicios</p>
                      <p className="text-white font-medium capitalize">
                        {selectedServices.map((s) => s.name).join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                    <div className="w-10 h-10 bg-gold-500/20 rounded-xl flex items-center justify-center">
                      <User size={18} className="text-gold-500" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Barbero</p>
                      <p className="text-white font-medium">{selectedBarber?.user?.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                    <div className="w-10 h-10 bg-gold-500/20 rounded-xl flex items-center justify-center">
                      <Calendar size={18} className="text-gold-500" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Fecha y hora</p>
                      <p className="text-white font-medium">
                        {new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-CO', {
                          weekday: 'long', day: 'numeric', month: 'long'
                        })} · {formatTime(selectedSlot)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gold-500/20 rounded-xl flex items-center justify-center">
                      <Clock size={18} className="text-gold-500" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Duración estimada</p>
                      <p className="text-white font-medium">{totalDuration} minutos</p>
                    </div>
                  </div>
                </div>

                <div className="mb-5">
                  <label className="label">Método de pago</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['efectivo', 'nequi', 'daviplata'].map((method) => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`py-3 px-4 rounded-xl text-sm font-medium capitalize transition-all ${
                          paymentMethod === method
                            ? 'bg-gold-500 text-black'
                            : 'bg-dark-100 border border-white/10 text-gray-300 hover:border-gold-500/30'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="label">Notas adicionales (opcional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ej: Quiero un degradado bajo con diseño..."
                    className="input-field resize-none h-20"
                    maxLength={300}
                  />
                </div>

                <div className="bg-gold-500/10 border border-gold-500/30 rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total a pagar</p>
                    <p className="text-white text-xs mt-0.5">Pago en {paymentMethod}</p>
                  </div>
                  <p className="text-gold-400 font-bold text-3xl">
                    ${totalPrice.toLocaleString('es-CO')}
                  </p>
                </div>

                {!isAuthenticated && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <p className="text-red-400 text-sm text-center">
                      Debes <a href="/login" className="underline font-medium">iniciar sesión</a> para confirmar la reserva
                    </p>
                  </div>
                )}
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Navegación */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 1}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
              step === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <ChevronLeft size={18} /> Atrás
          </button>

          {step < 4 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                canProceed() ? 'btn-primary' : 'bg-dark-100 text-gray-600 cursor-not-allowed border border-white/10'
              }`}
            >
              Continuar <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting || !isAuthenticated}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${
                !submitting && isAuthenticated ? 'btn-primary' : 'bg-dark-100 text-gray-600 cursor-not-allowed border border-white/10'
              }`}
            >
              {submitting ? <LoadingSpinner size="sm" /> : <><Check size={18} /> Confirmar reserva</>}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Filter, Star, User, Check, X } from 'lucide-react';
import PageTransition from '../../components/ui/PageTransition';
import Modal from '../../components/ui/Modal';
import { appointmentService } from '../../services/appointmentService';
import { reviewService } from '../../services/reviewService';
import { formatTime } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modals state
  const [cancelModal, setCancelModal] = useState({ open: false, appointmentId: null });
  const [cancelReason, setCancelReason] = useState('Cambio de planes');
  
  const [reviewModal, setReviewModal] = useState({ open: false, appointment: null });
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAppointments = () => {
    setLoading(true);
    appointmentService.getMyAppointments({ status: statusFilter, limit: 50 })
      .then((res) => setAppointments(res.appointments || []))
      .catch(() => toast.error('Error cargando citas'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAppointments(); }, [statusFilter]);

  const handleCancel = async () => {
    setActionLoading(true);
    try {
      await appointmentService.cancel(cancelModal.appointmentId, cancelReason);
      toast.success('Cita cancelada correctamente');
      setCancelModal({ open: false, appointmentId: null });
      setCancelReason('Cambio de planes');
      fetchAppointments();
    } catch (error) {
      toast.error(error.message || 'Error al cancelar la cita');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReview = async () => {
    setActionLoading(true);
    try {
      await reviewService.createReview({
        appointmentId: reviewModal.appointment._id,
        barberId: reviewModal.appointment.barber._id,
        rating: reviewRating,
        comment: reviewComment
      });
      toast.success('¡Reseña enviada! Gracias por tu feedback.');
      setReviewModal({ open: false, appointment: null });
      setReviewRating(5);
      setReviewComment('');
      fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Error al enviar reseña');
    } finally {
      setActionLoading(false);
    }
  };

  const statuses = [
    { value: '', label: 'Todas' },
    { value: 'pendiente', label: 'Pendientes' },
    { value: 'confirmada', label: 'Confirmadas' },
    { value: 'completada', label: 'Completadas' },
    { value: 'cancelada', label: 'Canceladas' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completada':
        return 'bg-emerald-950/50 text-emerald-400 border-emerald-800/40';
      case 'confirmada':
        return 'bg-blue-950/50 text-blue-400 border-blue-800/40';
      case 'pendiente':
        return 'bg-amber-950/50 text-gold-400 border-amber-800/40';
      case 'cancelada':
        return 'bg-rose-950/50 text-rose-400 border-rose-800/40';
      default:
        return 'bg-[#161d19] text-[#b3b3b3] border-[#222a26]';
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-20">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-6 border-b border-[#1f2723]">
          <div>
            <span className="editorial-tag text-gold-400 block mb-1">Historial & Citas</span>
            <h1 className="font-serif italic text-3xl sm:text-4xl text-white">
              Mis <span className="text-gold-400">Citas</span>
            </h1>
            <p className="text-[#8e9b94] text-xs font-sans mt-1">
              Gestiona tus reservas, consulta el estado o califica a tu barbero
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <Filter size={15} className="text-[#8e9b94] flex-shrink-0 mr-1" />
          {statuses.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`px-3.5 py-1.5 rounded-[4px] text-xs font-sans uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === value
                  ? 'bg-gold-400 text-[#0e1311] font-semibold shadow-sm'
                  : 'bg-[#161d19] text-[#b3b3b3] hover:text-white border border-[#222a26]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Appointments List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-400"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-20 bg-[#121815] border border-[#1f2723] rounded-[4px] p-8">
            <Calendar size={40} className="text-gold-400/40 mx-auto mb-3" />
            <p className="font-serif italic text-xl text-white mb-1">Sin Citas Registradas</p>
            <p className="text-[#8e9b94] text-xs font-sans mt-1">Intenta cambiando el filtro o reserva tu próxima experiencia en Punto Fino.</p>
          </div>
        ) : (
          <motion.div 
            layout
            className="space-y-4"
          >
            <AnimatePresence mode="popLayout">
              {appointments.map((apt) => (
                <motion.div
                  key={apt._id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                >
                  <div className="bg-[#121815] border border-[#1f2723] hover:border-[#2b3530] transition-colors rounded-[4px] p-5 sm:p-6 flex flex-col sm:flex-row gap-6">
                    {/* Date/Time Column */}
                    <div className="flex sm:flex-col justify-between sm:justify-start items-center sm:items-start min-w-[140px] border-b sm:border-b-0 sm:border-r border-[#1f2723] pb-4 sm:pb-0 sm:pr-6">
                      <div>
                        <p className="font-serif italic text-3xl text-white leading-none mb-1">
                          {new Date(apt.date + 'T12:00:00').getDate().toString().padStart(2, '0')}
                        </p>
                        <p className="text-gold-400 font-sans text-xs uppercase tracking-wider">
                          {new Date(apt.date + 'T12:00:00').toLocaleDateString('es-CO', { month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="text-right sm:text-left sm:mt-4">
                        <span className="inline-block px-2.5 py-1 border border-[#222a26] bg-[#0e1311] font-mono text-xs text-white mb-2 rounded-[4px]">
                          {formatTime(apt.startTime)}
                        </span>
                        <div>
                          <span className={`inline-block px-2.5 py-0.5 rounded-[4px] text-[10px] font-sans uppercase tracking-wider border ${getStatusBadge(apt.status)}`}>
                            {getStatusText(apt.status)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Details Column */}
                    <div className="flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <User size={15} className="text-gold-400" />
                          <span className="font-serif italic text-lg text-white">
                            {apt.barber?.user?.name || 'Barbero Asignado'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {apt.services?.map((s, i) => (
                            <span key={i} className="text-xs bg-[#161d19] border border-[#222a26] text-[#dfdbca] px-2.5 py-1 rounded-[4px]">
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-[#1f2723] pt-3 mt-4">
                        <span className="text-[#8e9b94] font-mono text-xs uppercase">
                          Pago: {apt.paymentMethod}
                        </span>
                        <span className="font-mono font-bold text-gold-400 text-lg">
                          ${apt.totalPrice?.toLocaleString('es-CO')}
                        </span>
                      </div>
                    </div>

                    {/* Actions Column */}
                    <div className="flex sm:flex-col gap-2 pt-4 sm:pt-0 sm:pl-4 justify-end sm:border-l sm:border-[#1f2723]">
                      {(apt.status === 'pendiente' || apt.status === 'confirmada') && (
                        <button
                          onClick={() => setCancelModal({ open: true, appointmentId: apt._id })}
                          className="bg-rose-950/40 hover:bg-rose-950/70 text-rose-400 border border-rose-800/40 px-4 py-2 text-xs font-sans uppercase tracking-wider rounded-[4px] transition-colors w-full cursor-pointer"
                        >
                          Cancelar Cita
                        </button>
                      )}
                      
                      {apt.status === 'completada' && !apt.isReviewed && (
                        <button
                          onClick={() => setReviewModal({ open: true, appointment: apt })}
                          className="bg-gold-400 hover:bg-gold-300 text-[#0e1311] font-sans font-semibold px-4 py-2 text-xs uppercase tracking-wider rounded-[4px] transition-colors w-full cursor-pointer shadow-sm"
                        >
                          Reseñar
                        </button>
                      )}
                      
                      {apt.status === 'completada' && apt.isReviewed && (
                        <div className="px-4 py-2 border border-[#222a26] text-[#8e9b94] font-sans text-xs uppercase tracking-wider w-full text-center flex items-center justify-center gap-1.5 bg-[#161d19] rounded-[4px]">
                          <Check size={14} className="text-emerald-400" />
                          <span>Reseñada</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Cancel Modal */}
      <Modal isOpen={cancelModal.open} onClose={() => setCancelModal({ open: false, appointmentId: null })} title="Cancelar Cita">
        <div className="p-6">
          <p className="text-[#dfdbca] mb-5 text-sm font-sans">
            ¿Estás seguro de que deseas cancelar esta reserva? Por favor cuéntanos el motivo:
          </p>
          
          <div className="space-y-2.5 mb-6">
            {['Cambio de planes', 'Encontré otro lugar', 'Motivos personales', 'Otro'].map(reason => (
              <label 
                key={reason}
                className={`cursor-pointer flex items-center p-3 rounded-[4px] border transition-all ${
                  cancelReason === reason 
                    ? 'border-rose-500/60 bg-rose-950/20 text-white' 
                    : 'border-[#222a26] bg-[#161d19]/50 text-[#8e9b94] hover:border-[#2b3530]'
                }`}
              >
                <input 
                  type="radio" 
                  name="cancelReason" 
                  value={reason}
                  checked={cancelReason === reason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="hidden"
                />
                <div className={`w-4 h-4 rounded-[2px] border mr-3 flex items-center justify-center ${cancelReason === reason ? 'border-rose-400 bg-rose-400' : 'border-[#444]'}`}>
                  {cancelReason === reason && <div className="w-1.5 h-1.5 bg-[#0e1311]" />}
                </div>
                <span className="text-xs font-sans uppercase tracking-wider">
                  {reason}
                </span>
              </label>
            ))}
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => setCancelModal({ open: false, appointmentId: null })}
              className="bg-[#161d19] hover:bg-[#1f2723] text-[#dfdbca] border border-[#2b3530] text-xs font-sans uppercase tracking-wider flex-1 py-2.5 rounded-[4px] transition-colors cursor-pointer"
            >
              Volver
            </button>
            <button 
              onClick={handleCancel}
              disabled={actionLoading}
              className="bg-rose-950/60 hover:bg-rose-950/90 text-rose-400 border border-rose-800/60 font-sans font-semibold uppercase tracking-wider flex-1 py-2.5 text-xs rounded-[4px] flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              {actionLoading ? <div className="w-4 h-4 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" /> : <><X size={15} /> Confirmar Cancelación</>}
            </button>
          </div>
        </div>
      </Modal>

      {/* Review Modal */}
      <Modal isOpen={reviewModal.open} onClose={() => setReviewModal({ open: false, appointment: null })} title="Calificar Experiencia">
        <div className="p-6">
          <p className="text-[#dfdbca] mb-5 text-sm text-center">
            ¿Cómo fue tu experiencia con <span className="font-serif italic text-gold-400 text-base">{reviewModal.appointment?.barber?.user?.name}</span>?
          </p>
          
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setReviewRating(star)}
                className="transition-transform hover:scale-110 focus:outline-none cursor-pointer p-1"
              >
                <Star
                  size={32}
                  className={star <= reviewRating ? 'fill-gold-400 text-gold-400' : 'text-[#333] fill-transparent'}
                />
              </button>
            ))}
          </div>

          <div className="mb-6">
            <label className="text-[#8e9b94] font-sans text-[11px] uppercase tracking-wider mb-2 block">
              Comentario u Opinión (Opcional)
            </label>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Ej: Excelente servicio, gran atención y precisión en el corte..."
              className="w-full bg-[#0e1311] border border-[#222a26] text-white focus:border-gold-400/50 rounded-[4px] p-3 text-xs outline-none h-24 resize-none transition-colors"
              maxLength={200}
            />
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => setReviewModal({ open: false, appointment: null })}
              className="bg-[#161d19] hover:bg-[#1f2723] text-[#dfdbca] border border-[#2b3530] text-xs font-sans uppercase tracking-wider flex-1 py-2.5 rounded-[4px] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              onClick={handleReview}
              disabled={actionLoading}
              className="bg-gold-400 hover:bg-gold-300 text-[#0e1311] font-sans font-semibold text-xs uppercase tracking-wider flex-1 py-2.5 rounded-[4px] flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
            >
              {actionLoading ? <div className="w-4 h-4 border-2 border-[#0e1311] border-t-transparent rounded-full animate-spin" /> : <><Check size={15} /> Publicar Reseña</>}
            </button>
          </div>
        </div>
      </Modal>
    </PageTransition>
  );
}
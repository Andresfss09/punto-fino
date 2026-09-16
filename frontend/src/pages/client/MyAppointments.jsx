import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Filter, Scissors, Star, Clock, User, Check, X } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import PageTransition from '../../components/ui/PageTransition';
import BrutalCard from '../../components/ui/BrutalCard';
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
      setCancelReason('');
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

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completada': return 'border-[#22c55e] text-[#22c55e]';
      case 'confirmada': return 'border-[#3b82f6] text-[#3b82f6]';
      case 'pendiente': return 'border-[#d4af37] text-[#d4af37]';
      case 'cancelada': return 'border-[#ef4444] text-[#ef4444]';
      default: return 'border-[#a0a0a0] text-[#a0a0a0]';
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <PageTransition>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        
        <div className="mb-8">
          <h1 className="font-display text-4xl sm:text-5xl uppercase text-white mb-2 leading-tight">
            MIS <span className="text-[#d4af37]">CITAS</span>
          </h1>
          <p className="text-[#a0a0a0] font-mono text-sm uppercase tracking-widest">
            HISTORIAL Y GESTIÓN
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <Filter size={16} className="text-[#a0a0a0] flex-shrink-0 mr-2" />
          {statuses.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`brutal-badge cursor-pointer px-4 py-2 transition-all whitespace-nowrap ${
                statusFilter === value
                  ? 'bg-[#d4af37] text-[#0a0a0a] border-[#d4af37] shadow-[2px_2px_0_#0a0a0a]'
                  : 'bg-transparent text-[#a0a0a0] border-[#333] hover:border-[#d4af37]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Appointments List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#d4af37]"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-[#333]">
            <Calendar size={48} className="text-[#333] mx-auto mb-4" />
            <p className="text-[#a0a0a0] font-bold uppercase tracking-wider text-lg">No hay citas</p>
            <p className="text-[#666] font-mono text-sm mt-2">Intenta cambiando los filtros o agenda una nueva.</p>
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <BrutalCard className="p-5 sm:p-6 flex flex-col sm:flex-row gap-6">
                    {/* Date/Time Column */}
                    <div className="flex sm:flex-col justify-between sm:justify-start items-center sm:items-start min-w-[140px] border-b-2 sm:border-b-0 sm:border-r-2 border-dashed border-[#333] pb-4 sm:pb-0 sm:pr-6">
                      <div>
                        <p className="font-display text-2xl text-white uppercase leading-none mb-1">
                          {new Date(apt.date + 'T12:00:00').getDate().toString().padStart(2, '0')}
                        </p>
                        <p className="text-[#d4af37] font-bold text-xs uppercase tracking-wider">
                          {new Date(apt.date + 'T12:00:00').toLocaleDateString('es-CO', { month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="text-right sm:text-left sm:mt-4">
                        <span className="inline-block px-2 py-1 border-2 border-[#333] font-mono-price text-sm text-white mb-2">
                          {formatTime(apt.startTime)}
                        </span>
                        <div className={`brutal-badge text-center ${getStatusStyle(apt.status)}`}>
                          {getStatusText(apt.status)}
                        </div>
                      </div>
                    </div>

                    {/* Details Column */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <User size={14} className="text-[#a0a0a0]" />
                          <span className="text-white font-medium uppercase">{apt.barber?.user?.name}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {apt.services.map((s, i) => (
                            <span key={i} className="text-xs bg-[#1a1a1a] border border-[#333] text-[#a0a0a0] px-2 py-1 uppercase">
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t-2 border-[#333] pt-4 mt-auto">
                        <span className="text-[#a0a0a0] font-mono text-xs">
                          {apt.paymentMethod}
                        </span>
                        <span className="font-mono-price font-bold text-[#d4af37] text-lg">
                          ${apt.totalPrice?.toLocaleString('es-CO')}
                        </span>
                      </div>
                    </div>

                    {/* Actions Column */}
                    <div className="flex sm:flex-col gap-2 pt-4 sm:pt-0 sm:pl-4 justify-end">
                      {(apt.status === 'pendiente' || apt.status === 'confirmada') && (
                        <button
                          onClick={() => setCancelModal({ open: true, appointmentId: apt._id })}
                          className="brutal-btn bg-transparent text-[#ef4444] border-[#ef4444] shadow-[3px_3px_0_#ef4444] px-4 py-2 font-bold uppercase text-xs w-full"
                        >
                          Cancelar
                        </button>
                      )}
                      
                      {apt.status === 'completada' && !apt.isReviewed && (
                        <button
                          onClick={() => setReviewModal({ open: true, appointment: apt })}
                          className="brutal-btn bg-transparent text-[#d4af37] border-[#d4af37] shadow-[3px_3px_0_#d4af37] px-4 py-2 font-bold uppercase text-xs w-full"
                        >
                          Reseñar
                        </button>
                      )}
                      
                      {apt.status === 'completada' && apt.isReviewed && (
                        <div className="px-4 py-2 border-2 border-[#333] text-[#a0a0a0] font-bold uppercase text-xs w-full text-center flex items-center justify-center gap-1 bg-[#1a1a1a]">
                          <Check size={12} /> Reseñada
                        </div>
                      )}
                    </div>
                  </BrutalCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Cancel Modal */}
      <Modal isOpen={cancelModal.open} onClose={() => setCancelModal({ open: false, appointmentId: null })} title="CANCELAR CITA">
        <div className="p-6">
          <p className="text-white mb-6 font-medium">¿Estás seguro que deseas cancelar esta cita?</p>
          
          <div className="space-y-3 mb-8">
            {['Cambio de planes', 'Encontré otro lugar', 'Motivos personales', 'Otro'].map(reason => (
              <label 
                key={reason}
                className={`cursor-pointer flex items-center p-3 border-2 transition-all ${
                  cancelReason === reason 
                    ? 'border-[#ef4444] bg-[#ef4444]/10' 
                    : 'border-[#333] bg-[#111111]'
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
                <div className={`w-4 h-4 border-2 mr-3 flex items-center justify-center ${cancelReason === reason ? 'border-[#ef4444]' : 'border-[#666]'}`}>
                  {cancelReason === reason && <div className="w-2 h-2 bg-[#ef4444]" />}
                </div>
                <span className={`text-sm uppercase font-bold ${cancelReason === reason ? 'text-[#ef4444]' : 'text-[#a0a0a0]'}`}>
                  {reason}
                </span>
              </label>
            ))}
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setCancelModal({ open: false, appointmentId: null })}
              className="brutal-btn-outline flex-1 py-3 uppercase text-sm"
            >
              Cerrar
            </button>
            <button 
              onClick={handleCancel}
              disabled={actionLoading}
              className="brutal-btn bg-[#ef4444] text-[#0a0a0a] border-[#0a0a0a] shadow-[4px_4px_0_#0a0a0a] font-bold uppercase tracking-wider flex-1 py-3 text-sm flex items-center justify-center gap-2"
            >
              {actionLoading ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <><X size={16} strokeWidth={3} /> Cancelar Cita</>}
            </button>
          </div>
        </div>
      </Modal>

      {/* Review Modal */}
      <Modal isOpen={reviewModal.open} onClose={() => setReviewModal({ open: false, appointment: null })} title="CALIFICAR SERVICIO">
        <div className="p-6">
          <p className="text-white mb-6 text-sm text-center">
            ¿Qué tal te pareció el servicio con <span className="font-bold text-[#d4af37] uppercase">{reviewModal.appointment?.barber?.user?.name}</span>?
          </p>
          
          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setReviewRating(star)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  size={36}
                  strokeWidth={1.5}
                  className={star <= reviewRating ? 'fill-[#d4af37] text-[#d4af37]' : 'text-[#333] fill-transparent'}
                />
              </button>
            ))}
          </div>

          <div className="mb-8">
            <label className="text-[#a0a0a0] font-bold uppercase text-xs tracking-wider mb-2 block">
              Comentario (Opcional)
            </label>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Ej: Excelente servicio, muy profesional..."
              className="brutal-input w-full h-24 resize-none"
              maxLength={200}
            />
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setReviewModal({ open: false, appointment: null })}
              className="brutal-btn-outline flex-1 py-3 uppercase text-sm"
            >
              Cancelar
            </button>
            <button 
              onClick={handleReview}
              disabled={actionLoading}
              className="brutal-btn-primary flex-1 py-3 text-sm flex items-center justify-center gap-2"
            >
              {actionLoading ? <div className="w-4 h-4 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" /> : <><Check size={16} strokeWidth={3} /> Enviar</>}
            </button>
          </div>
        </div>
      </Modal>
    </PageTransition>
  );
}
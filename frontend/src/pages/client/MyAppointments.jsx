import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Filter, Scissors, Star } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import { appointmentService } from '../../services/appointmentService';
import { getStatusColor, getStatusLabel, formatDate, formatTime } from '../../utils/formatters';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [cancelModal, setCancelModal] = useState({ open: false, appointmentId: null });
  const [reviewModal, setReviewModal] = useState({ open: false, appointment: null });
  const [cancelReason, setCancelReason] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAppointments = () => {
    setLoading(true);
    appointmentService.getMyAppointments({ status: statusFilter, limit: 20 })
      .then((res) => setAppointments(res.appointments || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAppointments(); }, [statusFilter]);

  const handleCancel = async () => {
    setActionLoading(true);
    try {
      await appointmentService.cancel(cancelModal.appointmentId, cancelReason);
      toast.success('Cita cancelada.');
      setCancelModal({ open: false, appointmentId: null });
      setCancelReason('');
      fetchAppointments();
    } catch (error) {
      toast.error(error.message);
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

  return (
    <div className="min-h-screen bg-dark-400">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-bold text-white mb-1">
            Mis <span className="gold-text">Citas</span>
          </h1>
          <p className="text-gray-400">Gestiona todas tus citas en Punto Fino</p>
        </motion.div>

        {/* Filtros */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          <Filter size={16} className="text-gray-500 flex-shrink-0" />
          {statuses.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                statusFilter === value
                  ? 'bg-gold-500 text-black'
                  : 'bg-dark-100 text-gray-400 border border-white/10 hover:border-gold-500/30'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Lista */}
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" text="Cargando citas..." />
          </div>
        ) : appointments.length === 0 ? (
          <div className="card p-16 text-center">
            <Calendar size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No hay citas</p>
            <p className="text-gray-600 text-sm">No tienes citas con ese filtro.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt, index) => (
              <motion.div
                key={apt._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Icono */}
                  <div className="w-14 h-14 bg-gradient-to-br from-gold-500 to-gold-700 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Scissors size={22} className="text-black rotate-45" />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-white font-semibold">
                        {apt.services?.map(s => s.service?.name).join(', ') || 'Servicio'}
                      </h3>
                      <span className={`badge border text-xs ${getStatusColor(apt.status)}`}>
                        {getStatusLabel(apt.status)}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Barbero: <span className="text-white">{apt.barber?.name}</span>
                    </p>
                    <p className="text-gray-500 text-sm">
                      {formatDate(apt.date)} · {formatTime(apt.startTime)}
                    </p>
                    <p className="text-gray-600 text-xs mt-1">
                      Código: {apt.confirmationCode}
                    </p>
                  </div>

                  {/* Precio y acciones */}
                  <div className="flex flex-col items-end gap-3">
                    <p className="text-gold-400 font-bold text-lg">
                      ${apt.totalPrice?.toLocaleString('es-CO')}
                    </p>
                    <div className="flex gap-2">
                      {['pendiente', 'confirmada'].includes(apt.status) && (
                        <button
                          onClick={() => setCancelModal({ open: true, appointmentId: apt._id })}
                          className="text-xs text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-all"
                        >
                          Cancelar
                        </button>
                      )}
                      {apt.status === 'completada' && !apt.review && (
                        <button
                          onClick={() => setReviewModal({ open: true, appointment: apt })}
                          className="text-xs text-gold-400 border border-gold-500/30 px-3 py-1.5 rounded-lg hover:bg-gold-500/10 transition-all flex items-center gap-1"
                        >
                          <Star size={12} />
                          Reseñar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal cancelar */}
      <Modal
        isOpen={cancelModal.open}
        onClose={() => setCancelModal({ open: false, appointmentId: null })}
        title="Cancelar cita"
      >
        <p className="text-gray-400 mb-4">¿Estás seguro que deseas cancelar esta cita?</p>
        <textarea
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          placeholder="Motivo de cancelación (opcional)"
          className="input-field resize-none h-24 mb-4"
        />
        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={() => setCancelModal({ open: false, appointmentId: null })}>
            Volver
          </Button>
          <Button variant="danger" className="flex-1" loading={actionLoading} onClick={handleCancel}>
            Cancelar cita
          </Button>
        </div>
      </Modal>

      {/* Modal reseña */}
      <Modal
        isOpen={reviewModal.open}
        onClose={() => setReviewModal({ open: false, appointment: null })}
        title="Dejar reseña"
      >
        <p className="text-gray-400 mb-4">¿Cómo fue tu experiencia?</p>
        <div className="flex gap-2 mb-4 justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => setReviewRating(star)}>
              <Star
                size={32}
                className={star <= reviewRating ? 'text-gold-500 fill-gold-500' : 'text-gray-600'}
              />
            </button>
          ))}
        </div>
        <textarea
          value={reviewComment}
          onChange={(e) => setReviewComment(e.target.value)}
          placeholder="Cuéntanos tu experiencia..."
          className="input-field resize-none h-24 mb-4"
        />
        <Button className="w-full" onClick={() => setReviewModal({ open: false, appointment: null })}>
          Enviar reseña
        </Button>
      </Modal>
    </div>
  );
}
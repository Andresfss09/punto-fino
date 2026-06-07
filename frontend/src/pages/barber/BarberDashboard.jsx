import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, DollarSign, Users, Star, Clock, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import useAuthStore from '../../store/useAuthStore';
import { appointmentService } from '../../services/appointmentService';
import { getStatusColor, getStatusLabel, formatTime } from '../../utils/formatters';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';

export default function BarberDashboard() {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchAppointments = () => {
    setLoading(true);
    appointmentService.getBarberAppointments({ date: selectedDate })
      .then((res) => setAppointments(res.appointments || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAppointments(); }, [selectedDate]);

  const handleStatusUpdate = async (appointmentId, status) => {
    setUpdatingId(appointmentId);
    try {
      await appointmentService.updateStatus(appointmentId, status);
      toast.success(`Cita marcada como ${getStatusLabel(status)}`);
      fetchAppointments();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const todayRevenue = appointments
    .filter(a => a.status === 'completada')
    .reduce((sum, a) => sum + (a.totalPrice || 0), 0);

  const statCards = [
    { icon: Calendar, label: 'Citas hoy', value: appointments.length, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { icon: CheckCircle, label: 'Completadas', value: appointments.filter(a => a.status === 'completada').length, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
    { icon: Clock, label: 'Pendientes', value: appointments.filter(a => ['pendiente', 'confirmada'].includes(a.status)).length, color: 'text-gold-400', bg: 'bg-gold-500/10 border-gold-500/20' },
    { icon: DollarSign, label: 'Ingresos hoy', value: `$${todayRevenue.toLocaleString('es-CO')}`, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  ];

  return (
    <div className="min-h-screen bg-dark-400">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10"
        >
          <div>
            <h1 className="font-display text-3xl font-bold text-white">
              Hola, <span className="gold-text">{user?.name?.split(' ')[0]}</span> ✂️
            </h1>
            <p className="text-gray-400 mt-1">Panel de barbero · Punto Fino</p>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input-field w-auto"
          />
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map(({ icon: Icon, label, value, color, bg }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`card border p-5 ${bg}`}
            >
              <Icon size={22} className={`${color} mb-3`} />
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-gray-500 text-sm mt-0.5">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Agenda del día */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Calendar size={20} className="text-gold-500" />
            Agenda del día
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner text="Cargando agenda..." />
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar size={40} className="text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No hay citas para este día</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((apt, index) => (
                <motion.div
                  key={apt._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-dark-50 border border-white/5 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  {/* Hora */}
                  <div className="bg-dark-300 rounded-xl px-4 py-3 text-center flex-shrink-0 min-w-20">
                    <p className="text-gold-400 font-bold text-lg">{formatTime(apt.startTime)}</p>
                    <p className="text-gray-600 text-xs">{apt.totalDuration} min</p>
                  </div>

                  {/* Cliente */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-700 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-black font-bold text-sm">
                        {apt.client?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{apt.client?.name}</p>
                      <p className="text-gray-500 text-sm">
                        {apt.services?.map(s => s.service?.name).join(', ')}
                      </p>
                      <p className="text-gray-600 text-xs">{apt.client?.phone}</p>
                    </div>
                  </div>

                  {/* Precio y estado */}
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-gold-400 font-bold">${apt.totalPrice?.toLocaleString('es-CO')}</p>
                    <span className={`badge border text-xs ${getStatusColor(apt.status)}`}>
                      {getStatusLabel(apt.status)}
                    </span>
                  </div>

                  {/* Acciones */}
                  {['pendiente', 'confirmada'].includes(apt.status) && (
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleStatusUpdate(apt._id, 'en_progreso')}
                        disabled={updatingId === apt._id}
                        className="p-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-all"
                        title="Iniciar"
                      >
                        <Clock size={16} />
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(apt._id, 'completada')}
                        disabled={updatingId === apt._id}
                        className="p-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-all"
                        title="Completar"
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(apt._id, 'no_show')}
                        disabled={updatingId === apt._id}
                        className="p-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all"
                        title="No asistió"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  )}
                  {apt.status === 'en_progreso' && (
                    <button
                      onClick={() => handleStatusUpdate(apt._id, 'completada')}
                      disabled={updatingId === apt._id}
                      className="p-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-all flex-shrink-0"
                      title="Completar"
                    >
                      <CheckCircle size={16} />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
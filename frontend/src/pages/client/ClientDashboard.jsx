import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Star, Scissors, ChevronRight, Plus, Award, TrendingUp } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import useAuthStore from '../../store/useAuthStore';
import { appointmentService } from '../../services/appointmentService';
import { getStatusColor, getStatusLabel, formatDate, formatTime } from '../../utils/formatters';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Badge from '../../components/ui/Badge';

export default function ClientDashboard() {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, completed: 0, upcoming: 0 });

  useEffect(() => {
    appointmentService.getMyAppointments({ limit: 5 })
      .then((res) => {
        setAppointments(res.appointments || []);
        const completed = res.appointments?.filter(a => a.status === 'completada').length || 0;
        const upcoming = res.appointments?.filter(a => ['pendiente', 'confirmada'].includes(a.status)).length || 0;
        setStats({ total: res.pagination?.total || 0, completed, upcoming });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { icon: Calendar, label: 'Total citas', value: stats.total, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { icon: Clock, label: 'Próximas', value: stats.upcoming, color: 'text-gold-400', bg: 'bg-gold-500/10 border-gold-500/20' },
    { icon: Star, label: 'Completadas', value: stats.completed, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
    { icon: Award, label: 'Puntos', value: user?.loyaltyPoints || 0, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
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
              Hola, <span className="gold-text">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p className="text-gray-400 mt-1">Bienvenido a tu panel de Punto Fino</p>
          </div>
          <Link to="/reservar" className="btn-primary flex items-center gap-2 self-start">
            <Plus size={18} />
            Nueva cita
          </Link>
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
              <div className="flex items-center justify-between mb-3">
                <Icon size={20} className={color} />
                <TrendingUp size={14} className="text-gray-600" />
              </div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-gray-500 text-sm mt-0.5">{label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Citas recientes */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-white">Mis citas recientes</h2>
              <Link to="/cliente/citas" className="text-gold-400 text-sm hover:text-gold-300 flex items-center gap-1">
                Ver todas <ChevronRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div className="card p-12 flex justify-center">
                <LoadingSpinner text="Cargando citas..." />
              </div>
            ) : appointments.length === 0 ? (
              <div className="card p-12 text-center">
                <Scissors size={40} className="text-gray-600 mx-auto mb-4 rotate-45" />
                <p className="text-gray-400 mb-2">No tienes citas aún</p>
                <p className="text-gray-600 text-sm mb-6">Reserva tu primera cita con los mejores barberos de Cali</p>
                <Link to="/reservar" className="btn-primary inline-flex items-center gap-2">
                  <Plus size={16} />
                  Reservar ahora
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((apt, index) => (
                  <motion.div
                    key={apt._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="card p-5 flex items-center gap-4"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-700 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Scissors size={18} className="text-black rotate-45" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-white font-medium">
                          {apt.services?.[0]?.service?.name || 'Servicio'}
                          {apt.services?.length > 1 && ` +${apt.services.length - 1}`}
                        </p>
                        <span className={`badge border text-xs ${getStatusColor(apt.status)}`}>
                          {getStatusLabel(apt.status)}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm mt-0.5">
                        {apt.barber?.name} · {formatDate(apt.date, { day: 'numeric', month: 'short' })} · {formatTime(apt.startTime)}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-gold-400 font-semibold">
                        ${apt.totalPrice?.toLocaleString('es-CO')}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Panel lateral */}
          <div className="space-y-6">
            {/* Perfil rápido */}
            <div className="card p-6">
              <h3 className="text-white font-semibold mb-4">Mi perfil</h3>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 bg-gradient-to-br from-gold-500 to-gold-700 rounded-2xl flex items-center justify-center">
                  <span className="text-black text-xl font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">{user?.name}</p>
                  <p className="text-gray-500 text-sm">{user?.email}</p>
                </div>
              </div>
              <div className="bg-dark-50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award size={18} className="text-gold-500" />
                    <span className="text-white text-sm font-medium">Puntos de fidelidad</span>
                  </div>
                  <span className="text-gold-400 font-bold">{user?.loyaltyPoints || 0}</span>
                </div>
                <div className="mt-3 h-1.5 bg-dark-300 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full transition-all"
                    style={{ width: `${Math.min((user?.loyaltyPoints || 0) / 100 * 100, 100)}%` }}
                  />
                </div>
                <p className="text-gray-600 text-xs mt-1.5">{100 - (user?.loyaltyPoints || 0)} puntos para el siguiente nivel</p>
              </div>
              <Link to="/cliente/perfil" className="btn-secondary w-full text-sm text-center block py-2.5">
                Editar perfil
              </Link>
            </div>

            {/* Acceso rápido */}
            <div className="card p-6">
              <h3 className="text-white font-semibold mb-4">Acceso rápido</h3>
              <div className="space-y-2">
                {[
                  { label: 'Reservar cita', path: '/reservar', icon: Plus },
                  { label: 'Mis citas', path: '/cliente/citas', icon: Calendar },
                  { label: 'Ver servicios', path: '/#servicios', icon: Scissors },
                  { label: 'Ver barberos', path: '/#barberos', icon: Star },
                ].map(({ label, path, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className="flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all group"
                  >
                    <Icon size={16} className="text-gold-500 group-hover:scale-110 transition-transform" />
                    <span className="text-sm">{label}</span>
                    <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
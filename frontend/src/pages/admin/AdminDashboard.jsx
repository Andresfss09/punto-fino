import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Calendar, DollarSign, Scissors, ChevronRight, TrendingUp, Settings, Star } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import { appointmentService } from '../../services/appointmentService';
import { serviceService } from '../../services/serviceService';
import { barberService } from '../../services/barberService';
import { getStatusColor, getStatusLabel, formatDate, formatTime } from '../../utils/formatters';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function AdminDashboard() {
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ services: 0, barbers: 0 });

  useEffect(() => {
    Promise.all([
      appointmentService.getBarberAppointments({ limit: 8 }),
      serviceService.getAll(),
      barberService.getAll(),
    ])
      .then(([aptsRes, servicesRes, barbersRes]) => {
        setRecentAppointments(aptsRes.appointments || []);
        setCounts({
          services: servicesRes.services?.length || 0,
          barbers: barbersRes.barbers?.length || 0,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const menuItems = [
    { label: 'Gestionar Citas', path: '/admin/citas', icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', desc: 'Ver y gestionar todas las citas' },
    { label: 'Gestionar Servicios', path: '/admin/servicios', icon: Scissors, color: 'text-gold-400', bg: 'bg-gold-500/10 border-gold-500/20', desc: `${counts.services} servicios activos` },
    { label: 'Gestionar Barberos', path: '/admin/barberos', icon: Star, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', desc: `${counts.barbers} barberos registrados` },
    { label: 'Gestionar Usuarios', path: '/admin/usuarios', icon: Users, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', desc: 'Ver todos los clientes' },
  ];

  return (
    <div className="min-h-screen bg-dark-400">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-700 rounded-xl flex items-center justify-center">
              <Settings size={18} className="text-black" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-white">
                Panel <span className="gold-text">Administrador</span>
              </h1>
              <p className="text-gray-400 text-sm">Control total de Punto Fino</p>
            </div>
          </div>
        </motion.div>

        {/* Menu principal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {menuItems.map(({ label, path, icon: Icon, color, bg, desc }, index) => (
            <motion.div
              key={path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={path} className={`card border ${bg} p-6 flex flex-col gap-4 hover:scale-105 transition-all duration-300 block`}>
                <div className="flex items-center justify-between">
                  <Icon size={24} className={color} />
                  <ChevronRight size={16} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-white font-semibold">{label}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Citas recientes */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Calendar size={20} className="text-gold-500" />
              Citas recientes
            </h2>
            <Link to="/admin/citas" className="text-gold-400 text-sm hover:text-gold-300 flex items-center gap-1">
              Ver todas <ChevronRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner text="Cargando..." />
            </div>
          ) : recentAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar size={40} className="text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No hay citas registradas aún</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left text-gray-500 text-xs font-medium pb-3 pr-4">Cliente</th>
                    <th className="text-left text-gray-500 text-xs font-medium pb-3 pr-4">Barbero</th>
                    <th className="text-left text-gray-500 text-xs font-medium pb-3 pr-4">Fecha y hora</th>
                    <th className="text-left text-gray-500 text-xs font-medium pb-3 pr-4">Servicio</th>
                    <th className="text-left text-gray-500 text-xs font-medium pb-3 pr-4">Total</th>
                    <th className="text-left text-gray-500 text-xs font-medium pb-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentAppointments.map((apt) => (
                    <tr key={apt._id} className="hover:bg-white/2 transition-colors">
                      <td className="py-3 pr-4">
                        <p className="text-white text-sm font-medium">{apt.client?.name}</p>
                        <p className="text-gray-600 text-xs">{apt.client?.phone}</p>
                      </td>
                      <td className="py-3 pr-4">
                        <p className="text-gray-300 text-sm">{apt.barber?.name}</p>
                      </td>
                      <td className="py-3 pr-4">
                        <p className="text-gray-300 text-sm">{formatDate(apt.date, { day: 'numeric', month: 'short' })}</p>
                        <p className="text-gray-600 text-xs">{formatTime(apt.startTime)}</p>
                      </td>
                      <td className="py-3 pr-4">
                        <p className="text-gray-300 text-sm truncate max-w-32">
                          {apt.services?.[0]?.service?.name}
                          {apt.services?.length > 1 && ` +${apt.services.length - 1}`}
                        </p>
                      </td>
                      <td className="py-3 pr-4">
                        <p className="text-gold-400 text-sm font-medium">
                          ${apt.totalPrice?.toLocaleString('es-CO')}
                        </p>
                      </td>
                      <td className="py-3">
                        <span className={`badge border text-xs ${getStatusColor(apt.status)}`}>
                          {getStatusLabel(apt.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
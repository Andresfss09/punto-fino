import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  CheckCircle, 
  DollarSign, 
  Clock, 
  Play, 
  Check, 
  X, 
  Calendar, 
  CalendarRange, 
  Search, 
  RefreshCw, 
  Phone, 
  MessageSquare, 
  TrendingUp, 
  Scissors, 
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/useAuthStore';
import BrutalCard from '../../components/ui/BrutalCard';
import StatsCard from '../../components/ui/StatsCard';
import PageTransition from '../../components/ui/PageTransition';
import Modal from '../../components/ui/Modal';
import { barberService } from '../../services/barberService';
import { appointmentService } from '../../services/appointmentService';
import { formatPrice, formatDate, formatTime, getStatusColor, getStatusLabel } from '../../utils/formatters';

export default function BarberDashboard() {
  const { user } = useAuthStore();

  // Navigation tab
  const [activeTab, setActiveTab] = useState('agenda'); // 'agenda' | 'reporte'

  // Loading states
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [loadingRange, setLoadingRange] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // General KPI stats
  const [stats, setStats] = useState({
    cutsToday: 0,
    revenueToday: 0,
    cutsThisWeek: 0,
    revenueThisWeek: 0,
    cutsThisMonth: 0,
    revenueThisMonth: 0,
    pendingToday: 0,
    totalScheduledToday: 0,
  });

  // Agenda Tab state
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [statusFilter, setStatusFilter] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [appointments, setAppointments] = useState([]);

  // Range Report Tab state
  const [rangeStartDate, setRangeStartDate] = useState(() => {
    const d = new Date();
    d.setDate(1); // 1st of current month
    return d.toISOString().split('T')[0];
  });
  const [rangeEndDate, setRangeEndDate] = useState(todayStr);
  const [rangeStats, setRangeStats] = useState({
    totalCuts: 0,
    totalRevenue: 0,
    totalAppointments: 0,
    uniqueClients: 0,
    appointments: [],
  });

  // Cancel Modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedAppointmentToCancel, setSelectedAppointmentToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  // Fetch Barber KPIs
  const fetchStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const res = await barberService.getMyStats();
      const data = res.data || res;
      setStats({
        cutsToday: data.cutsToday || 0,
        revenueToday: data.revenueToday || 0,
        cutsThisWeek: data.cutsThisWeek || 0,
        revenueThisWeek: data.revenueThisWeek || 0,
        cutsThisMonth: data.cutsThisMonth || 0,
        revenueThisMonth: data.revenueThisMonth || 0,
        pendingToday: data.pendingToday || 0,
        totalScheduledToday: data.totalScheduledToday || 0,
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      toast.error('Error al cargar métricas del barbero');
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Fetch Appointments for Agenda Tab
  const fetchAgenda = useCallback(async (date) => {
    try {
      setLoadingAppointments(true);
      const params = {};
      if (date) params.date = date;
      const res = await appointmentService.getBarberAppointments(params);
      const list = res.appointments || res.data?.appointments || [];
      setAppointments(list);
    } catch (error) {
      console.error('Error cargando citas:', error);
      toast.error('Error al cargar la agenda de citas');
    } finally {
      setLoadingAppointments(false);
    }
  }, []);

  // Fetch Range Report
  const fetchRangeReport = useCallback(async (start, end) => {
    if (!start || !end) {
      toast.error('Selecciona una fecha de inicio y una fecha de fin');
      return;
    }
    if (new Date(start) > new Date(end)) {
      toast.error('La fecha inicial no puede ser posterior a la fecha final');
      return;
    }

    try {
      setLoadingRange(true);
      const res = await barberService.getMyStats({ startDate: start, endDate: end });
      const data = res.data || res;
      if (data.rangeStats) {
        setRangeStats(data.rangeStats);
      }
    } catch (error) {
      console.error('Error cargando reporte de rango:', error);
      toast.error('Error al consultar estadísticas del rango');
    } finally {
      setLoadingRange(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchStats();
    fetchAgenda(selectedDate);
    fetchRangeReport(rangeStartDate, rangeEndDate);
  }, []);

  // Reload agenda on date change
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    fetchAgenda(newDate);
  };

  // Status updates (Iniciar / Completar)
  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      setActionLoadingId(appointmentId);
      await appointmentService.updateStatus(appointmentId, newStatus);
      toast.success(
        newStatus === 'en_progreso'
          ? 'Corte iniciado correctamente ✂️'
          : '¡Corte completado con éxito! 🎉'
      );
      // Refresh agenda and KPIs
      fetchAgenda(selectedDate);
      fetchStats();
      if (activeTab === 'reporte') {
        fetchRangeReport(rangeStartDate, rangeEndDate);
      }
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      toast.error(error.response?.data?.message || 'Error al actualizar el estado de la cita');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Open Cancel Modal
  const openCancelModal = (appointment) => {
    setSelectedAppointmentToCancel(appointment);
    setCancelReason('');
    setCancelModalOpen(true);
  };

  // Confirm Cancel
  const handleConfirmCancel = async () => {
    if (!selectedAppointmentToCancel) return;
    try {
      setActionLoadingId(selectedAppointmentToCancel._id);
      await appointmentService.cancel(selectedAppointmentToCancel._id, cancelReason);
      toast.success('Cita cancelada correctamente');
      setCancelModalOpen(false);
      setSelectedAppointmentToCancel(null);
      fetchAgenda(selectedDate);
      fetchStats();
    } catch (error) {
      console.error('Error cancelando cita:', error);
      toast.error(error.response?.data?.message || 'Error al cancelar la cita');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Preset Date Range selector
  const setRangePreset = (preset) => {
    const today = new Date();
    const todayISO = today.toISOString().split('T')[0];

    if (preset === 'today') {
      setRangeStartDate(todayISO);
      setRangeEndDate(todayISO);
      fetchRangeReport(todayISO, todayISO);
    } else if (preset === 'week') {
      const day = today.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;
      const monday = new Date(today);
      monday.setDate(today.getDate() + diffToMonday);
      const startISO = monday.toISOString().split('T')[0];
      setRangeStartDate(startISO);
      setRangeEndDate(todayISO);
      fetchRangeReport(startISO, todayISO);
    } else if (preset === 'month') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const startISO = firstDay.toISOString().split('T')[0];
      setRangeStartDate(startISO);
      setRangeEndDate(todayISO);
      fetchRangeReport(startISO, todayISO);
    } else if (preset === 'last30') {
      const past30 = new Date(today);
      past30.setDate(today.getDate() - 30);
      const startISO = past30.toISOString().split('T')[0];
      setRangeStartDate(startISO);
      setRangeEndDate(todayISO);
      fetchRangeReport(startISO, todayISO);
    }
  };

  // Filter agenda appointments
  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus = statusFilter === 'todos' || apt.status === statusFilter;
    const clientName = apt.client?.name?.toLowerCase() || '';
    const clientPhone = apt.client?.phone?.toLowerCase() || '';
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || clientName.includes(query) || clientPhone.includes(query);
    return matchesStatus && matchesSearch;
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <PageTransition>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-[#111111] p-6 border-2 border-[#333] shadow-[4px_4px_0_#333]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="brutal-badge bg-gold-500/10 text-gold-500 border-gold-500/30 flex items-center gap-1">
                <Scissors size={12} /> Panel de Barbero
              </span>
              <span className="text-xs text-gray-400 font-mono">Steel House Barberia's</span>
            </div>
            <h1 className="text-3xl font-display font-bold uppercase tracking-wider text-white">
              ¡Hola, <span className="text-gold-500">{user?.name ? user.name.split(' ')[0] : 'Barbero'}</span>!
            </h1>
            <p className="text-gray-400 text-sm mt-1 capitalize font-sans">
              {new Date().toLocaleDateString('es-CO', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => {
                fetchStats();
                if (activeTab === 'agenda') fetchAgenda(selectedDate);
                else fetchRangeReport(rangeStartDate, rangeEndDate);
              }}
              className="brutal-btn bg-dark-300 text-white border-[#333] px-4 py-2.5 flex items-center gap-2 hover:border-gold-500 text-sm"
              title="Actualizar datos"
            >
              <RefreshCw size={16} className={loadingStats || loadingAppointments || loadingRange ? 'animate-spin text-gold-500' : ''} />
              <span className="hidden sm:inline">Refrescar</span>
            </button>
          </div>
        </div>

        {/* KPI Counter Cards: Cortes Hoy, Cortes Semana, Cortes Mes, Citas Pendientes */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {/* Cortes Hoy */}
          <motion.div variants={itemVariants}>
            <BrutalCard variant="gold" className="flex flex-col justify-between h-full relative overflow-hidden">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 border-2 border-gold-500/40 bg-gold-500/10 text-gold-500">
                  <Scissors className="w-5 h-5" />
                </div>
                <span className="brutal-badge bg-gold-500/20 text-gold-400 border-gold-500">
                  Hoy
                </span>
              </div>
              <div>
                <div className="text-4xl font-mono-price font-bold text-white mb-1">
                  {stats.cutsToday} <span className="text-base font-normal text-gold-500">cortes</span>
                </div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Cortes de Hoy</p>
                <div className="mt-3 pt-2 border-t border-[#333] flex items-center justify-between text-xs">
                  <span className="text-gray-400">Ingresos hoy:</span>
                  <span className="font-mono-price font-bold text-gold-400">{formatPrice(stats.revenueToday)}</span>
                </div>
              </div>
            </BrutalCard>
          </motion.div>

          {/* Cortes Esta Semana */}
          <motion.div variants={itemVariants}>
            <BrutalCard className="flex flex-col justify-between h-full">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 border-2 border-[#333] bg-[#0a0a0a] text-blue-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="brutal-badge bg-blue-500/10 text-blue-400 border-blue-500/20">
                  Semana
                </span>
              </div>
              <div>
                <div className="text-4xl font-mono-price font-bold text-white mb-1">
                  {stats.cutsThisWeek} <span className="text-base font-normal text-gray-400">cortes</span>
                </div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Esta Semana</p>
                <div className="mt-3 pt-2 border-t border-[#333] flex items-center justify-between text-xs">
                  <span className="text-gray-400">Generado:</span>
                  <span className="font-mono-price font-bold text-white">{formatPrice(stats.revenueThisWeek)}</span>
                </div>
              </div>
            </BrutalCard>
          </motion.div>

          {/* Cortes Este Mes */}
          <motion.div variants={itemVariants}>
            <BrutalCard className="flex flex-col justify-between h-full">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 border-2 border-[#333] bg-[#0a0a0a] text-green-400">
                  <DollarSign className="w-5 h-5" />
                </div>
                <span className="brutal-badge bg-green-500/10 text-green-400 border-green-500/20">
                  Mes
                </span>
              </div>
              <div>
                <div className="text-4xl font-mono-price font-bold text-white mb-1">
                  {stats.cutsThisMonth} <span className="text-base font-normal text-gray-400">cortes</span>
                </div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Este Mes</p>
                <div className="mt-3 pt-2 border-t border-[#333] flex items-center justify-between text-xs">
                  <span className="text-gray-400">Generado:</span>
                  <span className="font-mono-price font-bold text-green-400">{formatPrice(stats.revenueThisMonth)}</span>
                </div>
              </div>
            </BrutalCard>
          </motion.div>

          {/* Citas Pendientes Hoy */}
          <motion.div variants={itemVariants}>
            <BrutalCard className="flex flex-col justify-between h-full">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 border-2 border-[#333] bg-[#0a0a0a] text-yellow-500">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="brutal-badge bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                  Por Atender
                </span>
              </div>
              <div>
                <div className="text-4xl font-mono-price font-bold text-white mb-1">
                  {stats.pendingToday} <span className="text-base font-normal text-gray-400">citas</span>
                </div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Pendientes Hoy</p>
                <div className="mt-3 pt-2 border-t border-[#333] flex items-center justify-between text-xs">
                  <span className="text-gray-400">Total agendadas:</span>
                  <span className="font-mono-price font-bold text-white">{stats.totalScheduledToday}</span>
                </div>
              </div>
            </BrutalCard>
          </motion.div>
        </motion.div>

        {/* Tab Switcher Buttons */}
        <div className="flex flex-wrap items-center gap-3 border-b-2 border-[#333] pb-4">
          <button
            onClick={() => setActiveTab('agenda')}
            className={`brutal-btn px-6 py-3 font-display font-bold uppercase tracking-wider text-sm flex items-center gap-2 ${
              activeTab === 'agenda'
                ? 'bg-[#d4af37] text-black border-black shadow-[4px_4px_0_#d4af37]'
                : 'bg-[#141414] text-gray-300 border-[#333] hover:border-gold-500'
            }`}
          >
            <Calendar size={18} />
            Agenda de Reservas
            {appointments.length > 0 && (
              <span className={`px-2 py-0.5 text-xs font-mono rounded ${activeTab === 'agenda' ? 'bg-black text-[#d4af37]' : 'bg-[#222] text-white'}`}>
                {appointments.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('reporte')}
            className={`brutal-btn px-6 py-3 font-display font-bold uppercase tracking-wider text-sm flex items-center gap-2 ${
              activeTab === 'reporte'
                ? 'bg-[#d4af37] text-black border-black shadow-[4px_4px_0_#d4af37]'
                : 'bg-[#141414] text-gray-300 border-[#333] hover:border-gold-500'
            }`}
          >
            <CalendarRange size={18} />
            Reporte por Rango & Ganancias
          </button>
        </div>

        {/* TAB 1: AGENDA DE RESERVAS */}
        {activeTab === 'agenda' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Filter controls row */}
            <div className="bg-[#111111] p-5 border-2 border-[#333] shadow-[4px_4px_0_#333] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Date selection */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs uppercase font-bold text-gray-400 font-mono">Fecha:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="brutal-input py-2 text-sm bg-[#0a0a0a]"
                />
                <button
                  type="button"
                  onClick={() => handleDateChange(todayStr)}
                  className={`brutal-btn text-xs px-3 py-2 font-bold uppercase ${
                    selectedDate === todayStr ? 'bg-gold-500 text-black border-black' : 'bg-[#1a1a1a] text-gray-300 border-[#333]'
                  }`}
                >
                  Hoy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const tom = new Date();
                    tom.setDate(tom.getDate() + 1);
                    handleDateChange(tom.toISOString().split('T')[0]);
                  }}
                  className="brutal-btn text-xs px-3 py-2 font-bold uppercase bg-[#1a1a1a] text-gray-300 border-[#333] hover:border-gold-500"
                >
                  Mañana
                </button>
              </div>

              {/* Search client input */}
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por cliente o teléfono..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="brutal-input pl-9 py-2 text-sm w-full bg-[#0a0a0a]"
                />
              </div>
            </div>

            {/* Status pills filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {[
                { id: 'todos', label: 'Todas' },
                { id: 'pendiente', label: 'Pendientes' },
                { id: 'confirmada', label: 'Confirmadas' },
                { id: 'en_progreso', label: 'En Progreso' },
                { id: 'completada', label: 'Completadas' },
                { id: 'cancelada', label: 'Canceladas' },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setStatusFilter(st.id)}
                  className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider border-2 transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === st.id
                      ? 'bg-gold-500 text-black border-gold-500 font-bold'
                      : 'bg-[#141414] text-gray-400 border-[#333] hover:border-gray-500'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Appointment Cards list */}
            {loadingAppointments ? (
              <div className="text-center py-16 bg-[#111111] border-2 border-[#333]">
                <RefreshCw size={32} className="animate-spin text-gold-500 mx-auto mb-3" />
                <p className="text-gray-400 font-mono text-sm uppercase tracking-wider">Cargando agenda de citas...</p>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center py-16 bg-[#111111] border-2 border-[#333] p-8">
                <Scissors size={40} className="text-gray-600 mx-auto mb-3" />
                <h3 className="text-xl font-display font-bold uppercase text-white mb-2">No hay reservas encontradas</h3>
                <p className="text-gray-400 text-sm max-w-md mx-auto">
                  {statusFilter !== 'todos' || searchQuery
                    ? 'No se encontraron citas que coincidan con los filtros aplicados.'
                    : `No tienes citas agendadas para el día ${selectedDate}.`}
                </p>
                {selectedDate !== todayStr && (
                  <button
                    onClick={() => handleDateChange(todayStr)}
                    className="brutal-btn-primary px-4 py-2 mt-4 text-xs font-bold"
                  >
                    Ver Citas de Hoy
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((apt) => {
                  const client = apt.client || {};
                  const isCurrent = apt.status === 'en_progreso';
                  const isCompleted = apt.status === 'completada';
                  const isCancelled = apt.status === 'cancelada';

                  return (
                    <BrutalCard
                      key={apt._id}
                      variant={isCurrent ? 'gold' : 'default'}
                      className={`transition-all ${isCompleted ? 'opacity-85' : ''}`}
                    >
                      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        {/* Time & Client Column */}
                        <div className="flex items-start sm:items-center gap-4 w-full lg:w-auto">
                          {/* Time badge */}
                          <div className="bg-[#0a0a0a] border-2 border-[#333] px-3 py-2 text-center rounded-[2px] min-w-[90px]">
                            <div className="text-gold-500 font-mono-price font-bold text-lg">
                              {apt.startTime}
                            </div>
                            <div className="text-[10px] text-gray-500 font-mono">
                              hasta {apt.endTime}
                            </div>
                          </div>

                          {/* Client details */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-lg font-display font-bold uppercase text-white tracking-wide">
                                {client.name || 'Cliente sin nombre'}
                              </h3>
                              <span className={`brutal-badge ${getStatusColor(apt.status)}`}>
                                {getStatusLabel(apt.status)}
                              </span>
                              {client.loyaltyPoints > 0 && (
                                <span className="brutal-badge bg-gold-500/10 text-gold-500 border-gold-500/20">
                                  👑 {client.loyaltyPoints} pts
                                </span>
                              )}
                            </div>

                            {/* Contact links */}
                            <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                              {client.phone && (
                                <a
                                  href={`tel:${client.phone}`}
                                  className="flex items-center gap-1 hover:text-gold-500 transition-colors"
                                >
                                  <Phone size={13} /> {client.phone}
                                </a>
                              )}
                              {client.phone && (
                                <a
                                  href={`https://wa.me/57${client.phone.replace(/\D/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-green-400 hover:text-green-300 font-bold transition-colors"
                                >
                                  <MessageSquare size={13} /> WhatsApp
                                </a>
                              )}
                              {apt.paymentMethod && (
                                <span className="font-mono text-[11px] uppercase bg-[#1e1e1e] px-2 py-0.5 border border-[#333]">
                                  Pago: {apt.paymentMethod}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Services & Price Column */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between lg:justify-end gap-6 w-full lg:w-auto">
                          <div className="text-left sm:text-right">
                            <div className="text-sm font-semibold text-gray-200">
                              {apt.services?.map((s) => s.service?.name || 'Servicio').join(' + ')}
                            </div>
                            <div className="text-xl font-mono-price font-bold text-gold-500">
                              {formatPrice(apt.totalPrice)}
                            </div>
                            <div className="text-[11px] text-gray-500 font-mono">
                              {apt.totalDuration} min aprox.
                            </div>
                          </div>

                          {/* Quick Action buttons */}
                          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            {/* Start appointment */}
                            {['pendiente', 'confirmada'].includes(apt.status) && (
                              <button
                                onClick={() => handleUpdateStatus(apt._id, 'en_progreso')}
                                disabled={actionLoadingId === apt._id}
                                className="brutal-btn bg-blue-600/30 text-blue-400 border-blue-500 px-4 py-2 hover:bg-blue-600/40 text-xs font-bold uppercase flex items-center gap-1.5"
                                title="Iniciar corte ahora"
                              >
                                <Play size={14} /> Iniciar
                              </button>
                            )}

                            {/* Complete appointment */}
                            {apt.status === 'en_progreso' && (
                              <button
                                onClick={() => handleUpdateStatus(apt._id, 'completada')}
                                disabled={actionLoadingId === apt._id}
                                className="brutal-btn bg-green-500 text-black border-black px-4 py-2 hover:bg-green-400 text-xs font-bold uppercase flex items-center gap-1.5 shadow-[3px_3px_0_#22c55e]"
                                title="Marcar corte como terminado"
                              >
                                <Check size={16} /> Finalizar
                              </button>
                            )}

                            {/* Completed state indicator */}
                            {isCompleted && (
                              <div className="flex items-center gap-1 text-green-500 text-xs font-mono uppercase bg-green-500/10 px-3 py-2 border border-green-500/30">
                                <CheckCircle size={14} /> Corte Realizado
                              </div>
                            )}

                            {/* Cancel button */}
                            {!isCompleted && !isCancelled && (
                              <button
                                onClick={() => openCancelModal(apt)}
                                disabled={actionLoadingId === apt._id}
                                className="brutal-btn bg-transparent text-red-400 border-red-500/40 px-3 py-2 hover:bg-red-500/10 text-xs font-bold uppercase"
                                title="Cancelar cita"
                              >
                                <X size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Client Note if provided */}
                      {apt.notes && (
                        <div className="mt-3 pt-3 border-t border-[#222] text-xs text-gray-400 flex items-start gap-2">
                          <span className="font-bold text-gray-500 uppercase font-mono">Nota cliente:</span>
                          <span className="italic">"{apt.notes}"</span>
                        </div>
                      )}
                    </BrutalCard>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 2: REPORTE POR RANGO DE FECHAS & HISTORIAL */}
        {activeTab === 'reporte' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Filter Box */}
            <div className="bg-[#111111] p-6 border-2 border-[#333] shadow-[4px_4px_0_#333] space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-display font-bold uppercase text-white flex items-center gap-2">
                  <CalendarRange className="text-gold-500" />
                  Filtrar Ganancias & Cortes por Rango
                </h2>
                <span className="text-xs text-gray-400 font-mono hidden sm:inline">Tu perfil personal</span>
              </div>

              {/* Date pickers & submit */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-4">
                  <label className="block text-xs uppercase font-bold text-gray-400 font-mono mb-1">
                    Desde (Fecha inicial)
                  </label>
                  <input
                    type="date"
                    value={rangeStartDate}
                    onChange={(e) => setRangeStartDate(e.target.value)}
                    className="brutal-input w-full py-2.5 text-sm bg-[#0a0a0a]"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-xs uppercase font-bold text-gray-400 font-mono mb-1">
                    Hasta (Fecha final)
                  </label>
                  <input
                    type="date"
                    value={rangeEndDate}
                    onChange={(e) => setRangeEndDate(e.target.value)}
                    className="brutal-input w-full py-2.5 text-sm bg-[#0a0a0a]"
                  />
                </div>

                <div className="sm:col-span-4">
                  <button
                    onClick={() => fetchRangeReport(rangeStartDate, rangeEndDate)}
                    disabled={loadingRange}
                    className="brutal-btn-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <Search size={16} />
                    {loadingRange ? 'Consultando...' : 'Consultar Rango'}
                  </button>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#222] flex-wrap">
                <span className="text-xs text-gray-500 font-mono uppercase">Accesos rápidos:</span>
                <button
                  type="button"
                  onClick={() => setRangePreset('today')}
                  className="brutal-btn text-xs px-3 py-1 bg-[#1a1a1a] text-gray-300 border-[#333] hover:border-gold-500 font-mono"
                >
                  Hoy
                </button>
                <button
                  type="button"
                  onClick={() => setRangePreset('week')}
                  className="brutal-btn text-xs px-3 py-1 bg-[#1a1a1a] text-gray-300 border-[#333] hover:border-gold-500 font-mono"
                >
                  Esta Semana
                </button>
                <button
                  type="button"
                  onClick={() => setRangePreset('month')}
                  className="brutal-btn text-xs px-3 py-1 bg-[#1a1a1a] text-gray-300 border-[#333] hover:border-gold-500 font-mono"
                >
                  Este Mes
                </button>
                <button
                  type="button"
                  onClick={() => setRangePreset('last30')}
                  className="brutal-btn text-xs px-3 py-1 bg-[#1a1a1a] text-gray-300 border-[#333] hover:border-gold-500 font-mono"
                >
                  Últimos 30 días
                </button>
              </div>
            </div>

            {/* Results Financial Summary Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <BrutalCard variant="gold" className="bg-[#141414]">
                <div className="text-xs uppercase font-bold text-gray-400 font-mono mb-1">
                  💰 Total Dinero Generado
                </div>
                <div className="text-3xl font-mono-price font-bold text-gold-500">
                  {formatPrice(rangeStats.totalRevenue)}
                </div>
                <div className="text-[11px] text-gray-400 mt-2">
                  En el rango del {rangeStartDate} al {rangeEndDate}
                </div>
              </BrutalCard>

              <BrutalCard className="bg-[#141414]">
                <div className="text-xs uppercase font-bold text-gray-400 font-mono mb-1">
                  ✂ Cortes Realizados
                </div>
                <div className="text-3xl font-mono-price font-bold text-white">
                  {rangeStats.totalCuts}
                </div>
                <div className="text-[11px] text-gray-400 mt-2">
                  Citas con estado completada
                </div>
              </BrutalCard>

              <BrutalCard className="bg-[#141414]">
                <div className="text-xs uppercase font-bold text-gray-400 font-mono mb-1">
                  👤 Clientes Atendidos
                </div>
                <div className="text-3xl font-mono-price font-bold text-blue-400">
                  {rangeStats.uniqueClients}
                </div>
                <div className="text-[11px] text-gray-400 mt-2">
                  Clientes distintos peluqueados
                </div>
              </BrutalCard>

              <BrutalCard className="bg-[#141414]">
                <div className="text-xs uppercase font-bold text-gray-400 font-mono mb-1">
                  📊 Promedio por Corte
                </div>
                <div className="text-3xl font-mono-price font-bold text-green-400">
                  {rangeStats.totalCuts > 0
                    ? formatPrice(Math.round(rangeStats.totalRevenue / rangeStats.totalCuts))
                    : '$ 0'}
                </div>
                <div className="text-[11px] text-gray-400 mt-2">
                  Ticket promedio por servicio
                </div>
              </BrutalCard>
            </div>

            {/* Detailed Table / Cards of clients peluqueados in the range */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-display font-bold uppercase text-white flex items-center gap-2">
                  <Users size={20} className="text-gold-500" />
                  Clientes Atendidos en el Periodo ({rangeStats.appointments?.length || 0})
                </h3>
              </div>

              {loadingRange ? (
                <div className="text-center py-16 bg-[#111111] border-2 border-[#333]">
                  <RefreshCw size={32} className="animate-spin text-gold-500 mx-auto mb-3" />
                  <p className="text-gray-400 font-mono text-sm uppercase">Consultando datos del rango...</p>
                </div>
              ) : rangeStats.appointments?.length === 0 ? (
                <div className="text-center py-16 bg-[#111111] border-2 border-[#333] p-8">
                  <AlertCircle size={40} className="text-gray-600 mx-auto mb-3" />
                  <h4 className="text-xl font-display font-bold uppercase text-white mb-2">
                    No se registran cortes en este rango
                  </h4>
                  <p className="text-gray-400 text-sm max-w-md mx-auto">
                    No se encontraron servicios ni ingresos para el periodo comprendido entre {rangeStartDate} y {rangeEndDate}.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto bg-[#111111] border-2 border-[#333] shadow-[4px_4px_0_#333]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-[#333] bg-[#0a0a0a] text-xs font-mono uppercase text-gray-400">
                        <th className="p-4">Fecha y Hora</th>
                        <th className="p-4">Cliente Peluqueado</th>
                        <th className="p-4">Contacto</th>
                        <th className="p-4">Servicio(s)</th>
                        <th className="p-4">Método de Pago</th>
                        <th className="p-4 text-right">Plata Generada</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222] text-sm">
                      {rangeStats.appointments.map((apt) => {
                        const client = apt.client || {};
                        const dateStr = apt.date
                          ? new Date(apt.date).toLocaleDateString('es-CO', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'N/A';

                        return (
                          <tr key={apt._id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-4 whitespace-nowrap">
                              <div className="font-mono font-bold text-white">{dateStr}</div>
                              <div className="text-xs text-gold-500 font-mono">{apt.startTime} - {apt.endTime}</div>
                            </td>

                            <td className="p-4 whitespace-nowrap">
                              <div className="font-bold text-white uppercase">{client.name || 'Sin nombre'}</div>
                              <div className="text-xs text-gray-400">{client.email || ''}</div>
                            </td>

                            <td className="p-4 whitespace-nowrap">
                              {client.phone ? (
                                <div className="flex items-center gap-2">
                                  <a
                                    href={`tel:${client.phone}`}
                                    className="font-mono text-gray-300 hover:text-gold-500 transition-colors"
                                  >
                                    {client.phone}
                                  </a>
                                  <a
                                    href={`https://wa.me/57${client.phone.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-400 hover:text-green-300"
                                    title="Contactar por WhatsApp"
                                  >
                                    <MessageSquare size={14} />
                                  </a>
                                </div>
                              ) : (
                                <span className="text-gray-500 text-xs">Sin teléfono</span>
                              )}
                            </td>

                            <td className="p-4">
                              <div className="font-medium text-gray-200">
                                {apt.services?.map((s) => s.service?.name || 'Servicio').join(', ')}
                              </div>
                            </td>

                            <td className="p-4 whitespace-nowrap">
                              <span className="font-mono text-xs uppercase bg-[#1e1e1e] px-2 py-1 border border-[#333] text-gray-300">
                                {apt.paymentMethod || 'Efectivo'}
                              </span>
                            </td>

                            <td className="p-4 text-right whitespace-nowrap">
                              <span className="font-mono-price font-bold text-gold-400 text-base">
                                {formatPrice(apt.totalPrice)}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Modal para Cancelar Cita */}
        <Modal
          isOpen={cancelModalOpen}
          onClose={() => setCancelModalOpen(false)}
          title="Cancelar Cita"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-300">
              ¿Estás seguro de que deseas cancelar la cita de{' '}
              <strong className="text-white uppercase">{selectedAppointmentToCancel?.client?.name}</strong> programada para las{' '}
              <strong className="text-gold-500">{selectedAppointmentToCancel?.startTime}</strong>?
            </p>

            <div>
              <label className="block text-xs uppercase font-bold text-gray-400 font-mono mb-2">
                Motivo de la cancelación:
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Ej: Calamidad doméstica, cambio de horario coordinado con cliente..."
                rows={3}
                className="brutal-input w-full text-sm bg-[#0d0d0d]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#333]">
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="brutal-btn bg-dark-300 text-gray-300 border-[#333] px-4 py-2 text-xs font-bold uppercase"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={actionLoadingId !== null}
                className="brutal-btn bg-red-600 text-white border-black px-4 py-2 text-xs font-bold uppercase shadow-[3px_3px_0_#991b1b]"
              >
                Confirmar Cancelación
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </PageTransition>
  );
}
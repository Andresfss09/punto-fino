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
  AlertCircle
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

  // Fetch Agenda Appointments for a date
  const fetchAgenda = useCallback(async (date) => {
    try {
      setLoadingAppointments(true);
      const res = await barberService.getMyAppointments({ date });
      const data = res.data || res;
      setAppointments(Array.isArray(data.appointments) ? data.appointments : (Array.isArray(data) ? data : []));
    } catch (error) {
      console.error('Error cargando agenda de citas:', error);
      toast.error('Error al cargar la agenda');
    } finally {
      setLoadingAppointments(false);
    }
  }, []);

  // Fetch Range Financial Report
  const fetchRangeReport = useCallback(async (start, end) => {
    try {
      setLoadingRange(true);
      const res = await barberService.getHistoricalReport({ startDate: start, endDate: end });
      const data = res.data || res;
      setRangeStats({
        totalCuts: data.totalCuts || 0,
        totalRevenue: data.totalRevenue || 0,
        totalAppointments: data.totalAppointments || 0,
        uniqueClients: data.uniqueClients || 0,
        appointments: Array.isArray(data.appointments) ? data.appointments : [],
      });
    } catch (error) {
      console.error('Error cargando reporte histórico:', error);
      toast.error('Error al cargar reporte por rango');
    } finally {
      setLoadingRange(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchStats();
    fetchAgenda(selectedDate);
  }, [fetchStats, fetchAgenda, selectedDate]);

  // Handle Tab Switch
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'reporte' && rangeStats.appointments.length === 0) {
      fetchRangeReport(rangeStartDate, rangeEndDate);
    }
  };

  // Date change in Agenda tab
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    fetchAgenda(newDate);
  };

  // Preset buttons for Range
  const setRangePreset = (type) => {
    const end = new Date();
    let start = new Date();

    if (type === 'today') {
      // today only
    } else if (type === 'week') {
      const day = end.getDay();
      const diff = end.getDate() - day + (day === 0 ? -6 : 1); // Monday
      start.setDate(diff);
    } else if (type === 'month') {
      start.setDate(1);
    } else if (type === 'last30') {
      start.setDate(end.getDate() - 30);
    }

    const sStr = start.toISOString().split('T')[0];
    const eStr = end.toISOString().split('T')[0];
    setRangeStartDate(sStr);
    setRangeEndDate(eStr);
    fetchRangeReport(sStr, eStr);
  };

  // Status updates: Iniciar o Completar
  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      setActionLoadingId(appointmentId);
      await appointmentService.updateStatus(appointmentId, newStatus);
      toast.success(
        newStatus === 'en_progreso' ? 'Corte iniciado' :
        newStatus === 'completada' ? 'Corte finalizado con éxito' :
        'Estado actualizado'
      );
      // Refresh current agenda and stats
      fetchAgenda(selectedDate);
      fetchStats();
      if (activeTab === 'reporte') {
        fetchRangeReport(rangeStartDate, rangeEndDate);
      }
    } catch (error) {
      console.error('Error actualizando estado:', error);
      toast.error(error.response?.data?.message || 'Error al actualizar el servicio');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Open Cancel Modal
  const openCancelModal = (apt) => {
    setSelectedAppointmentToCancel(apt);
    setCancelReason('');
    setCancelModalOpen(true);
  };

  // Confirm cancellation
  const handleConfirmCancel = async () => {
    if (!selectedAppointmentToCancel) return;
    try {
      setActionLoadingId(selectedAppointmentToCancel._id);
      await appointmentService.updateStatus(selectedAppointmentToCancel._id, 'cancelada', {
        reason: cancelReason || 'Cancelada por el barbero',
      });
      toast.success('Cita cancelada');
      setCancelModalOpen(false);
      fetchAgenda(selectedDate);
      fetchStats();
      if (activeTab === 'reporte') {
        fetchRangeReport(rangeStartDate, rangeEndDate);
      }
    } catch (error) {
      console.error('Error al cancelar cita:', error);
      toast.error('Error al cancelar la cita');
    } finally {
      setActionLoadingId(null);
      setSelectedAppointmentToCancel(null);
    }
  };

  // Filter agenda appointments
  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus = statusFilter === 'todos' || apt.status === statusFilter;
    const clientName = apt.client?.name?.toLowerCase() || '';
    const clientPhone = apt.client?.phone?.toLowerCase() || '';
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery = !query || clientName.includes(query) || clientPhone.includes(query);
    return matchesStatus && matchesQuery;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <PageTransition>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Top Header — Depot Terminal Console */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-[#121113] p-6 border border-[#2b292d] rounded-[6px] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#71d083] shadow-[0_0_8px_#71d083]"></span>
              <span className="text-[11px] font-mono uppercase tracking-[0.025em] text-[#71d083] flex items-center gap-1">
                <Scissors size={12} /> CONSOLA DEL MAESTRO BARBERO
              </span>
              <span className="text-[10px] text-[#7c7a85] font-mono uppercase">· Triadix Terminal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-sans font-semibold tracking-[-0.025em] text-[#e5e5e5]">
              ¡Hola, <span className="text-[#71d083]">{user?.name ? user.name.split(' ')[0] : 'Barbero'}</span>!
            </h1>
            <p className="text-[#7c7a85] text-xs sm:text-sm mt-1 uppercase font-mono tracking-[0.025em]">
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
              className="btn-depot-outline !py-2.5 !px-3.5"
              title="Actualizar datos"
            >
              <RefreshCw size={14} className={loadingStats || loadingAppointments || loadingRange ? 'animate-spin text-[#71d083]' : ''} />
              <span className="hidden sm:inline">Refrescar</span>
            </button>
          </div>
        </div>

        {/* KPI Counter Cards — Depot Style */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {/* Cortes Hoy */}
          <motion.div variants={itemVariants}>
            <div className="bg-[#121113] border border-[#2b292d] hover:border-[#3c393f] rounded-[6px] p-5 flex flex-col justify-between h-full transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 border border-[#2b292d] bg-[#1a191b] text-[#71d083] rounded-[6px] flex items-center justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
                  <Scissors className="w-4 h-4" />
                </div>
                <span className="tag-depot-green">
                  Hoy
                </span>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-mono font-medium text-[#e5e5e5] mb-1">
                  {stats.cutsToday} <span className="text-xs text-[#7c7a85] font-sans uppercase">cortes</span>
                </div>
                <p className="text-[11px] text-[#7c7a85] uppercase tracking-[0.025em] font-sans">Cortes de Hoy</p>
                <div className="mt-3 pt-2.5 border-t border-[#2b292d] flex items-center justify-between text-xs font-sans">
                  <span className="text-[#7c7a85]">Ingresos hoy:</span>
                  <span className="font-mono font-medium text-[#71d083]">{formatPrice(stats.revenueToday)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Cortes Esta Semana */}
          <motion.div variants={itemVariants}>
            <div className="bg-[#121113] border border-[#2b292d] hover:border-[#3c393f] rounded-[6px] p-5 flex flex-col justify-between h-full transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 border border-[#2b292d] bg-[#1a191b] text-[#70b8ff] rounded-[6px] flex items-center justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="tag-depot-blue">
                  Semana
                </span>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-mono font-medium text-[#e5e5e5] mb-1">
                  {stats.cutsThisWeek} <span className="text-xs text-[#7c7a85] font-sans uppercase">cortes</span>
                </div>
                <p className="text-[11px] text-[#7c7a85] uppercase tracking-[0.025em] font-sans">Esta Semana</p>
                <div className="mt-3 pt-2.5 border-t border-[#2b292d] flex items-center justify-between text-xs font-sans">
                  <span className="text-[#7c7a85]">Generado:</span>
                  <span className="font-mono font-medium text-[#e5e5e5]">{formatPrice(stats.revenueThisWeek)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Cortes Este Mes */}
          <motion.div variants={itemVariants}>
            <div className="bg-[#121113] border border-[#2b292d] hover:border-[#3c393f] rounded-[6px] p-5 flex flex-col justify-between h-full transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 border border-[#2b292d] bg-[#1a191b] text-[#71d083] rounded-[6px] flex items-center justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
                  <DollarSign className="w-4 h-4" />
                </div>
                <span className="tag-depot-green">
                  Mes
                </span>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-mono font-medium text-[#e5e5e5] mb-1">
                  {stats.cutsThisMonth} <span className="text-xs text-[#7c7a85] font-sans uppercase">cortes</span>
                </div>
                <p className="text-[11px] text-[#7c7a85] uppercase tracking-[0.025em] font-sans">Este Mes</p>
                <div className="mt-3 pt-2.5 border-t border-[#2b292d] flex items-center justify-between text-xs font-sans">
                  <span className="text-[#7c7a85]">Generado:</span>
                  <span className="font-mono font-medium text-[#71d083]">{formatPrice(stats.revenueThisMonth)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Citas Pendientes Hoy */}
          <motion.div variants={itemVariants}>
            <div className="bg-[#121113] border border-[#2b292d] hover:border-[#3c393f] rounded-[6px] p-5 flex flex-col justify-between h-full transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 border border-[#2b292d] bg-[#1a191b] text-[#baa7ff] rounded-[6px] flex items-center justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="tag-depot-lilac">
                  Por Atender
                </span>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-mono font-medium text-[#e5e5e5] mb-1">
                  {stats.pendingToday} <span className="text-xs text-[#7c7a85] font-sans uppercase">citas</span>
                </div>
                <p className="text-[11px] text-[#7c7a85] uppercase tracking-[0.025em] font-sans">Pendientes Hoy</p>
                <div className="mt-3 pt-2.5 border-t border-[#2b292d] flex items-center justify-between text-xs font-sans">
                  <span className="text-[#7c7a85]">Total agendadas:</span>
                  <span className="font-mono font-medium text-[#e5e5e5]">{stats.totalScheduledToday}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Tab Switcher Buttons */}
        <div className="flex flex-wrap items-center gap-3 border-b border-[#2b292d] pb-4">
          <button
            onClick={() => handleTabChange('agenda')}
            className={`px-5 py-2.5 font-sans font-medium uppercase tracking-[0.025em] text-xs flex items-center gap-2 rounded-[6px] transition-all cursor-pointer border ${
              activeTab === 'agenda'
                ? 'bg-[#1a191b] text-[#71d083] border-[#2d5736] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]'
                : 'bg-[#1a191b]/40 text-[#7c7a85] border-[#2b292d] hover:border-[#3c393f] hover:text-[#eeeef0]'
            }`}
          >
            <Calendar size={14} />
            Agenda de Reservas
            {appointments.length > 0 && (
              <span className={`px-2 py-0.5 text-[10px] font-mono rounded-[2px] ${activeTab === 'agenda' ? 'bg-[#1b2a1e] text-[#71d083] border border-[#2d5736]' : 'bg-[#121113] text-[#b5b2bc]'}`}>
                {appointments.length}
              </span>
            )}
          </button>

          <button
            onClick={() => handleTabChange('reporte')}
            className={`px-5 py-2.5 font-sans font-medium uppercase tracking-[0.025em] text-xs flex items-center gap-2 rounded-[6px] transition-all cursor-pointer border ${
              activeTab === 'reporte'
                ? 'bg-[#1a191b] text-[#71d083] border-[#2d5736] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]'
                : 'bg-[#1a191b]/40 text-[#7c7a85] border-[#2b292d] hover:border-[#3c393f] hover:text-[#eeeef0]'
            }`}
          >
            <CalendarRange size={14} />
            Reporte por Rango & Ganancias
          </button>
        </div>

        {/* TAB 1: AGENDA DE RESERVAS */}
        {activeTab === 'agenda' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Filter controls row */}
            <div className="bg-[#121113] p-5 border border-[#2b292d] rounded-[6px] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
              {/* Date selection */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] uppercase font-sans tracking-[0.025em] text-[#7c7a85]">Fecha:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="bg-[#1a191b] border border-[#2b292d] text-[#eeeef0] py-1.5 px-3 text-xs rounded-[6px] font-mono focus:outline-none focus:border-[#71d083]/70"
                />
                <button
                  type="button"
                  onClick={() => handleDateChange(todayStr)}
                  className={`px-3 py-1.5 text-xs font-sans uppercase tracking-[0.025em] rounded-[6px] border transition-all cursor-pointer ${
                    selectedDate === todayStr ? 'bg-[#1a191b] text-[#71d083] border-[#2d5736] font-medium' : 'bg-[#1a191b]/40 text-[#7c7a85] border-[#2b292d] hover:border-[#3c393f]'
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
                  className="px-3 py-1.5 text-xs font-sans uppercase tracking-[0.025em] rounded-[6px] bg-[#1a191b]/40 text-[#7c7a85] border border-[#2b292d] hover:border-[#3c393f] cursor-pointer"
                >
                  Mañana
                </button>
              </div>

              {/* Search client input */}
              <div className="relative flex-1 max-w-md">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7c7a85]" />
                <input
                  type="text"
                  placeholder="Buscar por cliente o teléfono..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-depot pl-9 py-2 text-xs"
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
                  className={`px-3 py-1.5 text-xs font-sans uppercase tracking-[0.025em] rounded-[6px] border transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === st.id
                      ? 'bg-[#1a191b] text-[#71d083] border-[#2d5736] font-medium'
                      : 'bg-[#1a191b]/40 text-[#7c7a85] border-[#2b292d] hover:border-[#3c393f]'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Appointment Cards list */}
            {loadingAppointments ? (
              <div className="text-center py-20 bg-[#121113] border border-[#2b292d] rounded-[6px]">
                <RefreshCw size={22} className="animate-spin text-[#71d083] mx-auto mb-3" />
                <p className="text-[#7c7a85] font-mono text-xs uppercase tracking-[0.025em]">Cargando agenda de citas...</p>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center py-16 bg-[#121113] border border-[#2b292d] rounded-[6px] p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                <Scissors size={32} className="text-[#7c7a85] mx-auto mb-3" />
                <h3 className="text-sm font-sans font-medium uppercase tracking-[-0.025em] text-[#e5e5e5] mb-2">No hay reservas encontradas</h3>
                <p className="text-[#7c7a85] text-xs max-w-md mx-auto font-sans">
                  {statusFilter !== 'todos' || searchQuery
                    ? 'No se encontraron citas que coincidan con los filtros aplicados.'
                    : `No tienes citas agendadas para el día ${selectedDate}.`}
                </p>
                {selectedDate !== todayStr && (
                  <button
                    onClick={() => handleDateChange(todayStr)}
                    className="mt-4 btn-depot-primary !py-2 !px-4"
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
                    <div
                      key={apt._id}
                      className={`bg-[#121113] border rounded-[6px] p-5 sm:p-6 transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] ${
                        isCurrent
                          ? 'border-[#71d083]/70'
                          : isCompleted
                          ? 'border-[#2b292d] opacity-80'
                          : 'border-[#2b292d] hover:border-[#3c393f]'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        {/* Time & Client Column */}
                        <div className="flex items-start sm:items-center gap-4 w-full lg:w-auto">
                          {/* Time badge */}
                          <div className="bg-[#1a191b] border border-[#2b292d] px-3 py-2 text-center rounded-[6px] min-w-[90px] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
                            <div className="text-[#e5e5e5] font-mono font-medium text-base">
                              {apt.startTime}
                            </div>
                            <div className="text-[10px] text-[#7c7a85] font-mono">
                              hasta {apt.endTime}
                            </div>
                          </div>

                          {/* Client details */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-base font-sans font-medium tracking-[-0.025em] text-[#e5e5e5]">
                                {client.name || 'Cliente sin nombre'}
                              </h3>
                              <span className={
                                apt.status === 'completada'
                                  ? 'tag-depot-green'
                                  : apt.status === 'cancelada'
                                  ? 'tag-depot-danger'
                                  : isCurrent
                                  ? 'tag-depot-green'
                                  : 'tag-depot-neutral'
                              }>
                                {getStatusLabel(apt.status)}
                              </span>
                              {client.loyaltyPoints > 0 && (
                                <span className="tag-depot-lilac">
                                  {client.loyaltyPoints} pts
                                </span>
                              )}
                            </div>

                            {/* Contact links */}
                            <div className="flex items-center gap-3 text-xs text-[#7c7a85] flex-wrap font-sans">
                              {client.phone && (
                                <a
                                  href={`tel:${client.phone}`}
                                  className="flex items-center gap-1 hover:text-[#eeeef0] transition-colors font-mono"
                                >
                                  <Phone size={12} className="text-[#70b8ff]" /> {client.phone}
                                </a>
                              )}
                              {client.phone && (
                                <a
                                  href={`https://wa.me/57${client.phone.replace(/\D/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-[#71d083] hover:underline font-mono transition-colors"
                                >
                                  <MessageSquare size={12} /> WhatsApp
                                </a>
                              )}
                              {apt.paymentMethod && (
                                <span className="font-mono text-[10px] uppercase bg-[#1a191b] px-2 py-0.5 border border-[#2b292d] text-[#b5b2bc] rounded-[2px]">
                                  {apt.paymentMethod}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Services & Price Column */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between lg:justify-end gap-6 w-full lg:w-auto">
                          <div className="text-left sm:text-right">
                            <div className="text-xs font-sans text-[#b5b2bc] max-w-xs">
                              {apt.services?.map((s) => s.service?.name || 'Servicio').join(' + ')}
                            </div>
                            <div className="text-lg font-mono font-medium text-[#71d083] mt-0.5">
                              {formatPrice(apt.totalPrice)}
                            </div>
                            <div className="text-[10px] text-[#7c7a85] font-mono">
                              {apt.totalDuration} min aprox.
                            </div>
                          </div>

                          {/* Quick Action buttons */}
                          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            {['pendiente', 'confirmada'].includes(apt.status) && (
                              <button
                                onClick={() => handleUpdateStatus(apt._id, 'en_progreso')}
                                disabled={actionLoadingId === apt._id}
                                className="btn-depot-outline !py-2 !px-3 text-xs flex items-center gap-1.5"
                                title="Iniciar corte ahora"
                              >
                                <Play size={12} /> Iniciar
                              </button>
                            )}

                            {apt.status === 'en_progreso' && (
                              <button
                                onClick={() => handleUpdateStatus(apt._id, 'completada')}
                                disabled={actionLoadingId === apt._id}
                                className="btn-depot-primary !py-2 !px-4 text-xs"
                                title="Marcar corte como terminado"
                              >
                                <Check size={13} /> Finalizar
                              </button>
                            )}

                            {isCompleted && (
                              <div className="tag-depot-green">
                                <CheckCircle size={12} /> Concluido
                              </div>
                            )}

                            {!isCompleted && !isCancelled && (
                              <button
                                onClick={() => openCancelModal(apt)}
                                disabled={actionLoadingId === apt._id}
                                className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-[6px] transition-all cursor-pointer"
                                title="Cancelar cita"
                              >
                                <X size={13} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {apt.notes && (
                        <div className="mt-3 pt-3 border-t border-[#2b292d] text-xs text-[#7c7a85] flex items-start gap-2 font-sans">
                          <span className="text-[#eeeef0] uppercase font-mono text-[10px]">Nota:</span>
                          <span className="text-[#b5b2bc]">"{apt.notes}"</span>
                        </div>
                      )}
                    </div>
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
            <div className="bg-[#121113] p-6 border border-[#2b292d] rounded-[6px] space-y-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-sans font-medium uppercase tracking-[-0.025em] text-[#e5e5e5] flex items-center gap-2">
                  <CalendarRange className="text-[#71d083]" size={15} />
                  Filtrar Ganancias & Cortes por Rango
                </h2>
                <span className="text-xs text-[#7c7a85] font-mono hidden sm:inline">Tu perfil personal</span>
              </div>

              {/* Date pickers & submit */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-4">
                  <label className="block text-[11px] uppercase font-sans tracking-[0.025em] text-[#b5b2bc] mb-1 font-medium">
                    Desde (Fecha inicial)
                  </label>
                  <input
                    type="date"
                    value={rangeStartDate}
                    onChange={(e) => setRangeStartDate(e.target.value)}
                    className="input-depot font-mono"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-[11px] uppercase font-sans tracking-[0.025em] text-[#b5b2bc] mb-1 font-medium">
                    Hasta (Fecha final)
                  </label>
                  <input
                    type="date"
                    value={rangeEndDate}
                    onChange={(e) => setRangeEndDate(e.target.value)}
                    className="input-depot font-mono"
                  />
                </div>

                <div className="sm:col-span-4">
                  <button
                    onClick={() => fetchRangeReport(rangeStartDate, rangeEndDate)}
                    disabled={loadingRange}
                    className="w-full btn-depot-primary flex items-center justify-center gap-2"
                  >
                    <Search size={13} />
                    {loadingRange ? 'Consultando...' : 'Consultar Rango'}
                  </button>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#2b292d] flex-wrap">
                <span className="text-[11px] text-[#7c7a85] font-sans uppercase tracking-[0.025em]">Accesos rápidos:</span>
                <button
                  type="button"
                  onClick={() => setRangePreset('today')}
                  className="btn-depot-outline !py-1 !px-2.5 !text-[11px]"
                >
                  Hoy
                </button>
                <button
                  type="button"
                  onClick={() => setRangePreset('week')}
                  className="btn-depot-outline !py-1 !px-2.5 !text-[11px]"
                >
                  Esta Semana
                </button>
                <button
                  type="button"
                  onClick={() => setRangePreset('month')}
                  className="btn-depot-outline !py-1 !px-2.5 !text-[11px]"
                >
                  Este Mes
                </button>
                <button
                  type="button"
                  onClick={() => setRangePreset('last30')}
                  className="btn-depot-outline !py-1 !px-2.5 !text-[11px]"
                >
                  Últimos 30 días
                </button>
              </div>
            </div>

            {/* Results Financial Summary Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#121113] border border-[#2b292d] hover:border-[#3c393f] rounded-[6px] p-5 transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                <div className="text-[11px] uppercase tracking-[0.025em] font-sans text-[#7c7a85] mb-1">
                  Total Generado
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-medium text-[#71d083]">
                  {formatPrice(rangeStats.totalRevenue)}
                </div>
                <div className="text-[10px] text-[#7c7a85] font-mono mt-2">
                  Del {rangeStartDate} al {rangeEndDate}
                </div>
              </div>

              <div className="bg-[#121113] border border-[#2b292d] hover:border-[#3c393f] rounded-[6px] p-5 transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                <div className="text-[11px] uppercase tracking-[0.025em] font-sans text-[#7c7a85] mb-1">
                  Cortes Realizados
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-medium text-[#e5e5e5]">
                  {rangeStats.totalCuts}
                </div>
                <div className="text-[10px] text-[#7c7a85] font-mono mt-2">
                  Citas completadas
                </div>
              </div>

              <div className="bg-[#121113] border border-[#2b292d] hover:border-[#3c393f] rounded-[6px] p-5 transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                <div className="text-[11px] uppercase tracking-[0.025em] font-sans text-[#7c7a85] mb-1">
                  Clientes Atendidos
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-medium text-[#baa7ff]">
                  {rangeStats.uniqueClients}
                </div>
                <div className="text-[10px] text-[#7c7a85] font-mono mt-2">
                  Clientes distintos
                </div>
              </div>

              <div className="bg-[#121113] border border-[#2b292d] hover:border-[#3c393f] rounded-[6px] p-5 transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                <div className="text-[11px] uppercase tracking-[0.025em] font-sans text-[#7c7a85] mb-1">
                  Promedio por Corte
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-medium text-[#70b8ff]">
                  {rangeStats.totalCuts > 0
                    ? formatPrice(Math.round(rangeStats.totalRevenue / rangeStats.totalCuts))
                    : '$ 0'}
                </div>
                <div className="text-[10px] text-[#7c7a85] font-mono mt-2">
                  Ticket promedio
                </div>
              </div>
            </div>

            {/* Detailed Table (SIN BOTÓN EXCEL) */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h3 className="text-sm font-sans font-medium uppercase tracking-[-0.025em] text-[#e5e5e5] flex items-center gap-2">
                  <Users size={15} className="text-[#71d083]" />
                  Clientes Atendidos en el Periodo ({rangeStats.appointments?.length || 0})
                </h3>
              </div>

              {loadingRange ? (
                <div className="text-center py-20 bg-[#121113] border border-[#2b292d] rounded-[6px]">
                  <RefreshCw size={22} className="animate-spin text-[#71d083] mx-auto mb-3" />
                  <p className="text-[#7c7a85] font-mono text-xs uppercase">Consultando datos del rango...</p>
                </div>
              ) : rangeStats.appointments?.length === 0 ? (
                <div className="text-center py-16 bg-[#121113] border border-[#2b292d] rounded-[6px] p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                  <AlertCircle size={32} className="text-[#7c7a85] mx-auto mb-3" />
                  <h4 className="text-sm font-sans font-medium uppercase tracking-[-0.025em] text-[#e5e5e5] mb-2">
                    No se registran cortes en este rango
                  </h4>
                  <p className="text-[#7c7a85] text-xs max-w-md mx-auto font-sans">
                    No se encontraron servicios ni ingresos para el periodo comprendido entre {rangeStartDate} y {rangeEndDate}.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto bg-[#121113] border border-[#2b292d] rounded-[6px] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                  <table className="w-full text-left text-xs font-sans">
                    <thead>
                      <tr className="border-b border-[#2b292d] bg-[#1a191b] text-[10px] font-sans uppercase tracking-[0.025em] text-[#7c7a85]">
                        <th className="py-3 px-4">Fecha y Hora</th>
                        <th className="py-3 px-4">Cliente Peluqueado</th>
                        <th className="py-3 px-4">Contacto</th>
                        <th className="py-3 px-4">Servicio(s)</th>
                        <th className="py-3 px-4">Método de Pago</th>
                        <th className="py-3 px-4 text-right">Plata Generada</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2b292d]/50">
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
                          <tr key={apt._id} className="hover:bg-[#1a191b]/50 transition-colors">
                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="font-mono font-medium text-[#e5e5e5]">{dateStr}</div>
                              <div className="text-[11px] text-[#7c7a85] font-mono">{apt.startTime} - {apt.endTime}</div>
                            </td>

                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="font-sans font-medium text-[#eeeef0]">{client.name || 'Sin nombre'}</div>
                              <div className="text-[11px] text-[#7c7a85]">{client.email || ''}</div>
                            </td>

                            <td className="py-3 px-4 whitespace-nowrap">
                              {client.phone ? (
                                <div className="flex items-center gap-2">
                                  <a
                                    href={`tel:${client.phone}`}
                                    className="font-mono text-[#b5b2bc] hover:text-[#eeeef0] transition-colors"
                                  >
                                    {client.phone}
                                  </a>
                                  <a
                                    href={`https://wa.me/57${client.phone.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#71d083] hover:underline"
                                    title="Contactar por WhatsApp"
                                  >
                                    <MessageSquare size={13} />
                                  </a>
                                </div>
                              ) : (
                                <span className="text-[#7c7a85] text-xs">Sin teléfono</span>
                              )}
                            </td>

                            <td className="py-3 px-4">
                              <div className="text-xs text-[#b5b2bc]">
                                {apt.services?.map((s) => s.service?.name || 'Servicio').join(', ')}
                              </div>
                            </td>

                            <td className="py-3 px-4 whitespace-nowrap">
                              <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-[#1a191b] border border-[#2b292d] text-[#b5b2bc] rounded-[2px]">
                                {apt.paymentMethod || 'Efectivo'}
                              </span>
                            </td>

                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <span className="font-mono font-medium text-[#71d083] text-xs">
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
          title="CANCELAR CITA"
        >
          <div className="space-y-4">
            <p className="text-xs text-[#b5b2bc] font-sans leading-relaxed">
              ¿Estás seguro de que deseas cancelar la cita de{' '}
              <strong className="text-[#e5e5e5]">{selectedAppointmentToCancel?.client?.name}</strong> programada para las{' '}
              <strong className="text-[#71d083]">{selectedAppointmentToCancel?.startTime}</strong>?
            </p>

            <div>
              <label className="block text-[11px] font-sans uppercase tracking-[0.025em] text-[#b5b2bc] mb-1.5 font-medium">
                Motivo de la cancelación:
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Ej: Calamidad doméstica, cambio de horario coordinado con cliente..."
                rows={3}
                className="input-depot h-20 resize-none font-sans"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#2b292d]">
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="btn-depot-outline"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={actionLoadingId !== null}
                className="btn-depot-outline text-rose-400 border-rose-500/30 hover:bg-rose-500/10"
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
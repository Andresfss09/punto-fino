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
  FileSpreadsheet
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
    try {
      setLoadingRange(true);
      const res = await barberService.getRangeReport({ startDate: start, endDate: end });
      const data = res.data || res;
      setRangeStats({
        totalCuts: data.totalCuts || 0,
        totalRevenue: data.totalRevenue || 0,
        totalAppointments: data.totalAppointments || 0,
        uniqueClients: data.uniqueClients || 0,
        appointments: data.appointments || [],
      });
    } catch (error) {
      console.error('Error cargando reporte de rango:', error);
      toast.error('Error al consultar el rango seleccionado');
    } finally {
      setLoadingRange(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchAgenda(selectedDate);
  }, [fetchStats, fetchAgenda, selectedDate]);

  useEffect(() => {
    if (activeTab === 'reporte') {
      fetchRangeReport(rangeStartDate, rangeEndDate);
    }
  }, [activeTab, fetchRangeReport, rangeStartDate, rangeEndDate]);

  // Handle Date changes in Agenda tab
  const handleDateChange = (date) => {
    setSelectedDate(date);
    fetchAgenda(date);
  };

  // Quick range preset triggers
  const setRangePreset = (type) => {
    const today = new Date();
    const end = today.toISOString().split('T')[0];
    let start = end;

    if (type === 'today') {
      start = end;
    } else if (type === 'week') {
      const d = new Date();
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      d.setDate(diff);
      start = d.toISOString().split('T')[0];
    } else if (type === 'month') {
      const d = new Date(today.getFullYear(), today.getMonth(), 1);
      start = d.toISOString().split('T')[0];
    } else if (type === 'last30') {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      start = d.toISOString().split('T')[0];
    }

    setRangeStartDate(start);
    setRangeEndDate(end);
    fetchRangeReport(start, end);
  };

  // Update appointment status handler
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setActionLoadingId(id);
      await appointmentService.updateStatus(id, newStatus);
      toast.success(
        newStatus === 'en_progreso'
          ? 'Corte iniciado'
          : newStatus === 'completada'
          ? 'Corte completado con éxito'
          : `Estado actualizado a ${newStatus}`
      );
      fetchAgenda(selectedDate);
      fetchStats();
      if (activeTab === 'reporte') fetchRangeReport(rangeStartDate, rangeEndDate);
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      toast.error(error.response?.data?.message || 'Error al actualizar estado de la cita');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Cancel flow
  const openCancelModal = (apt) => {
    setSelectedAppointmentToCancel(apt);
    setCancelReason('');
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedAppointmentToCancel) return;
    try {
      setActionLoadingId(selectedAppointmentToCancel._id);
      await appointmentService.updateStatus(selectedAppointmentToCancel._id, 'cancelada', cancelReason);
      toast.success('Cita cancelada correctamente');
      setCancelModalOpen(false);
      fetchAgenda(selectedDate);
      fetchStats();
    } catch (error) {
      console.error('Error al cancelar cita:', error);
      toast.error('Error al cancelar la cita');
    } finally {
      setActionLoadingId(null);
      setSelectedAppointmentToCancel(null);
    }
  };

  // CSV Export for Range tab
  const handleExportExcel = () => {
    if (!rangeStats.appointments || rangeStats.appointments.length === 0) {
      toast.error('No hay datos de citas para exportar en este rango');
      return;
    }

    try {
      const headers = [
        'Fecha',
        'Hora Inicio',
        'Hora Fin',
        'Cliente',
        'Telefono',
        'Servicios',
        'Metodo de Pago',
        'Total Cobrado (COP)',
      ];

      const rows = rangeStats.appointments.map((apt) => {
        const client = apt.client || {};
        const dateFormatted = apt.date ? new Date(apt.date).toLocaleDateString('es-CO') : 'N/A';
        const serviceNames = (apt.services || []).map((s) => s.service?.name || 'Servicio').join(' + ');

        return [
          `"${dateFormatted}"`,
          `"${apt.startTime || ''}"`,
          `"${apt.endTime || ''}"`,
          `"${(client.name || 'Sin nombre').replace(/"/g, '""')}"`,
          `"${(client.phone || '').replace(/"/g, '""')}"`,
          `"${serviceNames.replace(/"/g, '""')}"`,
          `"${apt.paymentMethod || 'Efectivo'}"`,
          apt.totalPrice || 0,
        ];
      });

      rows.push([]);
      rows.push([
        '"TOTALES"',
        '""',
        '""',
        '""',
        `"${rangeStats.totalCuts} cortes finalizados"`,
        '""',
        '""',
        rangeStats.totalRevenue || 0,
      ]);

      const csvString = 'sep=;\r\n' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');
      const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const cleanName = (user?.name || 'barbero').toLowerCase().replace(/\s+/g, '_');
      link.download = `reporte_cortes_${cleanName}_${rangeStartDate}_al_${rangeEndDate}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Reporte descargado exitosamente para Excel');
    } catch (err) {
      console.error('Error al exportar a Excel:', err);
      toast.error('Ocurrió un error al generar el archivo');
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <PageTransition>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-[#0a0a0a] p-6 border border-[#1e1e1e] rounded-none">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="eyebrow text-gold-400 flex items-center gap-1">
                <Scissors size={12} /> Maestro Barbero
              </span>
              <span className="text-xs text-[#666666] font-mono uppercase tracking-wider">Triadix · Atelier</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-sans font-medium uppercase tracking-[0.16em] text-white">
              ¡Hola, <span className="text-gold-400">{user?.name ? user.name.split(' ')[0] : 'Barbero'}</span>!
            </h1>
            <p className="text-[#888888] text-xs sm:text-sm mt-1 uppercase font-mono tracking-wider">
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
              className="p-2.5 bg-[#141414] hover:bg-[#1a1a1a] text-[#888888] hover:text-white border border-[#222222] rounded-none flex items-center gap-2 text-xs transition-all cursor-pointer font-sans uppercase tracking-[0.16em]"
              title="Actualizar datos"
            >
              <RefreshCw size={14} className={loadingStats || loadingAppointments || loadingRange ? 'animate-spin text-white' : ''} />
              <span className="hidden sm:inline">Refrescar</span>
            </button>
          </div>
        </div>

        {/* KPI Counter Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {/* Cortes Hoy */}
          <motion.div variants={itemVariants}>
            <div className="bg-[#0a0a0a] border border-[#1e1e1e] hover:border-[#333333] rounded-none p-5 flex flex-col justify-between h-full transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 border border-[#222222] bg-[#141414] text-white rounded-none flex items-center justify-center">
                  <Scissors className="w-4 h-4" />
                </div>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded-none uppercase tracking-wider bg-[#141414] text-gold-400 border border-gold-400/30">
                  Hoy
                </span>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-mono font-medium text-white mb-1">
                  {stats.cutsToday} <span className="text-xs text-[#888888] font-sans uppercase">cortes</span>
                </div>
                <p className="text-[11px] text-[#888888] uppercase tracking-[0.16em] font-sans">Cortes de Hoy</p>
                <div className="mt-3 pt-2.5 border-t border-[#1e1e1e] flex items-center justify-between text-xs font-sans">
                  <span className="text-[#888888]">Ingresos hoy:</span>
                  <span className="font-mono font-medium text-white">{formatPrice(stats.revenueToday)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Cortes Esta Semana */}
          <motion.div variants={itemVariants}>
            <div className="bg-[#0a0a0a] border border-[#1e1e1e] hover:border-[#333333] rounded-none p-5 flex flex-col justify-between h-full transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 border border-[#222222] bg-[#141414] text-white rounded-none flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded-none uppercase tracking-wider bg-[#141414] text-white border border-[#262626]">
                  Semana
                </span>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-mono font-medium text-white mb-1">
                  {stats.cutsThisWeek} <span className="text-xs text-[#888888] font-sans uppercase">cortes</span>
                </div>
                <p className="text-[11px] text-[#888888] uppercase tracking-[0.16em] font-sans">Esta Semana</p>
                <div className="mt-3 pt-2.5 border-t border-[#1e1e1e] flex items-center justify-between text-xs font-sans">
                  <span className="text-[#888888]">Generado:</span>
                  <span className="font-mono font-medium text-white">{formatPrice(stats.revenueThisWeek)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Cortes Este Mes */}
          <motion.div variants={itemVariants}>
            <div className="bg-[#0a0a0a] border border-[#1e1e1e] hover:border-[#333333] rounded-none p-5 flex flex-col justify-between h-full transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 border border-[#222222] bg-[#141414] text-emerald-400 rounded-none flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded-none uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Mes
                </span>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-mono font-medium text-white mb-1">
                  {stats.cutsThisMonth} <span className="text-xs text-[#888888] font-sans uppercase">cortes</span>
                </div>
                <p className="text-[11px] text-[#888888] uppercase tracking-[0.16em] font-sans">Este Mes</p>
                <div className="mt-3 pt-2.5 border-t border-[#1e1e1e] flex items-center justify-between text-xs font-sans">
                  <span className="text-[#888888]">Generado:</span>
                  <span className="font-mono font-medium text-white">{formatPrice(stats.revenueThisMonth)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Citas Pendientes Hoy */}
          <motion.div variants={itemVariants}>
            <div className="bg-[#0a0a0a] border border-[#1e1e1e] hover:border-[#333333] rounded-none p-5 flex flex-col justify-between h-full transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 border border-[#222222] bg-[#141414] text-white rounded-none flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded-none uppercase tracking-wider bg-[#141414] text-gold-400 border border-gold-400/30">
                  Por Atender
                </span>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-mono font-medium text-white mb-1">
                  {stats.pendingToday} <span className="text-xs text-[#888888] font-sans uppercase">citas</span>
                </div>
                <p className="text-[11px] text-[#888888] uppercase tracking-[0.16em] font-sans">Pendientes Hoy</p>
                <div className="mt-3 pt-2.5 border-t border-[#1e1e1e] flex items-center justify-between text-xs font-sans">
                  <span className="text-[#888888]">Total agendadas:</span>
                  <span className="font-mono font-medium text-white">{stats.totalScheduledToday}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Tab Switcher Buttons */}
        <div className="flex flex-wrap items-center gap-3 border-b border-[#1e1e1e] pb-4">
          <button
            onClick={() => setActiveTab('agenda')}
            className={`px-5 py-2.5 font-sans font-medium uppercase tracking-[0.16em] text-xs flex items-center gap-2 rounded-none transition-all cursor-pointer border ${
              activeTab === 'agenda'
                ? 'bg-white text-black border-white'
                : 'bg-[#141414] text-[#888888] border-[#222222] hover:border-white/40 hover:text-white'
            }`}
          >
            <Calendar size={14} />
            Agenda de Reservas
            {appointments.length > 0 && (
              <span className={`px-2 py-0.5 text-[10px] font-mono rounded-none ${activeTab === 'agenda' ? 'bg-black text-white' : 'bg-[#0a0a0a] text-white'}`}>
                {appointments.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('reporte')}
            className={`px-5 py-2.5 font-sans font-medium uppercase tracking-[0.16em] text-xs flex items-center gap-2 rounded-none transition-all cursor-pointer border ${
              activeTab === 'reporte'
                ? 'bg-white text-black border-white'
                : 'bg-[#141414] text-[#888888] border-[#222222] hover:border-white/40 hover:text-white'
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
            <div className="bg-[#0a0a0a] p-5 border border-[#1e1e1e] rounded-none flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Date selection */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] uppercase font-sans tracking-[0.16em] text-[#888888]">Fecha:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="bg-[#141414] border border-[#222222] text-white py-1.5 px-3 text-xs rounded-none font-mono focus:outline-none focus:border-white/50"
                />
                <button
                  type="button"
                  onClick={() => handleDateChange(todayStr)}
                  className={`px-3 py-1.5 text-xs font-sans uppercase tracking-[0.16em] rounded-none border transition-all cursor-pointer ${
                    selectedDate === todayStr ? 'bg-white text-black border-white font-medium' : 'bg-[#141414] text-[#888888] border-[#222222] hover:border-white/40'
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
                  className="px-3 py-1.5 text-xs font-sans uppercase tracking-[0.16em] rounded-none bg-[#141414] text-[#888888] border border-[#222222] hover:border-white/40 cursor-pointer"
                >
                  Mañana
                </button>
              </div>

              {/* Search client input */}
              <div className="relative flex-1 max-w-md">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
                <input
                  type="text"
                  placeholder="Buscar por cliente o teléfono..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#141414] border border-[#222222] text-white pl-9 py-2 text-xs w-full rounded-none font-sans focus:outline-none focus:border-white/50 placeholder:text-[#666666]"
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
                  className={`px-3 py-1.5 text-xs font-sans uppercase tracking-[0.16em] rounded-none border transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === st.id
                      ? 'bg-white text-black border-white font-medium'
                      : 'bg-[#141414] text-[#888888] border-[#222222] hover:border-white/40'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Appointment Cards list */}
            {loadingAppointments ? (
              <div className="text-center py-16 bg-[#0a0a0a] border border-[#1e1e1e] rounded-none">
                <RefreshCw size={22} className="animate-spin text-white mx-auto mb-3" />
                <p className="text-[#888888] font-mono text-xs uppercase tracking-wider">Cargando agenda de citas...</p>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center py-16 bg-[#0a0a0a] border border-[#1e1e1e] rounded-none p-8">
                <Scissors size={32} className="text-[#444444] mx-auto mb-3" />
                <h3 className="text-sm font-sans font-medium uppercase tracking-[0.16em] text-white mb-2">No hay reservas encontradas</h3>
                <p className="text-[#888888] text-xs max-w-md mx-auto font-sans">
                  {statusFilter !== 'todos' || searchQuery
                    ? 'No se encontraron citas que coincidan con los filtros aplicados.'
                    : `No tienes citas agendadas para el día ${selectedDate}.`}
                </p>
                {selectedDate !== todayStr && (
                  <button
                    onClick={() => handleDateChange(todayStr)}
                    className="mt-4 btn-ferrari-primary text-xs !py-2 !px-4"
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
                      className={`bg-[#0a0a0a] border rounded-none p-5 sm:p-6 transition-all ${
                        isCurrent
                          ? 'border-white'
                          : isCompleted
                          ? 'border-[#1e1e1e] opacity-75'
                          : 'border-[#1e1e1e] hover:border-[#333333]'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        {/* Time & Client Column */}
                        <div className="flex items-start sm:items-center gap-4 w-full lg:w-auto">
                          {/* Time badge */}
                          <div className="bg-[#141414] border border-[#222222] px-3 py-2 text-center rounded-none min-w-[90px]">
                            <div className="text-white font-mono font-medium text-base">
                              {apt.startTime}
                            </div>
                            <div className="text-[10px] text-[#888888] font-mono">
                              hasta {apt.endTime}
                            </div>
                          </div>

                          {/* Client details */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-base font-sans font-medium uppercase tracking-[0.14em] text-white">
                                {client.name || 'Cliente sin nombre'}
                              </h3>
                              <span className={`px-2 py-0.5 text-[10px] font-mono rounded-none uppercase tracking-wider border ${
                                apt.status === 'completada'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                  : apt.status === 'cancelada'
                                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                  : isCurrent
                                  ? 'bg-white text-black border-white'
                                  : 'bg-[#141414] text-[#888888] border-[#222222]'
                              }`}>
                                {getStatusLabel(apt.status)}
                              </span>
                              {client.loyaltyPoints > 0 && (
                                <span className="px-2 py-0.5 text-[10px] font-mono rounded-none uppercase bg-gold-400/10 text-gold-400 border border-gold-400/30">
                                  {client.loyaltyPoints} pts
                                </span>
                              )}
                            </div>

                            {/* Contact links */}
                            <div className="flex items-center gap-3 text-xs text-[#888888] flex-wrap font-sans">
                              {client.phone && (
                                <a
                                  href={`tel:${client.phone}`}
                                  className="flex items-center gap-1 hover:text-white transition-colors font-mono"
                                >
                                  <Phone size={12} /> {client.phone}
                                </a>
                              )}
                              {client.phone && (
                                <a
                                  href={`https://wa.me/57${client.phone.replace(/\D/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-mono transition-colors"
                                >
                                  <MessageSquare size={12} /> WhatsApp
                                </a>
                              )}
                              {apt.paymentMethod && (
                                <span className="font-mono text-[10px] uppercase bg-[#141414] px-2 py-0.5 border border-[#222222] text-[#d4d4d4] rounded-none">
                                  {apt.paymentMethod}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Services & Price Column */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between lg:justify-end gap-6 w-full lg:w-auto">
                          <div className="text-left sm:text-right">
                            <div className="text-xs font-sans text-[#d4d4d4] max-w-xs">
                              {apt.services?.map((s) => s.service?.name || 'Servicio').join(' + ')}
                            </div>
                            <div className="text-lg font-mono font-medium text-white mt-0.5">
                              {formatPrice(apt.totalPrice)}
                            </div>
                            <div className="text-[10px] text-[#888888] font-mono">
                              {apt.totalDuration} min aprox.
                            </div>
                          </div>

                          {/* Quick Action buttons */}
                          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            {['pendiente', 'confirmada'].includes(apt.status) && (
                              <button
                                onClick={() => handleUpdateStatus(apt._id, 'en_progreso')}
                                disabled={actionLoadingId === apt._id}
                                className="px-3.5 py-2 bg-[#141414] hover:bg-[#1a1a1a] text-white border border-[#262626] text-xs font-sans font-medium uppercase tracking-[0.16em] rounded-none flex items-center gap-1.5 transition-all cursor-pointer"
                                title="Iniciar corte ahora"
                              >
                                <Play size={12} /> Iniciar
                              </button>
                            )}

                            {apt.status === 'en_progreso' && (
                              <button
                                onClick={() => handleUpdateStatus(apt._id, 'completada')}
                                disabled={actionLoadingId === apt._id}
                                className="btn-ferrari-primary text-xs !py-2 !px-4"
                                title="Marcar corte como terminado"
                              >
                                <Check size={13} /> Finalizar
                              </button>
                            )}

                            {isCompleted && (
                              <div className="px-2.5 py-1 text-[10px] font-mono rounded-none uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                                <CheckCircle size={12} /> Concluido
                              </div>
                            )}

                            {!isCompleted && !isCancelled && (
                              <button
                                onClick={() => openCancelModal(apt)}
                                disabled={actionLoadingId === apt._id}
                                className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-none transition-all cursor-pointer"
                                title="Cancelar cita"
                              >
                                <X size={13} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {apt.notes && (
                        <div className="mt-3 pt-3 border-t border-[#1e1e1e] text-xs text-[#888888] flex items-start gap-2 font-sans">
                          <span className="text-white uppercase font-mono text-[10px]">Nota:</span>
                          <span className="text-[#a3a3a3]">"{apt.notes}"</span>
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
            <div className="bg-[#0a0a0a] p-6 border border-[#1e1e1e] rounded-none space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-sans font-medium uppercase tracking-[0.16em] text-white flex items-center gap-2">
                  <CalendarRange className="text-white" size={15} />
                  Filtrar Ganancias & Cortes por Rango
                </h2>
                <span className="text-xs text-[#888888] font-mono hidden sm:inline">Tu perfil personal</span>
              </div>

              {/* Date pickers & submit */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-4">
                  <label className="block text-[11px] uppercase font-sans tracking-[0.16em] text-[#888888] mb-1">
                    Desde (Fecha inicial)
                  </label>
                  <input
                    type="date"
                    value={rangeStartDate}
                    onChange={(e) => setRangeStartDate(e.target.value)}
                    className="w-full bg-[#141414] border border-[#222222] text-white py-2 px-3 text-xs rounded-none font-mono focus:outline-none focus:border-white/50"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-[11px] uppercase font-sans tracking-[0.16em] text-[#888888] mb-1">
                    Hasta (Fecha final)
                  </label>
                  <input
                    type="date"
                    value={rangeEndDate}
                    onChange={(e) => setRangeEndDate(e.target.value)}
                    className="w-full bg-[#141414] border border-[#222222] text-white py-2 px-3 text-xs rounded-none font-mono focus:outline-none focus:border-white/50"
                  />
                </div>

                <div className="sm:col-span-4">
                  <button
                    onClick={() => fetchRangeReport(rangeStartDate, rangeEndDate)}
                    disabled={loadingRange}
                    className="w-full btn-ferrari-primary text-xs !py-2.5 flex items-center justify-center gap-2"
                  >
                    <Search size={13} />
                    {loadingRange ? 'Consultando...' : 'Consultar Rango'}
                  </button>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#1e1e1e] flex-wrap">
                <span className="text-[11px] text-[#888888] font-sans uppercase tracking-[0.16em]">Accesos rápidos:</span>
                <button
                  type="button"
                  onClick={() => setRangePreset('today')}
                  className="text-xs px-3 py-1 bg-[#141414] text-[#888888] border border-[#222222] hover:text-white hover:border-white/40 rounded-none font-sans uppercase tracking-[0.16em] cursor-pointer"
                >
                  Hoy
                </button>
                <button
                  type="button"
                  onClick={() => setRangePreset('week')}
                  className="text-xs px-3 py-1 bg-[#141414] text-[#888888] border border-[#222222] hover:text-white hover:border-white/40 rounded-none font-sans uppercase tracking-[0.16em] cursor-pointer"
                >
                  Esta Semana
                </button>
                <button
                  type="button"
                  onClick={() => setRangePreset('month')}
                  className="text-xs px-3 py-1 bg-[#141414] text-[#888888] border border-[#222222] hover:text-white hover:border-white/40 rounded-none font-sans uppercase tracking-[0.16em] cursor-pointer"
                >
                  Este Mes
                </button>
                <button
                  type="button"
                  onClick={() => setRangePreset('last30')}
                  className="text-xs px-3 py-1 bg-[#141414] text-[#888888] border border-[#222222] hover:text-white hover:border-white/40 rounded-none font-sans uppercase tracking-[0.16em] cursor-pointer"
                >
                  Últimos 30 días
                </button>
              </div>
            </div>

            {/* Results Financial Summary Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#0a0a0a] border border-[#1e1e1e] hover:border-[#333333] rounded-none p-5 transition-all">
                <div className="text-[11px] uppercase tracking-[0.16em] font-sans text-[#888888] mb-1">
                  Total Generado
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-medium text-white">
                  {formatPrice(rangeStats.totalRevenue)}
                </div>
                <div className="text-[10px] text-[#888888] font-mono mt-2">
                  Del {rangeStartDate} al {rangeEndDate}
                </div>
              </div>

              <div className="bg-[#0a0a0a] border border-[#1e1e1e] hover:border-[#333333] rounded-none p-5 transition-all">
                <div className="text-[11px] uppercase tracking-[0.16em] font-sans text-[#888888] mb-1">
                  Cortes Realizados
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-medium text-white">
                  {rangeStats.totalCuts}
                </div>
                <div className="text-[10px] text-[#888888] font-mono mt-2">
                  Citas completadas
                </div>
              </div>

              <div className="bg-[#0a0a0a] border border-[#1e1e1e] hover:border-[#333333] rounded-none p-5 transition-all">
                <div className="text-[11px] uppercase tracking-[0.16em] font-sans text-[#888888] mb-1">
                  Clientes Atendidos
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-medium text-white">
                  {rangeStats.uniqueClients}
                </div>
                <div className="text-[10px] text-[#888888] font-mono mt-2">
                  Clientes distintos
                </div>
              </div>

              <div className="bg-[#0a0a0a] border border-[#1e1e1e] hover:border-[#333333] rounded-none p-5 transition-all">
                <div className="text-[11px] uppercase tracking-[0.16em] font-sans text-[#888888] mb-1">
                  Promedio por Corte
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-medium text-emerald-400">
                  {rangeStats.totalCuts > 0
                    ? formatPrice(Math.round(rangeStats.totalRevenue / rangeStats.totalCuts))
                    : '$ 0'}
                </div>
                <div className="text-[10px] text-[#888888] font-mono mt-2">
                  Ticket promedio
                </div>
              </div>
            </div>

            {/* Detailed Table */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h3 className="text-sm font-sans font-medium uppercase tracking-[0.16em] text-white flex items-center gap-2">
                  <Users size={15} className="text-white" />
                  Clientes Atendidos en el Periodo ({rangeStats.appointments?.length || 0})
                </h3>

                {rangeStats.appointments?.length > 0 && (
                  <button
                    onClick={handleExportExcel}
                    className="px-4 py-2 bg-[#141414] hover:bg-[#1a1a1a] text-emerald-400 border border-emerald-500/30 font-sans text-xs uppercase tracking-[0.16em] rounded-none flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <FileSpreadsheet size={14} />
                    Exportar a Excel (.csv)
                  </button>
                )}
              </div>

              {loadingRange ? (
                <div className="text-center py-16 bg-[#0a0a0a] border border-[#1e1e1e] rounded-none">
                  <RefreshCw size={22} className="animate-spin text-white mx-auto mb-3" />
                  <p className="text-[#888888] font-mono text-xs uppercase">Consultando datos del rango...</p>
                </div>
              ) : rangeStats.appointments?.length === 0 ? (
                <div className="text-center py-16 bg-[#0a0a0a] border border-[#1e1e1e] rounded-none p-8">
                  <AlertCircle size={32} className="text-[#444444] mx-auto mb-3" />
                  <h4 className="text-sm font-sans font-medium uppercase tracking-[0.16em] text-white mb-2">
                    No se registran cortes en este rango
                  </h4>
                  <p className="text-[#888888] text-xs max-w-md mx-auto font-sans">
                    No se encontraron servicios ni ingresos para el periodo comprendido entre {rangeStartDate} y {rangeEndDate}.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto bg-[#0a0a0a] border border-[#1e1e1e] rounded-none">
                  <table className="w-full text-left text-xs font-sans">
                    <thead>
                      <tr className="border-b border-[#1e1e1e] bg-[#0e0e0e] text-[10px] font-sans uppercase tracking-[0.16em] text-[#888888]">
                        <th className="py-3 px-4">Fecha y Hora</th>
                        <th className="py-3 px-4">Cliente Peluqueado</th>
                        <th className="py-3 px-4">Contacto</th>
                        <th className="py-3 px-4">Servicio(s)</th>
                        <th className="py-3 px-4">Método de Pago</th>
                        <th className="py-3 px-4 text-right">Plata Generada</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#161616]">
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
                          <tr key={apt._id} className="hover:bg-[#111111] transition-colors">
                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="font-mono font-medium text-white">{dateStr}</div>
                              <div className="text-[11px] text-[#888888] font-mono">{apt.startTime} - {apt.endTime}</div>
                            </td>

                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="font-sans font-medium text-white">{client.name || 'Sin nombre'}</div>
                              <div className="text-[11px] text-[#888888]">{client.email || ''}</div>
                            </td>

                            <td className="py-3 px-4 whitespace-nowrap">
                              {client.phone ? (
                                <div className="flex items-center gap-2">
                                  <a
                                    href={`tel:${client.phone}`}
                                    className="font-mono text-[#d4d4d4] hover:text-white transition-colors"
                                  >
                                    {client.phone}
                                  </a>
                                  <a
                                    href={`https://wa.me/57${client.phone.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-400 hover:text-emerald-300"
                                    title="Contactar por WhatsApp"
                                  >
                                    <MessageSquare size={13} />
                                  </a>
                                </div>
                              ) : (
                                <span className="text-[#888888] text-xs">Sin teléfono</span>
                              )}
                            </td>

                            <td className="py-3 px-4">
                              <div className="text-xs text-[#d4d4d4]">
                                {apt.services?.map((s) => s.service?.name || 'Servicio').join(', ')}
                              </div>
                            </td>

                            <td className="py-3 px-4 whitespace-nowrap">
                              <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-[#141414] border border-[#222222] text-[#d4d4d4]">
                                {apt.paymentMethod || 'Efectivo'}
                              </span>
                            </td>

                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <span className="font-mono font-medium text-white text-xs">
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
            <p className="text-xs text-[#d4d4d4] font-sans leading-relaxed">
              ¿Estás seguro de que deseas cancelar la cita de{' '}
              <strong className="text-white">{selectedAppointmentToCancel?.client?.name}</strong> programada para las{' '}
              <strong className="text-white">{selectedAppointmentToCancel?.startTime}</strong>?
            </p>

            <div>
              <label className="block text-[11px] font-sans uppercase tracking-[0.16em] text-[#888888] mb-1.5">
                Motivo de la cancelación:
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Ej: Calamidad doméstica, cambio de horario coordinado con cliente..."
                rows={3}
                className="bg-[#141414] border border-[#222222] text-white rounded-none p-3 text-xs font-sans w-full focus:outline-none focus:border-white/50 placeholder:text-[#666666]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#1e1e1e]">
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 bg-[#141414] hover:bg-[#1a1a1a] text-[#888888] hover:text-white border border-[#222222] text-xs font-sans uppercase tracking-[0.16em] rounded-none cursor-pointer transition-all"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={actionLoadingId !== null}
                className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-sans uppercase tracking-[0.16em] rounded-none cursor-pointer transition-all"
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
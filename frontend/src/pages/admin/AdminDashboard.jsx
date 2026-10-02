import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  Users,
  Scissors,
  Calendar,
  Download,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  Search,
  Filter,
  CreditCard,
  ChevronDown,
  Check,
  X,
  Edit2,
  Percent,
  Phone,
  Mail,
  Receipt,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import PageTransition from '../../components/ui/PageTransition';
import BrutalCard from '../../components/ui/BrutalCard';
import StatsCard from '../../components/ui/StatsCard';
import Modal from '../../components/ui/Modal';
import { adminService } from '../../services/adminService';
import { exportToPdf } from '../../utils/exportUtils';
import { formatTime } from '../../utils/formatters';
import toast from 'react-hot-toast';

const PERIOD_OPTIONS = [
  { id: 'today', label: 'Hoy' },
  { id: 'week', label: 'Esta Semana' },
  { id: 'month', label: 'Este Mes' },
  { id: 'last_month', label: 'Mes Pasado' },
  { id: 'all', label: 'Todo el Historial' },
  { id: 'custom', label: 'Rango Personalizado' },
];

const formatCurrency = (val) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(val || 0);
};

export default function AdminDashboard({ initialTab = 'stats' }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'stats' | 'payroll' | 'services'
  const [period, setPeriod] = useState('month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [barberFilter, setBarberFilter] = useState('all');

  // Servicios / Citas Table Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [commissionStatusFilter, setCommissionStatusFilter] = useState('todos');

  // Loading states
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);

  // Data from backend
  const [data, setData] = useState({
    summary: {},
    barbersPayroll: [],
    servicesBreakdown: [],
    paymentMethods: {},
    appointments: [],
  });

  // Modal State for Barber Payout
  const [payoutModal, setPayoutModal] = useState({
    isOpen: false,
    barber: null,
    pendingAppointments: [],
    totalPayout: 0,
  });
  const [submittingPayout, setSubmittingPayout] = useState(false);

  // Modal State for Editing Commission Rate
  const [commissionModal, setCommissionModal] = useState({
    isOpen: false,
    barber: null,
    newRate: 50,
  });
  const [submittingCommission, setSubmittingCommission] = useState(false);

  // Fetch data
  const fetchData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const params = {
        period,
        barberId: barberFilter !== 'all' ? barberFilter : undefined,
      };

      if (period === 'custom') {
        if (!customStartDate || !customEndDate) {
          if (isManualRefresh) toast.error('Ingresa ambas fechas para el rango personalizado');
          setLoading(false);
          setRefreshing(false);
          return;
        }
        params.startDate = customStartDate;
        params.endDate = customEndDate;
      }

      const res = await adminService.getPayrollStats(params);
      const payload = res.data || res;
      setData({
        summary: payload.summary || {},
        barbersPayroll: Array.isArray(payload.barbersPayroll) ? payload.barbersPayroll : [],
        servicesBreakdown: Array.isArray(payload.servicesBreakdown) ? payload.servicesBreakdown : [],
        paymentMethods: payload.paymentMethods || {},
        appointments: Array.isArray(payload.appointments) ? payload.appointments : [],
      });

      if (isManualRefresh) {
        toast.success('Datos de nómina y estadísticas actualizados');
      }
    } catch (error) {
      console.error('Error al cargar datos de nómina:', error);
      toast.error('Error al cargar los datos de administración');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (period !== 'custom' || (customStartDate && customEndDate)) {
      fetchData();
    }
  }, [period, customStartDate, customEndDate, barberFilter]);

  // Filtrado de la tabla de servicios
  const filteredAppointments = useMemo(() => {
    return (data.appointments || []).filter((apt) => {
      // Filtro de búsqueda
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesClient = apt.client?.name?.toLowerCase().includes(term);
        const matchesPhone = apt.client?.phone?.includes(term);
        const matchesBarber = apt.barber?.name?.toLowerCase().includes(term);
        const matchesCode = apt.confirmationCode?.toLowerCase().includes(term);
        const matchesService = (apt.services || []).some((s) => s.name?.toLowerCase().includes(term));
        if (!matchesClient && !matchesPhone && !matchesBarber && !matchesCode && !matchesService) {
          return false;
        }
      }

      // Filtro de estado de cita
      if (statusFilter !== 'todos' && apt.status !== statusFilter) {
        return false;
      }

      // Filtro de estado de pago de comisión
      if (commissionStatusFilter === 'pagada' && !apt.commissionPaid) {
        return false;
      }
      if (commissionStatusFilter === 'pendiente' && apt.commissionPaid) {
        return false;
      }

      return true;
    });
  }, [data.appointments, searchTerm, statusFilter, commissionStatusFilter]);

  // Handler para marcar una cita individual como pagada/pendiente
  const handleToggleAppointmentPayout = async (apt) => {
    try {
      const nextStatus = !apt.commissionPaid;
      await adminService.payoutAppointments({
        appointmentIds: [apt._id],
        markPaid: nextStatus,
      });

      toast.success(
        nextStatus
          ? 'Comisión marcada como liquidada/pagada'
          : 'Comisión reabierta como pendiente'
      );

      setData((prev) => ({
        ...prev,
        appointments: prev.appointments.map((a) =>
          a._id === apt._id
            ? { ...a, commissionPaid: nextStatus, commissionPaidAt: nextStatus ? new Date() : null }
            : a
        ),
      }));

      fetchData(false);
    } catch (error) {
      toast.error('Error al actualizar el estado de liquidación');
    }
  };

  // Abrir modal de liquidación total para un barbero
  const handleOpenPayoutModal = (barber) => {
    const pendingApts = (data.appointments || []).filter(
      (a) =>
        (a.barber?._id === barber.barberId || a.barber?._id === barber.userId) &&
        a.status === 'completada' &&
        !a.commissionPaid
    );

    const totalToPay = pendingApts.reduce((sum, a) => sum + (a.barberCut || 0), 0);

    setPayoutModal({
      isOpen: true,
      barber,
      pendingAppointments: pendingApts,
      totalPayout: totalToPay,
    });
  };

  // Confirmar liquidación total del barbero
  const handleConfirmBarberPayout = async () => {
    if (!payoutModal.pendingAppointments.length) {
      toast.error('No hay citas pendientes de liquidar para este barbero.');
      setPayoutModal({ isOpen: false, barber: null, pendingAppointments: [], totalPayout: 0 });
      return;
    }

    setSubmittingPayout(true);
    try {
      const ids = payoutModal.pendingAppointments.map((a) => a._id);
      await adminService.payoutAppointments({
        appointmentIds: ids,
        markPaid: true,
      });

      toast.success(`Nómina de ${payoutModal.barber.name} liquidada exitosamente`);
      setPayoutModal({ isOpen: false, barber: null, pendingAppointments: [], totalPayout: 0 });
      fetchData(false);
    } catch (error) {
      toast.error('Error al liquidar nómina del barbero');
    } finally {
      setSubmittingPayout(false);
    }
  };

  // Guardar nuevo porcentaje de comisión
  const handleSaveCommissionRate = async () => {
    const rate = Number(commissionModal.newRate);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      toast.error('La comisión debe ser un número entre 0 y 100');
      return;
    }

    setSubmittingCommission(true);
    try {
      await adminService.updateBarberCommission(commissionModal.barber.barberId, rate);
      toast.success(`Comisión de ${commissionModal.barber.name} actualizada al ${rate}%`);
      setCommissionModal({ isOpen: false, barber: null, newRate: 50 });
      fetchData(false);
    } catch (error) {
      toast.error('Error al actualizar porcentaje de comisión');
    } finally {
      setSubmittingCommission(false);
    }
  };



  // ==========================================
  // EXPORTAR A PDF (.pdf)
  // ==========================================
  const handleExportPdf = () => {
    setExportingPdf(true);
    try {
      const rangeText = data.summary.rangeLabel || period;

      const payrollColumns = [
        'BARBERO',
        'TELÉFONO',
        '% COMISIÓN',
        'CORTES',
        'TOTAL FACTURADO',
        'NÓMINA TOTAL',
        'PAGADO',
        'PENDIENTE',
      ];

      const payrollRows = (data.barbersPayroll || []).map((b) => [
        b.name,
        b.phone || 'N/A',
        `${b.commissionRate}%`,
        String(b.totalCuts),
        formatCurrency(b.grossRevenue),
        formatCurrency(b.commissionAmount),
        formatCurrency(b.paidCommission),
        formatCurrency(b.pendingCommission),
      ]);

      const serviceColumns = [
        'CÓDIGO',
        'FECHA / HORA',
        'BARBERO',
        'CLIENTE',
        'SERVICIOS',
        'MÉTODO',
        'TOTAL',
        'NÓMINA',
        'ESTADO PAGO',
      ];

      const serviceRows = (data.appointments || []).slice(0, 50).map((a) => [
        a.confirmationCode,
        `${new Date(a.date).toLocaleDateString('es-CO')} ${formatTime(a.startTime)}`,
        a.barber?.name || 'N/A',
        a.client?.name || 'Cliente',
        (a.services || []).map((s) => s.name).join(' + '),
        (a.paymentMethod || 'Efectivo').toUpperCase(),
        formatCurrency(a.totalPrice),
        formatCurrency(a.barberCut),
        a.commissionPaid ? 'PAGADO' : 'PENDIENTE',
      ]);

      exportToPdf({
        title: 'REPORTE EJECUTIVO DE NÓMINA Y SERVICIOS',
        subtitle: 'Triadix Barber Studio · Control de Pagos y Liquidaciones',
        periodLabel: rangeText,
        summary: data.summary,
        tables: [
          {
            title: 'Liquidación de Nómina por Trabajador',
            columns: payrollColumns,
            rows: payrollRows,
          },
          {
            title: 'Detalle de Servicios Prestados Recientemente',
            columns: serviceColumns,
            rows: serviceRows,
          },
        ],
        fileName: `Reporte_Nomina_Triadix_${new Date().toISOString().slice(0, 10)}`,
      });

      toast.success('Reporte PDF oficial generado exitosamente');
    } catch (error) {
      toast.error('Error al generar PDF');
    } finally {
      setExportingPdf(false);
    }
  };

  // Exportar desprendible individual de un barbero en PDF
  const handleExportSingleBarberPdf = (b) => {
    try {
      const barberApts = (data.appointments || []).filter(
        (a) => a.barber?._id === b.barberId || a.barber?._id === b.userId
      );

      const columns = ['CÓDIGO', 'FECHA', 'HORA', 'CLIENTE', 'SERVICIOS', 'TOTAL SERVICIO', 'COMISIÓN GANADA', 'ESTADO'];
      const rows = barberApts.map((a) => [
        a.confirmationCode,
        new Date(a.date).toLocaleDateString('es-CO'),
        formatTime(a.startTime),
        a.client?.name || 'Cliente',
        (a.services || []).map((s) => s.name).join(', '),
        formatCurrency(a.totalPrice),
        formatCurrency(a.barberCut),
        a.commissionPaid ? 'LIQUIDADO' : 'PENDIENTE',
      ]);

      exportToPdf({
        title: `COMPROBANTE DE NÓMINA · ${b.name.toUpperCase()}`,
        subtitle: `Comisión Pactada: ${b.commissionRate}% | Cortes Realizados: ${b.totalCuts}`,
        periodLabel: data.summary.rangeLabel || period,
        summary: {
          grossRevenue: b.grossRevenue,
          totalBarbersPayout: b.commissionAmount,
          netBarbershopEarnings: b.barbershopShare,
          totalPaidPayout: b.paidCommission,
          totalPendingPayout: b.pendingCommission,
          completedCuts: b.totalCuts,
        },
        tables: [
          {
            title: `Detalle de Servicios Realizados por ${b.name}`,
            columns,
            rows,
          },
        ],
        fileName: `Desprendible_${b.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}`,
      });

      toast.success(`Desprendible de ${b.name} descargado en PDF`);
    } catch (error) {
      toast.error('Error al exportar desprendible');
    }
  };

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto space-y-8 pb-16">
        {/* HEADER PRINCIPAL — Depot Style */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#2b292d]">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#71d083] shadow-[0_0_8px_#71d083]"></span>
              <span className="text-[11px] font-mono uppercase tracking-[0.025em] text-[#71d083]">
                ADMINISTRACIÓN & CONTABILIDAD
              </span>
              <span className="text-[10px] text-[#7c7a85] font-mono uppercase">
                · Triadix Terminal
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-sans font-semibold tracking-[-0.025em] text-[#e5e5e5]">
              Nómina & <span className="text-[#71d083]">Estadísticas</span>
            </h1>
            <p className="text-[#7c7a85] text-xs sm:text-sm font-sans mt-1">
              Control de pagos a trabajadores, comisiones, liquidaciones y balance de servicios prestados.
            </p>
          </div>

          {/* BOTONES DE EXPORTACIÓN Y ACCIÓN (SIN EXCEL) */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing || loading}
              className="btn-depot-outline !py-2.5 !px-3.5"
              title="Refrescar datos"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin text-[#71d083]' : ''} />
              <span className="hidden sm:inline font-sans uppercase tracking-[0.025em] text-[11px]">Actualizar</span>
            </button>

            <button
              onClick={handleExportPdf}
              disabled={exportingPdf || loading}
              className="btn-depot-primary"
            >
              <FileText size={14} />
              <span>Descargar Reporte PDF</span>
            </button>
          </div>
        </div>

        {/* SELECTOR DE PERÍODOS Y FILTROS RÁPIDOS */}
        <div className="bg-[#121113] border border-[#2b292d] p-4 rounded-[6px] space-y-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] uppercase font-sans tracking-[0.025em] text-[#7c7a85] mr-2 flex items-center gap-1.5">
                <Calendar size={13} className="text-[#71d083]" /> Período:
              </span>
              {PERIOD_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setPeriod(opt.id)}
                  className={`px-3 py-1.5 text-xs font-sans uppercase tracking-[0.025em] rounded-[6px] border transition-all cursor-pointer ${
                    period === opt.id
                      ? 'bg-[#1a191b] text-[#71d083] border-[#2d5736] font-medium shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]'
                      : 'bg-[#1a191b]/40 text-[#7c7a85] border-[#2b292d] hover:border-[#3c393f] hover:text-[#eeeef0]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Selector de barbero para filtrar todo */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase font-sans tracking-[0.025em] text-[#7c7a85]">
                Barbero:
              </span>
              <select
                value={barberFilter}
                onChange={(e) => setBarberFilter(e.target.value)}
                className="py-1.5 px-3 text-xs bg-[#1a191b] border border-[#2b292d] text-[#eeeef0] rounded-[6px] font-sans focus:outline-none focus:border-[#71d083]/70"
              >
                <option value="all">Todos los Barberos</option>
                {data.barbersPayroll.map((b) => (
                  <option key={b.barberId} value={b.barberId}>
                    {b.name} ({b.commissionRate}%)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Selector de fechas personalizado si aplica */}
          {period === 'custom' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="pt-3 border-t border-[#2b292d] flex flex-wrap items-center gap-4"
            >
              <div className="flex items-center gap-2">
                <label className="text-xs text-[#7c7a85] uppercase font-mono">Desde:</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="bg-[#1a191b] border border-[#2b292d] text-[#eeeef0] py-1 px-2.5 text-xs rounded-[6px] font-mono focus:outline-none focus:border-[#71d083]/70"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-[#7c7a85] uppercase font-mono">Hasta:</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="bg-[#1a191b] border border-[#2b292d] text-[#eeeef0] py-1 px-2.5 text-xs rounded-[6px] font-mono focus:outline-none focus:border-[#71d083]/70"
                />
              </div>
              <button
                onClick={() => fetchData(false)}
                className="btn-depot-primary !py-1.5 !px-4"
              >
                Aplicar Rango
              </button>
            </motion.div>
          )}
        </div>

        {/* TABS DE NAVEGACIÓN — Depot Style */}
        <div className="flex border-b border-[#2b292d] gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('stats')}
            className={`py-3 px-5 font-sans font-medium text-xs uppercase tracking-[0.025em] transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'stats'
                ? 'text-[#71d083] border-[#71d083] -mb-[1px] bg-[#1a191b] rounded-t-[6px] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]'
                : 'text-[#7c7a85] border-transparent hover:text-[#eeeef0]'
            }`}
          >
            <TrendingUp size={14} />
            <span>Estadísticas & Balance</span>
          </button>

          <button
            onClick={() => setActiveTab('payroll')}
            className={`py-3 px-5 font-sans font-medium text-xs uppercase tracking-[0.025em] transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'payroll'
                ? 'text-[#71d083] border-[#71d083] -mb-[1px] bg-[#1a191b] rounded-t-[6px] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]'
                : 'text-[#7c7a85] border-transparent hover:text-[#eeeef0]'
            }`}
          >
            <DollarSign size={15} />
            <span>Nómina y Pagos a Barberos</span>
            {data.summary.totalPendingPayout > 0 && (
              <span className="ml-1.5 tag-depot-danger">
                Por liquidar
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`py-3 px-5 font-sans font-medium text-xs uppercase tracking-[0.025em] transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'services'
                ? 'text-[#71d083] border-[#71d083] -mb-[1px] bg-[#1a191b] rounded-t-[6px] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]'
                : 'text-[#7c7a85] border-transparent hover:text-[#eeeef0]'
            }`}
          >
            <Receipt size={14} />
            <span>Servicios Recolectados ({filteredAppointments.length})</span>
          </button>
        </div>

        {/* CONTENIDO DE CADA TAB */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <div className="w-8 h-8 border-2 border-[#71d083] border-t-transparent rounded-full animate-spin" />
            <p className="text-[#7c7a85] font-mono text-xs uppercase tracking-[0.025em]">
              Calculando nómina y consolidados contables...
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {/* TAB 1: ESTADÍSTICAS Y BALANCE GENERAL */}
            {activeTab === 'stats' && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-8"
              >
                {/* TARJETAS DE KPIS PRINCIPALES */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Ingresos Brutos */}
                  <div className="bg-[#121113] border border-[#2b292d] hover:border-[#3c393f] rounded-[6px] p-5 transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-9 h-9 bg-[#1a191b] border border-[#2b292d] text-[#71d083] rounded-[6px] flex items-center justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
                        <DollarSign size={16} />
                      </div>
                      <span className="tag-depot-green">
                        Total Facturado
                      </span>
                    </div>
                    <p className="text-[11px] uppercase font-sans tracking-[0.025em] text-[#7c7a85] mb-1">
                      Ingresos Brutos
                    </p>
                    <p className="text-2xl sm:text-3xl font-mono font-medium text-[#e5e5e5] tracking-tight">
                      {formatCurrency(data.summary.grossRevenue)}
                    </p>
                    <div className="mt-3 pt-2.5 border-t border-[#2b292d] text-xs text-[#7c7a85] flex justify-between font-sans">
                      <span>Cortes Realizados:</span>
                      <span className="text-[#e5e5e5] font-mono font-medium">{data.summary.completedCuts || 0}</span>
                    </div>
                  </div>

                  {/* Nómina a Pagar */}
                  <div className="bg-[#121113] border border-[#2b292d] hover:border-[#3c393f] rounded-[6px] p-5 transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-9 h-9 bg-[#1a191b] border border-[#2b292d] text-[#71d083] rounded-[6px] flex items-center justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
                        <Users size={16} />
                      </div>
                      <span className="tag-depot-green">
                        Comisiones
                      </span>
                    </div>
                    <p className="text-[11px] uppercase font-sans tracking-[0.025em] text-[#7c7a85] mb-1">
                      Nómina Trabajadores
                    </p>
                    <p className="text-2xl sm:text-3xl font-mono font-medium text-[#71d083] tracking-tight">
                      {formatCurrency(data.summary.totalBarbersPayout)}
                    </p>
                    <div className="mt-3 pt-2.5 border-t border-[#2b292d] text-xs text-[#7c7a85] flex justify-between font-sans">
                      <span>Pendiente por pagar:</span>
                      <span className="text-rose-400 font-mono font-medium">
                        {formatCurrency(data.summary.totalPendingPayout)}
                      </span>
                    </div>
                  </div>

                  {/* Ganancia Neta */}
                  <div className="bg-[#121113] border border-[#2b292d] hover:border-[#3c393f] rounded-[6px] p-5 transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-9 h-9 bg-[#1a191b] border border-[#2b292d] text-[#70b8ff] rounded-[6px] flex items-center justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
                        <TrendingUp size={16} />
                      </div>
                      <span className="tag-depot-blue">
                        Utilidad Neta
                      </span>
                    </div>
                    <p className="text-[11px] uppercase font-sans tracking-[0.025em] text-[#7c7a85] mb-1">
                      Ganancia Triadix
                    </p>
                    <p className="text-2xl sm:text-3xl font-mono font-medium text-[#e5e5e5] tracking-tight">
                      {formatCurrency(data.summary.netBarbershopEarnings)}
                    </p>
                    <div className="mt-3 pt-2.5 border-t border-[#2b292d] text-xs text-[#7c7a85] flex justify-between font-sans">
                      <span>Ticket Promedio:</span>
                      <span className="text-[#e5e5e5] font-mono font-medium">
                        {formatCurrency(data.summary.averageTicket)}
                      </span>
                    </div>
                  </div>

                  {/* Clientes & Equipo */}
                  <div className="bg-[#121113] border border-[#2b292d] hover:border-[#3c393f] rounded-[6px] p-5 transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-9 h-9 bg-[#1a191b] border border-[#2b292d] text-[#baa7ff] rounded-[6px] flex items-center justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
                        <ShieldCheck size={16} />
                      </div>
                      <span className="tag-depot-lilac">
                        Equipo
                      </span>
                    </div>
                    <p className="text-[11px] uppercase font-sans tracking-[0.025em] text-[#7c7a85] mb-1">
                      Clientes Atendidos
                    </p>
                    <p className="text-2xl sm:text-3xl font-mono font-medium text-[#e5e5e5] tracking-tight">
                      {data.summary.uniqueClients || 0}
                    </p>
                    <div className="mt-3 pt-2.5 border-t border-[#2b292d] text-xs text-[#7c7a85] flex justify-between font-sans">
                      <span>Barberos Activos:</span>
                      <span className="text-[#71d083] font-mono font-medium">
                        {data.summary.activeBarbersCount || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* FILA DE DESGLOSES: MÉTODOS DE PAGO Y TOP SERVICIOS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Desglose de Métodos de Pago */}
                  <div className="bg-[#121113] border border-[#2b292d] rounded-[6px] p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                    <h3 className="font-sans font-medium uppercase tracking-[-0.025em] text-xs sm:text-sm text-[#e5e5e5] mb-4 flex items-center gap-2 border-b border-[#2b292d] pb-3">
                      <CreditCard size={15} className="text-[#71d083]" />
                      Recaudación por Método de Pago
                    </h3>

                    <div className="space-y-4">
                      {Object.entries(data.paymentMethods || {}).map(([key, item]) => {
                        const totalGross = data.summary.grossRevenue || 1;
                        const percentage = Math.round(((item.total || 0) / totalGross) * 100);

                        return (
                          <div key={key} className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs">
                              <span className="uppercase font-sans tracking-[0.025em] text-[#b5b2bc]">
                                {key} ({item.count} pagos)
                              </span>
                              <div className="text-right">
                                <span className="font-mono font-medium text-[#e5e5e5] mr-2">
                                  {formatCurrency(item.total)}
                                </span>
                                <span className="text-[11px] text-[#7c7a85] font-mono">({percentage}%)</span>
                              </div>
                            </div>
                            <div className="w-full h-1.5 bg-[#1a191b] rounded-[2px] overflow-hidden border border-[#2b292d]">
                              <div
                                className="h-full bg-[#71d083] transition-all duration-500 rounded-[2px]"
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Servicios Más Solicitados */}
                  <div className="bg-[#121113] border border-[#2b292d] rounded-[6px] p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                    <h3 className="font-sans font-medium uppercase tracking-[-0.025em] text-xs sm:text-sm text-[#e5e5e5] mb-4 flex items-center gap-2 border-b border-[#2b292d] pb-3">
                      <Sparkles size={15} className="text-[#71d083]" />
                      Servicios Más Solicitados
                    </h3>

                    {data.servicesBreakdown.length === 0 ? (
                      <p className="text-xs text-[#7c7a85] py-8 text-center font-sans">
                        No hay servicios completados en este período.
                      </p>
                    ) : (
                      <div className="divide-y divide-[#2b292d]/60 space-y-2">
                        {data.servicesBreakdown.slice(0, 5).map((srv, idx) => (
                          <div key={idx} className="pt-2.5 flex items-center justify-between">
                            <div>
                              <p className="text-xs font-sans font-medium text-[#eeeef0]">{srv.name}</p>
                              <span className="text-[11px] text-[#7c7a85] font-mono">
                                Realizado {srv.count} veces
                              </span>
                            </div>
                            <span className="font-mono text-xs font-medium text-[#71d083]">
                              {formatCurrency(srv.totalRevenue)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: NÓMINA Y CONTROL DE PAGOS A TRABAJADORES */}
            {activeTab === 'payroll' && (
              <motion.div
                key="payroll"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-sans font-medium uppercase tracking-[-0.025em] text-[#e5e5e5]">
                      Liquidación de Nómina del Equipo
                    </h3>
                    <p className="text-xs text-[#7c7a85] font-sans mt-0.5">
                      Comisiones calculadas según los cortes finalizados en el período seleccionado.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#7c7a85] font-sans">
                      Total a liquidar: <strong className="text-rose-400 font-mono font-medium">{formatCurrency(data.summary.totalPendingPayout)}</strong>
                    </span>
                  </div>
                </div>

                {/* TARJETAS DE CADA BARBERO */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.barbersPayroll.map((barber) => {
                    const hasPending = barber.pendingCommission > 0;

                    return (
                      <div
                        key={barber.barberId}
                        className={`bg-[#121113] border rounded-[6px] p-6 flex flex-col justify-between transition-all duration-200 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] ${
                          hasPending ? 'border-[#2d5736] hover:border-[#71d083]/50' : 'border-[#2b292d] hover:border-[#3c393f]'
                        }`}
                      >
                        <div>
                          {/* Barber Header */}
                          <div className="flex items-start justify-between gap-3 mb-4 pb-4 border-b border-[#2b292d]">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-[6px] bg-[#1a191b] border border-[#2b292d] flex items-center justify-center font-mono font-medium text-[#71d083] text-base shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
                                {barber.name.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-sans font-medium text-sm text-[#e5e5e5] leading-tight tracking-[-0.025em]">
                                  {barber.name}
                                </h4>
                                <p className="text-xs text-[#7c7a85] font-mono mt-0.5">{barber.phone || barber.email}</p>
                              </div>
                            </div>

                            {/* Badge de comisión editable */}
                            <button
                              onClick={() =>
                                setCommissionModal({
                                  isOpen: true,
                                  barber,
                                  newRate: barber.commissionRate,
                                })
                              }
                              className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.025em] bg-[#1a191b] hover:bg-[#232225] text-[#71d083] border border-[#2d5736] rounded-[4px] transition-all cursor-pointer flex items-center gap-1"
                              title="Modificar % de comisión"
                            >
                              <Percent size={10} />
                              <span>{barber.commissionRate}%</span>
                              <Edit2 size={9} className="opacity-60" />
                            </button>
                          </div>

                          {/* Métricas de Nómina del Barbero */}
                          <div className="space-y-2.5 text-xs font-sans mb-6">
                            <div className="flex justify-between text-[#b5b2bc]">
                              <span className="text-[#7c7a85]">Cortes Realizados:</span>
                              <span className="font-medium text-[#e5e5e5] font-mono">{barber.totalCuts}</span>
                            </div>
                            <div className="flex justify-between text-[#b5b2bc]">
                              <span className="text-[#7c7a85]">Total Facturado:</span>
                              <span className="font-mono font-medium text-[#e5e5e5]">
                                {formatCurrency(barber.grossRevenue)}
                              </span>
                            </div>
                            <div className="flex justify-between text-[#b5b2bc]">
                              <span className="text-[#7c7a85]">Ganancia Triadix:</span>
                              <span className="font-mono text-[#7c7a85]">
                                {formatCurrency(barber.barbershopShare)}
                              </span>
                            </div>

                            <div className="pt-2.5 border-t border-[#2b292d] flex justify-between items-baseline">
                              <span className="font-sans text-[11px] uppercase tracking-[0.025em] text-[#7c7a85]">
                                Nómina Barbero:
                              </span>
                              <span className="font-mono text-base font-medium text-[#71d083]">
                                {formatCurrency(barber.commissionAmount)}
                              </span>
                            </div>

                            <div className="flex justify-between items-center text-[11px] pt-1">
                              <span className="text-[#71d083] flex items-center gap-1 font-mono">
                                <CheckCircle2 size={12} /> Pagado: {formatCurrency(barber.paidCommission)}
                              </span>
                              <span className="text-rose-400 flex items-center gap-1 font-mono font-medium">
                                <Clock size={12} /> Pendiente: {formatCurrency(barber.pendingCommission)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Botones de Acción */}
                        <div className="space-y-2 pt-4 border-t border-[#2b292d]">
                          {hasPending ? (
                            <button
                              onClick={() => handleOpenPayoutModal(barber)}
                              className="w-full btn-depot-primary !text-xs !py-2.5"
                            >
                              <DollarSign size={13} />
                              <span>Liquidar Nómina ({formatCurrency(barber.pendingCommission)})</span>
                            </button>
                          ) : (
                            <div className="w-full py-2 px-3 bg-[#1b2a1e] border border-[#2d5736] text-[#71d083] text-xs font-mono text-center rounded-[6px] flex items-center justify-center gap-1.5">
                              <CheckCircle2 size={13} />
                              <span>Al día · Sin saldos pendientes</span>
                            </div>
                          )}

                          <button
                            onClick={() => handleExportSingleBarberPdf(barber)}
                            className="w-full btn-depot-outline !text-xs !py-2"
                          >
                            <FileText size={13} />
                            <span>Descargar Desprendible PDF</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* TAB 3: SERVICIOS Y CITAS RECOLECTADAS */}
            {activeTab === 'services' && (
              <motion.div
                key="services"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-4"
              >
                {/* BARRA DE BÚSQUEDA Y FILTROS */}
                <div className="bg-[#121113] border border-[#2b292d] p-4 rounded-[6px] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                  {/* Buscador */}
                  <div className="relative flex-1">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7c7a85]" />
                    <input
                      type="text"
                      placeholder="Buscar por cliente, teléfono, barbero, código o servicio..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-[#1a191b] border border-[#2b292d] text-[#eeeef0] pl-9 pr-4 py-2 w-full text-xs rounded-[6px] font-sans focus:outline-none focus:border-[#71d083]/70 placeholder:text-[#7c7a85]"
                    />
                  </div>

                  {/* Filtro Estado Cita */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] uppercase font-sans tracking-[0.025em] text-[#7c7a85]">Estado:</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="py-1.5 px-3 text-xs bg-[#1a191b] border border-[#2b292d] text-[#eeeef0] rounded-[6px] font-sans focus:outline-none focus:border-[#71d083]/70"
                    >
                      <option value="todos">Todos los Estados</option>
                      <option value="completada">Completada</option>
                      <option value="confirmada">Confirmada</option>
                      <option value="pendiente">Pendiente</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                  </div>

                  {/* Filtro Liquidación */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] uppercase font-sans tracking-[0.025em] text-[#7c7a85]">Nómina:</span>
                    <select
                      value={commissionStatusFilter}
                      onChange={(e) => setCommissionStatusFilter(e.target.value)}
                      className="py-1.5 px-3 text-xs bg-[#1a191b] border border-[#2b292d] text-[#eeeef0] rounded-[6px] font-sans focus:outline-none focus:border-[#71d083]/70"
                    >
                      <option value="todos">Todos los Pagos</option>
                      <option value="pendiente">Comisión Pendiente</option>
                      <option value="pagada">Comisión Liquidada</option>
                    </select>
                  </div>
                </div>

                {/* TABLA DE CITAS */}
                <div className="bg-[#121113] border border-[#2b292d] rounded-[6px] overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans">
                      <thead className="bg-[#1a191b] border-b border-[#2b292d] text-[#7c7a85] font-sans uppercase tracking-[0.025em] text-[10px]">
                        <tr>
                          <th className="py-3 px-4">CÓDIGO / FECHA</th>
                          <th className="py-3 px-4">BARBERO</th>
                          <th className="py-3 px-4">CLIENTE</th>
                          <th className="py-3 px-4">SERVICIOS PRESTADOS</th>
                          <th className="py-3 px-4">PAGO / MÉTODO</th>
                          <th className="py-3 px-4 text-right">TOTAL</th>
                          <th className="py-3 px-4 text-right">NÓMINA BARBERO</th>
                          <th className="py-3 px-4 text-center">ESTADO CITA</th>
                          <th className="py-3 px-4 text-center">LIQUIDACIÓN</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#2b292d]/50">
                        {filteredAppointments.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="py-12 text-center text-[#7c7a85] font-sans">
                              No se encontraron servicios con los filtros aplicados.
                            </td>
                          </tr>
                        ) : (
                          filteredAppointments.map((apt) => (
                            <tr key={apt._id} className="hover:bg-[#1a191b]/50 transition-colors">
                              {/* Código y Fecha */}
                              <td className="py-3 px-4">
                                <span className="font-mono font-medium text-[#e5e5e5] block">
                                  {apt.confirmationCode}
                                </span>
                                <span className="text-[11px] text-[#7c7a85] font-mono">
                                  {new Date(apt.date).toLocaleDateString('es-CO')} · {formatTime(apt.startTime)}
                                </span>
                              </td>

                              {/* Barbero */}
                              <td className="py-3 px-4">
                                <span className="font-sans font-medium text-[#e5e5e5] block">
                                  {apt.barber?.name || 'Barbero'}
                                </span>
                                <span className="text-[10px] text-[#7c7a85] font-mono">
                                  Comisión: {apt.commissionRate}%
                                </span>
                              </td>

                              {/* Cliente */}
                              <td className="py-3 px-4">
                                <span className="font-sans font-medium text-[#e5e5e5] block">
                                  {apt.client?.name || 'Cliente'}
                                </span>
                                <span className="text-[11px] text-[#7c7a85] font-mono block">
                                  {apt.client?.phone || 'Sin tel'}
                                </span>
                              </td>

                              {/* Servicios */}
                              <td className="py-3 px-4 max-w-xs">
                                <div className="flex flex-wrap gap-1">
                                  {(apt.services || []).map((s, idx) => (
                                    <span
                                      key={idx}
                                      className="tag-depot-neutral !text-[9px]"
                                    >
                                      {s.name}
                                    </span>
                                  ))}
                                </div>
                              </td>

                              {/* Método de Pago */}
                              <td className="py-3 px-4">
                                <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-[#1a191b] border border-[#2b292d] text-[#b5b2bc] rounded-[2px]">
                                  {apt.paymentMethod || 'Efectivo'}
                                </span>
                              </td>

                              {/* Total Cobrado */}
                              <td className="py-3 px-4 text-right font-mono font-medium text-[#e5e5e5] text-xs">
                                {formatCurrency(apt.totalPrice)}
                              </td>

                              {/* Comisión / Nómina Barbero */}
                              <td className="py-3 px-4 text-right">
                                <span className="font-mono font-medium text-[#71d083] block text-xs">
                                  {formatCurrency(apt.barberCut)}
                                </span>
                                <span className="text-[10px] text-[#7c7a85] font-mono">
                                  Negocio: {formatCurrency(apt.barbershopCut)}
                                </span>
                              </td>

                              {/* Estado Cita */}
                              <td className="py-3 px-4 text-center">
                                <span
                                  className={
                                    apt.status === 'completada'
                                      ? 'tag-depot-green'
                                      : apt.status === 'cancelada'
                                      ? 'tag-depot-danger'
                                      : 'tag-depot-neutral'
                                  }
                                >
                                  {apt.status}
                                </span>
                              </td>

                              {/* Estado Liquidación y Botón Toggle */}
                              <td className="py-3 px-4 text-center">
                                {apt.status === 'completada' ? (
                                  <button
                                    onClick={() => handleToggleAppointmentPayout(apt)}
                                    className={`px-2.5 py-1 rounded-[4px] text-[10px] font-mono font-medium uppercase transition-all flex items-center justify-center gap-1 mx-auto border cursor-pointer ${
                                      apt.commissionPaid
                                        ? 'bg-[#1b2a1e] text-[#71d083] border-[#2d5736] hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30'
                                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-[#1b2a1e] hover:text-[#71d083] hover:border-[#2d5736]'
                                    }`}
                                    title="Haz clic para cambiar estado de liquidación"
                                  >
                                    {apt.commissionPaid ? (
                                      <>
                                        <CheckCircle2 size={11} />
                                        <span>Pagado</span>
                                      </>
                                    ) : (
                                      <>
                                        <Clock size={11} />
                                        <span>Pendiente</span>
                                      </>
                                    )}
                                  </button>
                                ) : (
                                  <span className="text-[#7c7a85] text-[10px] font-mono">N/A</span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* MODAL DE LIQUIDACIÓN DE NÓMINA A BARBERO */}
        <Modal
          isOpen={payoutModal.isOpen}
          onClose={() =>
            !submittingPayout &&
            setPayoutModal({ isOpen: false, barber: null, pendingAppointments: [], totalPayout: 0 })
          }
          title={`LIQUIDAR NÓMINA · ${payoutModal.barber?.name?.toUpperCase() || ''}`}
        >
          <div className="space-y-4">
            <p className="text-xs text-[#b5b2bc] font-sans leading-relaxed">
              Vas a registrar el pago de nómina para{' '}
              <strong className="text-[#e5e5e5]">{payoutModal.barber?.name}</strong> correspondiente a{' '}
              <strong className="text-[#71d083]">{payoutModal.pendingAppointments?.length} cortes completados</strong>.
            </p>

            <div className="bg-[#1a191b] border border-[#2b292d] p-5 rounded-[6px] text-center space-y-1 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
              <span className="text-[11px] uppercase font-sans tracking-[0.025em] text-[#7c7a85] block">
                Total a Transferir / Liquidar
              </span>
              <span className="text-3xl font-mono font-medium text-[#71d083] block">
                {formatCurrency(payoutModal.totalPayout)}
              </span>
              <span className="text-[11px] text-[#7c7a85] font-mono">
                Comisión acordada: {payoutModal.barber?.commissionRate}%
              </span>
            </div>

            <div className="flex gap-3 pt-2 border-t border-[#2b292d]">
              <button
                type="button"
                onClick={() =>
                  setPayoutModal({ isOpen: false, barber: null, pendingAppointments: [], totalPayout: 0 })
                }
                disabled={submittingPayout}
                className="btn-depot-outline flex-1"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmBarberPayout}
                disabled={submittingPayout}
                className="btn-depot-primary flex-1"
              >
                {submittingPayout ? (
                  <div className="w-4 h-4 border-2 border-[#04040b] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Check size={14} />
                    <span>Confirmar y Liquidar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </Modal>

        {/* MODAL DE EDICIÓN DE PORCENTAJE DE COMISIÓN */}
        <Modal
          isOpen={commissionModal.isOpen}
          onClose={() =>
            !submittingCommission &&
            setCommissionModal({ isOpen: false, barber: null, newRate: 50 })
          }
          title={`AJUSTAR COMISIÓN · ${commissionModal.barber?.name?.toUpperCase() || ''}`}
        >
          <div className="space-y-4">
            <p className="text-xs text-[#b5b2bc] font-sans leading-relaxed">
              Define el porcentaje de comisión que recibirá este barbero por cada corte o servicio realizado en Triadix.
            </p>

            <div>
              <label className="block text-[11px] font-sans uppercase tracking-[0.025em] text-[#b5b2bc] mb-1.5 font-medium">
                Porcentaje de Comisión (%)
              </label>
              <div className="relative">
                <Percent size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7c7a85]" />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={commissionModal.newRate}
                  onChange={(e) =>
                    setCommissionModal((prev) => ({ ...prev, newRate: e.target.value }))
                  }
                  className="input-depot pl-9 pr-4 font-mono text-sm"
                  placeholder="Ej: 50"
                  required
                />
              </div>
              <span className="text-[11px] text-[#7c7a85] font-sans mt-1.5 block">
                Por ejemplo: 50% significa que la mitad del cobro va para el barbero y la otra mitad para la barbería.
              </span>
            </div>

            <div className="flex gap-3 pt-2 border-t border-[#2b292d]">
              <button
                type="button"
                onClick={() =>
                  setCommissionModal({ isOpen: false, barber: null, newRate: 50 })
                }
                disabled={submittingCommission}
                className="btn-depot-outline flex-1"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveCommissionRate}
                disabled={submittingCommission}
                className="btn-depot-primary flex-1"
              >
                {submittingCommission ? (
                  <div className="w-4 h-4 border-2 border-[#04040b] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Check size={14} />
                    <span>Guardar Comisión</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </PageTransition>
  );
}
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  Users,
  Scissors,
  Calendar,
  Download,
  FileSpreadsheet,
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
import { exportToExcel, exportToPdf } from '../../utils/exportUtils';
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
  const [exportingExcel, setExportingExcel] = useState(false);
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

      // Actualizar localmente sin recargar toda la página
      setData((prev) => ({
        ...prev,
        appointments: prev.appointments.map((a) =>
          a._id === apt._id
            ? { ...a, commissionPaid: nextStatus, commissionPaidAt: nextStatus ? new Date() : null }
            : a
        ),
      }));

      // Refrescar totales en segundo plano
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

      toast.success(`¡Nómina de ${payoutModal.barber.name} liquidada exitosamente! 💵`);
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
  // EXPORTAR A EXCEL (.xlsx)
  // ==========================================
  const handleExportExcel = () => {
    setExportingExcel(true);
    try {
      const rangeText = data.summary.rangeLabel || period;

      // Hoja 1: Resumen General
      const summarySheetData = [
        { Concepto: 'Período Contable', Valor: rangeText },
        { Concepto: 'Total Citas Registradas', Valor: data.summary.totalAppointments || 0 },
        { Concepto: 'Cortes Completados', Valor: data.summary.completedCuts || 0 },
        { Concepto: 'Citas Pendientes / En Progreso', Valor: data.summary.pendingCuts || 0 },
        { Concepto: 'Citas Canceladas', Valor: data.summary.cancelledCuts || 0 },
        { Concepto: 'Clientes Únicos Atendidos', Valor: data.summary.uniqueClients || 0 },
        { Concepto: 'Ticket Promedio por Corte', Valor: formatCurrency(data.summary.averageTicket) },
        { Concepto: 'Ingresos Brutos Facturados', Valor: formatCurrency(data.summary.grossRevenue) },
        { Concepto: 'Total Nómina Barberos (Comisiones)', Valor: formatCurrency(data.summary.totalBarbersPayout) },
        { Concepto: 'Ganancia Neta Steel House', Valor: formatCurrency(data.summary.netBarbershopEarnings) },
        { Concepto: 'Nómina Ya Pagada / Liquidada', Valor: formatCurrency(data.summary.totalPaidPayout) },
        { Concepto: 'Nómina Pendiente de Pago', Valor: formatCurrency(data.summary.totalPendingPayout) },
      ];

      // Hoja 2: Nómina por Barbero
      const payrollSheetData = (data.barbersPayroll || []).map((b) => ({
        Barbero: b.name,
        Teléfono: b.phone || 'N/A',
        Correo: b.email || 'N/A',
        '% Comisión': `${b.commissionRate}%`,
        'Cortes Realizados': b.totalCuts,
        'Ingresos Generados': b.grossRevenue,
        'Nómina a Pagar (Comisión)': b.commissionAmount,
        'Ganancia Barbería': b.barbershopShare,
        'Monto Ya Pagado': b.paidCommission,
        'Saldo Pendiente': b.pendingCommission,
        Estado: b.pendingCommission === 0 ? 'AL DÍA' : 'PENDIENTE DE PAGO',
      }));

      // Hoja 3: Detalle de Citas y Servicios Recolectados
      const appointmentsSheetData = (data.appointments || []).map((a) => ({
        'Código Cita': a.confirmationCode,
        Fecha: new Date(a.date).toLocaleDateString('es-CO'),
        Hora: formatTime(a.startTime),
        Barbero: a.barber?.name || 'N/A',
        Cliente: a.client?.name || 'Cliente',
        'Teléfono Cliente': a.client?.phone || 'N/A',
        'Dirección Cliente': a.client?.address || 'N/A',
        'Servicios Prestados': (a.services || []).map((s) => s.name).join(', '),
        'Método de Pago': a.paymentMethod?.toUpperCase() || 'EFECTIVO',
        'Total Cobrado': a.totalPrice || 0,
        '% Comisión': `${a.commissionRate}%`,
        'Pago Barbero (Nómina)': a.barberCut || 0,
        'Ganancia Barbería': a.barbershopCut || 0,
        'Estado Cita': a.status?.toUpperCase() || 'PENDIENTE',
        'Liquidación Comisión': a.commissionPaid ? 'PAGADO' : 'PENDIENTE',
        'Fecha Liquidación': a.commissionPaidAt
          ? new Date(a.commissionPaidAt).toLocaleDateString('es-CO')
          : 'NO APLICA',
      }));

      exportToExcel(
        [
          { sheetName: 'Resumen General', data: summarySheetData },
          { sheetName: 'Nómina de Barberos', data: payrollSheetData },
          { sheetName: 'Detalle de Servicios', data: appointmentsSheetData },
        ],
        `Nomina_SteelHouse_${new Date().toISOString().slice(0, 10)}`
      );

      toast.success('¡Archivo Excel (.xlsx) generado y descargado! 📊');
    } catch (error) {
      toast.error('Error al generar archivo Excel');
    } finally {
      setExportingExcel(false);
    }
  };

  // ==========================================
  // EXPORTAR A PDF (.pdf)
  // ==========================================
  const handleExportPdf = () => {
    setExportingPdf(true);
    try {
      const rangeText = data.summary.rangeLabel || period;

      // Tabla 1: Nómina por Barbero
      const payrollColumns = [
        'BARBERO',
        'TELÉFONO',
        '% COMISIÓN',
        'CORTES',
        'FACTURADO',
        'A PAGAR NÓMINA',
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

      // Tabla 2: Servicios Recolectados
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
        subtitle: 'Steel House Barbería · Control de Pagos y Liquidaciones',
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
        fileName: `Reporte_Nomina_SteelHouse_${new Date().toISOString().slice(0, 10)}`,
      });

      toast.success('¡Reporte PDF oficial generado exitosamente! 📄');
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
        {/* HEADER PRINCIPAL */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b-2 border-[#333]">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="brutal-badge border-gold-500 text-gold-400 bg-black">
                ADMINISTRACIÓN & CONTABILIDAD
              </span>
              <span className="text-xs text-gray-400 font-mono">
                Steel House Barbería
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold uppercase tracking-wider text-white">
              NÓMINA & <span className="text-gold-500">ESTADÍSTICAS</span>
            </h1>
            <p className="text-gray-400 text-sm font-sans mt-1">
              Control de pagos a trabajadores, comisiones, liquidaciones y balance de servicios prestados.
            </p>
          </div>

          {/* BOTONES DE EXPORTACIÓN Y ACCIÓN */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing || loading}
              className="brutal-btn-outline p-3 flex items-center gap-2 text-xs"
              title="Refrescar datos"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin text-gold-500' : ''} />
              <span className="hidden sm:inline">Actualizar</span>
            </button>

            <button
              onClick={handleExportExcel}
              disabled={exportingExcel || loading}
              className="px-4 py-3 bg-[#107c41] hover:bg-[#0d6535] text-white border-2 border-black font-bold uppercase text-xs tracking-wider flex items-center gap-2 shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              <FileSpreadsheet size={16} />
              <span>Descargar Excel</span>
            </button>

            <button
              onClick={handleExportPdf}
              disabled={exportingPdf || loading}
              className="px-4 py-3 bg-gold-500 hover:bg-gold-400 text-black border-2 border-black font-bold uppercase text-xs tracking-wider flex items-center gap-2 shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              <FileText size={16} />
              <span>Descargar PDF</span>
            </button>
          </div>
        </div>

        {/* SELECTOR DE PERÍODOS Y FILTROS RÁPIDOS */}
        <div className="bg-[#111111] border-2 border-[#333] p-4 rounded-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase font-mono font-bold text-gray-400 mr-2 flex items-center gap-1.5">
                <Calendar size={15} className="text-gold-500" /> Período:
              </span>
              {PERIOD_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setPeriod(opt.id)}
                  className={`px-3 py-1.5 text-xs font-bold uppercase border-2 transition-all ${
                    period === opt.id
                      ? 'bg-gold-500 text-black border-gold-500 shadow-brutal-gold-sm'
                      : 'bg-[#1a1a1a] text-gray-300 border-[#333] hover:border-gold-500/50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Selector de barbero para filtrar todo */}
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono font-bold text-gray-400">
                Barbero:
              </span>
              <select
                value={barberFilter}
                onChange={(e) => setBarberFilter(e.target.value)}
                className="brutal-input py-1.5 px-3 text-xs bg-[#1a1a1a] font-sans"
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
              className="pt-3 border-t border-[#333] flex flex-wrap items-center gap-4"
            >
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-400 uppercase font-mono">Desde:</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="brutal-input py-1 px-2 text-xs"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-400 uppercase font-mono">Hasta:</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="brutal-input py-1 px-2 text-xs"
                />
              </div>
              <button
                onClick={() => fetchData(false)}
                className="brutal-btn-primary py-1 px-4 text-xs"
              >
                Aplicar Rango
              </button>
            </motion.div>
          )}
        </div>

        {/* TABS DE NAVEGACIÓN */}
        <div className="flex border-b-2 border-[#333] gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('stats')}
            className={`py-3.5 px-6 font-bold text-sm uppercase tracking-wider transition-all border-b-4 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'stats'
                ? 'text-gold-500 border-gold-500 -mb-[2px] bg-gold-500/5'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            <TrendingUp size={18} />
            <span>Estadísticas & Balance</span>
          </button>

          <button
            onClick={() => setActiveTab('payroll')}
            className={`py-3.5 px-6 font-bold text-sm uppercase tracking-wider transition-all border-b-4 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'payroll'
                ? 'text-gold-500 border-gold-500 -mb-[2px] bg-gold-500/5'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            <DollarSign size={18} />
            <span>Nómina y Pagos a Barberos</span>
            {data.summary.totalPendingPayout > 0 && (
              <span className="ml-1.5 px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] rounded-full font-mono">
                Por liquidar
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`py-3.5 px-6 font-bold text-sm uppercase tracking-wider transition-all border-b-4 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'services'
                ? 'text-gold-500 border-gold-500 -mb-[2px] bg-gold-500/5'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            <Receipt size={18} />
            <span>Servicios Recolectados ({filteredAppointments.length})</span>
          </button>
        </div>

        {/* CONTENIDO DE CADA TAB */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 font-mono text-xs uppercase tracking-widest">
              Calculando nómina y consolidados contables...
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {/* ======================================================== */}
            {/* TAB 1: ESTADÍSTICAS Y BALANCE GENERAL                     */}
            {/* ======================================================== */}
            {activeTab === 'stats' && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* TARJETAS DE KPIS PRINCIPALES */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Ingresos Brutos */}
                  <BrutalCard className="p-5 border-green-500/50 relative overflow-hidden bg-gradient-to-br from-[#121212] to-[#1a1a1a]">
                    <div className="flex justify-between items-start mb-3">
                      <div className="p-2.5 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg">
                        <DollarSign size={22} />
                      </div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-green-500/20 text-green-400 rounded border border-green-500/30 font-bold">
                        Total Facturado
                      </span>
                    </div>
                    <p className="text-xs uppercase font-mono text-gray-400 font-bold mb-1">
                      Ingresos Brutos
                    </p>
                    <p className="text-2xl sm:text-3xl font-mono-price font-bold text-white tracking-tight">
                      {formatCurrency(data.summary.grossRevenue)}
                    </p>
                    <div className="mt-3 pt-2 border-t border-white/10 text-xs text-gray-400 flex justify-between">
                      <span>Cortes Realizados:</span>
                      <span className="text-white font-mono font-bold">{data.summary.completedCuts || 0}</span>
                    </div>
                  </BrutalCard>

                  {/* Nómina a Pagar */}
                  <BrutalCard className="p-5 border-gold-500/50 relative overflow-hidden bg-gradient-to-br from-[#121212] to-[#1a1a1a]">
                    <div className="flex justify-between items-start mb-3">
                      <div className="p-2.5 bg-gold-500/10 border border-gold-500/30 text-gold-400 rounded-lg">
                        <Users size={22} />
                      </div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-gold-500/20 text-gold-400 rounded border border-gold-500/30 font-bold">
                        Comisiones
                      </span>
                    </div>
                    <p className="text-xs uppercase font-mono text-gray-400 font-bold mb-1">
                      Nómina Trabajadores
                    </p>
                    <p className="text-2xl sm:text-3xl font-mono-price font-bold text-gold-400 tracking-tight">
                      {formatCurrency(data.summary.totalBarbersPayout)}
                    </p>
                    <div className="mt-3 pt-2 border-t border-white/10 text-xs text-gray-400 flex justify-between">
                      <span>Pendiente por pagar:</span>
                      <span className="text-red-400 font-mono font-bold">
                        {formatCurrency(data.summary.totalPendingPayout)}
                      </span>
                    </div>
                  </BrutalCard>

                  {/* Ganancia Neta */}
                  <BrutalCard className="p-5 border-blue-500/50 relative overflow-hidden bg-gradient-to-br from-[#121212] to-[#1a1a1a]">
                    <div className="flex justify-between items-start mb-3">
                      <div className="p-2.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg">
                        <TrendingUp size={22} />
                      </div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded border border-blue-500/30 font-bold">
                        Utilidad Neta
                      </span>
                    </div>
                    <p className="text-xs uppercase font-mono text-gray-400 font-bold mb-1">
                      Ganancia Steel House
                    </p>
                    <p className="text-2xl sm:text-3xl font-mono-price font-bold text-blue-400 tracking-tight">
                      {formatCurrency(data.summary.netBarbershopEarnings)}
                    </p>
                    <div className="mt-3 pt-2 border-t border-white/10 text-xs text-gray-400 flex justify-between">
                      <span>Ticket Promedio:</span>
                      <span className="text-white font-mono font-bold">
                        {formatCurrency(data.summary.averageTicket)}
                      </span>
                    </div>
                  </BrutalCard>

                  {/* Estado de Liquidación */}
                  <BrutalCard className="p-5 border-purple-500/50 relative overflow-hidden bg-gradient-to-br from-[#121212] to-[#1a1a1a]">
                    <div className="flex justify-between items-start mb-3">
                      <div className="p-2.5 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-lg">
                        <ShieldCheck size={22} />
                      </div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded border border-purple-500/30 font-bold">
                        Clientes & Equipo
                      </span>
                    </div>
                    <p className="text-xs uppercase font-mono text-gray-400 font-bold mb-1">
                      Clientes Atendidos
                    </p>
                    <p className="text-2xl sm:text-3xl font-mono-price font-bold text-white tracking-tight">
                      {data.summary.uniqueClients || 0}
                    </p>
                    <div className="mt-3 pt-2 border-t border-white/10 text-xs text-gray-400 flex justify-between">
                      <span>Barberos Activos:</span>
                      <span className="text-gold-400 font-mono font-bold">
                        {data.summary.activeBarbersCount || 0}
                      </span>
                    </div>
                  </BrutalCard>
                </div>

                {/* FILA DE DESGLOSES: MÉTODOS DE PAGO Y TOP SERVICIOS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Desglose de Métodos de Pago */}
                  <BrutalCard className="p-6">
                    <h3 className="font-display text-xl uppercase tracking-wider text-white mb-4 flex items-center gap-2 border-b border-[#333] pb-3">
                      <CreditCard size={18} className="text-gold-500" />
                      Recaudación por Método de Pago
                    </h3>

                    <div className="space-y-4">
                      {Object.entries(data.paymentMethods || {}).map(([key, item]) => {
                        const totalGross = data.summary.grossRevenue || 1;
                        const percentage = Math.round(((item.total || 0) / totalGross) * 100);

                        return (
                          <div key={key} className="space-y-1.5">
                            <div className="flex justify-between items-center text-sm">
                              <span className="uppercase font-mono font-bold text-gray-200">
                                {key} ({item.count} pagos)
                              </span>
                              <div className="text-right">
                                <span className="font-mono-price font-bold text-gold-400 mr-2">
                                  {formatCurrency(item.total)}
                                </span>
                                <span className="text-xs text-gray-400 font-mono">({percentage}%)</span>
                              </div>
                            </div>
                            <div className="w-full h-2 bg-[#222] rounded-full overflow-hidden border border-[#333]">
                              <div
                                className="h-full bg-gold-500 transition-all duration-500"
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </BrutalCard>

                  {/* Servicios Más Solicitados */}
                  <BrutalCard className="p-6">
                    <h3 className="font-display text-xl uppercase tracking-wider text-white mb-4 flex items-center gap-2 border-b border-[#333] pb-3">
                      <Sparkles size={18} className="text-gold-500" />
                      Servicios Más Solicitados
                    </h3>

                    {data.servicesBreakdown.length === 0 ? (
                      <p className="text-sm text-gray-400 py-8 text-center">
                        No hay servicios completados en este período.
                      </p>
                    ) : (
                      <div className="divide-y divide-[#222] space-y-2">
                        {data.servicesBreakdown.slice(0, 5).map((srv, idx) => (
                          <div key={idx} className="pt-2 flex items-center justify-between">
                            <div>
                              <p className="text-sm font-bold text-white uppercase">{srv.name}</p>
                              <span className="text-xs text-gray-400 font-mono">
                                Realizado {srv.count} veces
                              </span>
                            </div>
                            <span className="font-mono-price text-sm font-bold text-gold-400">
                              {formatCurrency(srv.totalRevenue)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </BrutalCard>
                </div>
              </motion.div>
            )}

            {/* ======================================================== */}
            {/* TAB 2: NÓMINA Y CONTROL DE PAGOS A TRABAJADORES          */}
            {/* ======================================================== */}
            {activeTab === 'payroll' && (
              <motion.div
                key="payroll"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-display uppercase tracking-wider text-white">
                      Liquidación de Nómina del Equipo
                    </h3>
                    <p className="text-xs text-gray-400 font-sans">
                      Comisiones calculadas según los cortes finalizados en el período seleccionado.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 font-mono">
                      Total a liquidar: <strong className="text-red-400">{formatCurrency(data.summary.totalPendingPayout)}</strong>
                    </span>
                  </div>
                </div>

                {/* TARJETAS DE CADA BARBERO */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.barbersPayroll.map((barber) => {
                    const hasPending = barber.pendingCommission > 0;

                    return (
                      <BrutalCard
                        key={barber.barberId}
                        className={`p-6 flex flex-col justify-between transition-all ${
                          hasPending ? 'border-gold-500/60' : 'border-[#333]'
                        }`}
                      >
                        <div>
                          {/* Barber Header */}
                          <div className="flex items-start justify-between gap-3 mb-4 pb-4 border-b border-[#333]">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-[#222] border-2 border-gold-500 flex items-center justify-center font-bold text-gold-500 text-lg">
                                {barber.name.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-display text-lg text-white uppercase font-bold leading-tight">
                                  {barber.name}
                                </h4>
                                <p className="text-xs text-gray-400 font-mono">{barber.phone || barber.email}</p>
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
                              className="px-2.5 py-1 bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 border border-gold-500/30 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all"
                              title="Modificar % de comisión"
                            >
                              <Percent size={12} />
                              <span>{barber.commissionRate}%</span>
                              <Edit2 size={10} className="ml-0.5 opacity-60" />
                            </button>
                          </div>

                          {/* Métricas de Nómina del Barbero */}
                          <div className="space-y-2.5 text-xs font-sans mb-6">
                            <div className="flex justify-between text-gray-300">
                              <span>Cortes Realizados:</span>
                              <span className="font-bold text-white font-mono">{barber.totalCuts}</span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                              <span>Total Generado en Clientes:</span>
                              <span className="font-mono font-bold text-white">
                                {formatCurrency(barber.grossRevenue)}
                              </span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                              <span>Ganancia para Steel House:</span>
                              <span className="font-mono text-gray-400">
                                {formatCurrency(barber.barbershopShare)}
                              </span>
                            </div>

                            <div className="pt-2 border-t border-[#333] flex justify-between items-baseline">
                              <span className="font-mono uppercase font-bold text-gray-300">
                                Total Nómina Barbero:
                              </span>
                              <span className="font-mono-price text-base font-bold text-gold-400">
                                {formatCurrency(barber.commissionAmount)}
                              </span>
                            </div>

                            <div className="flex justify-between items-center text-[11px] pt-1">
                              <span className="text-green-400 flex items-center gap-1">
                                <CheckCircle2 size={12} /> Pagado: {formatCurrency(barber.paidCommission)}
                              </span>
                              <span className="text-red-400 flex items-center gap-1 font-bold">
                                <Clock size={12} /> Pendiente: {formatCurrency(barber.pendingCommission)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Botones de Acción */}
                        <div className="space-y-2 pt-4 border-t border-[#222]">
                          {hasPending ? (
                            <button
                              onClick={() => handleOpenPayoutModal(barber)}
                              className="w-full py-2.5 px-3 bg-gold-500 hover:bg-gold-400 text-black border-2 border-black font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-2 transition-all shadow-brutal-sm"
                            >
                              <DollarSign size={15} />
                              <span>Liquidar Nómina ({formatCurrency(barber.pendingCommission)})</span>
                            </button>
                          ) : (
                            <div className="w-full py-2 px-3 bg-[#181818] border border-green-500/30 text-green-400 text-xs font-mono text-center rounded flex items-center justify-center gap-1.5">
                              <CheckCircle2 size={14} />
                              <span>Al día · Sin saldos pendientes</span>
                            </div>
                          )}

                          <button
                            onClick={() => handleExportSingleBarberPdf(barber)}
                            className="w-full py-2 px-3 brutal-btn-outline text-xs text-gray-300 flex items-center justify-center gap-1.5"
                          >
                            <FileText size={13} />
                            <span>Descargar Desprendible PDF</span>
                          </button>
                        </div>
                      </BrutalCard>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ======================================================== */}
            {/* TAB 3: SERVICIOS Y CITAS RECOLECTADAS                    */}
            {/* ======================================================== */}
            {activeTab === 'services' && (
              <motion.div
                key="services"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* BARRA DE BÚSQUEDA Y FILTROS */}
                <div className="bg-[#111111] border-2 border-[#333] p-4 rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                  {/* Buscador */}
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar por cliente, teléfono, barbero, código o servicio..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="brutal-input pl-9 w-full text-xs"
                    />
                  </div>

                  {/* Filtro Estado Cita */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-mono text-gray-400">Estado:</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="brutal-input py-1.5 px-3 text-xs bg-[#1a1a1a]"
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
                    <span className="text-xs uppercase font-mono text-gray-400">Nómina:</span>
                    <select
                      value={commissionStatusFilter}
                      onChange={(e) => setCommissionStatusFilter(e.target.value)}
                      className="brutal-input py-1.5 px-3 text-xs bg-[#1a1a1a]"
                    >
                      <option value="todos">Todos los Pagos</option>
                      <option value="pendiente">Comisión Pendiente</option>
                      <option value="pagada">Comisión Liquidada</option>
                    </select>
                  </div>
                </div>

                {/* TABLA BRUTALIST DE CITAS */}
                <BrutalCard className="p-0 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans">
                      <thead className="bg-[#181818] border-b-2 border-[#333] text-gray-300 font-mono uppercase tracking-wider text-[11px]">
                        <tr>
                          <th className="py-3.5 px-4">CÓDIGO / FECHA</th>
                          <th className="py-3.5 px-4">BARBERO</th>
                          <th className="py-3.5 px-4">CLIENTE</th>
                          <th className="py-3.5 px-4">SERVICIOS PRESTADOS</th>
                          <th className="py-3.5 px-4">PAGO / MÉTODO</th>
                          <th className="py-3.5 px-4 text-right">TOTAL</th>
                          <th className="py-3.5 px-4 text-right">NÓMINA BARBERO</th>
                          <th className="py-3.5 px-4 text-center">ESTADO CITA</th>
                          <th className="py-3.5 px-4 text-center">LIQUIDACIÓN</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#222]">
                        {filteredAppointments.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="py-12 text-center text-gray-400">
                              No se encontraron servicios con los filtros aplicados.
                            </td>
                          </tr>
                        ) : (
                          filteredAppointments.map((apt) => (
                            <tr key={apt._id} className="hover:bg-[#1a1a1a] transition-colors">
                              {/* Código y Fecha */}
                              <td className="py-3.5 px-4">
                                <span className="font-mono font-bold text-gold-400 block">
                                  {apt.confirmationCode}
                                </span>
                                <span className="text-[11px] text-gray-400 font-mono">
                                  {new Date(apt.date).toLocaleDateString('es-CO')} · {formatTime(apt.startTime)}
                                </span>
                              </td>

                              {/* Barbero */}
                              <td className="py-3.5 px-4">
                                <span className="font-bold text-white block uppercase">
                                  {apt.barber?.name || 'Barbero'}
                                </span>
                                <span className="text-[10px] text-gray-400 font-mono">
                                  Comisión: {apt.commissionRate}%
                                </span>
                              </td>

                              {/* Cliente */}
                              <td className="py-3.5 px-4">
                                <span className="font-bold text-white block">
                                  {apt.client?.name || 'Cliente'}
                                </span>
                                <span className="text-[11px] text-gray-400 font-mono block">
                                  {apt.client?.phone || 'Sin tel'}
                                </span>
                              </td>

                              {/* Servicios */}
                              <td className="py-3.5 px-4 max-w-xs">
                                <div className="space-y-0.5">
                                  {(apt.services || []).map((s, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-block px-1.5 py-0.5 bg-[#222] border border-[#333] rounded text-[10px] text-gray-300 mr-1 mb-0.5"
                                    >
                                      {s.name}
                                    </span>
                                  ))}
                                </div>
                              </td>

                              {/* Método de Pago */}
                              <td className="py-3.5 px-4">
                                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold border border-white/10 bg-[#222] text-gray-300">
                                  {apt.paymentMethod || 'Efectivo'}
                                </span>
                              </td>

                              {/* Total Cobrado */}
                              <td className="py-3.5 px-4 text-right font-mono-price font-bold text-white text-sm">
                                {formatCurrency(apt.totalPrice)}
                              </td>

                              {/* Comisión / Nómina Barbero */}
                              <td className="py-3.5 px-4 text-right">
                                <span className="font-mono-price font-bold text-gold-400 block text-sm">
                                  {formatCurrency(apt.barberCut)}
                                </span>
                                <span className="text-[10px] text-gray-400 font-mono">
                                  Negocio: {formatCurrency(apt.barbershopCut)}
                                </span>
                              </td>

                              {/* Estado Cita */}
                              <td className="py-3.5 px-4 text-center">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${
                                    apt.status === 'completada'
                                      ? 'bg-green-500/10 text-green-400 border-green-500/30'
                                      : apt.status === 'cancelada'
                                      ? 'bg-red-500/10 text-red-400 border-red-500/30'
                                      : 'bg-gold-500/10 text-gold-400 border-gold-500/30'
                                  }`}
                                >
                                  {apt.status}
                                </span>
                              </td>

                              {/* Estado Liquidación y Botón Toggle */}
                              <td className="py-3.5 px-4 text-center">
                                {apt.status === 'completada' ? (
                                  <button
                                    onClick={() => handleToggleAppointmentPayout(apt)}
                                    className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase transition-all flex items-center justify-center gap-1 mx-auto border ${
                                      apt.commissionPaid
                                        ? 'bg-green-500/20 text-green-400 border-green-500 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500'
                                        : 'bg-red-500/20 text-red-400 border-red-500 hover:bg-green-500/20 hover:text-green-400 hover:border-green-500'
                                    }`}
                                    title="Haz clic para cambiar estado de liquidación"
                                  >
                                    {apt.commissionPaid ? (
                                      <>
                                        <CheckCircle2 size={12} />
                                        <span>Pagado</span>
                                      </>
                                    ) : (
                                      <>
                                        <Clock size={12} />
                                        <span>Pendiente</span>
                                      </>
                                    )}
                                  </button>
                                ) : (
                                  <span className="text-gray-500 text-[10px] font-mono">N/A</span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </BrutalCard>
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
          title={`LIQUIDAR NÓMINA · ${payoutModal.barber?.name?.toUpperCase()}`}
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-300 font-sans">
              Vas a registrar el pago de nómina para{' '}
              <strong className="text-gold-400">{payoutModal.barber?.name}</strong> correspondiente a{' '}
              <strong className="text-white">{payoutModal.pendingAppointments?.length} cortes completados</strong>.
            </p>

            <div className="bg-[#141414] border-2 border-gold-500 p-4 rounded-xl text-center space-y-1">
              <span className="text-xs uppercase font-mono text-gray-400 font-bold block">
                Total a Transferir / Pagar
              </span>
              <span className="text-3xl font-mono-price font-bold text-gold-400 block">
                {formatCurrency(payoutModal.totalPayout)}
              </span>
              <span className="text-[11px] text-gray-400 font-mono">
                Comisión acordada: {payoutModal.barber?.commissionRate}%
              </span>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() =>
                  setPayoutModal({ isOpen: false, barber: null, pendingAppointments: [], totalPayout: 0 })
                }
                disabled={submittingPayout}
                className="brutal-btn-outline flex-1 py-3 text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmBarberPayout}
                disabled={submittingPayout}
                className="brutal-btn-primary flex-1 py-3 text-xs flex items-center justify-center gap-2"
              >
                {submittingPayout ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Check size={16} strokeWidth={3} />
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
          title={`AJUSTAR COMISIÓN · ${commissionModal.barber?.name?.toUpperCase()}`}
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-300 font-sans">
              Define el porcentaje de comisión que recibirá este barbero por cada corte de pelo o servicio realizado.
            </p>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-gray-300 mb-1">
                Porcentaje de Comisión (%)
              </label>
              <div className="relative">
                <Percent size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={commissionModal.newRate}
                  onChange={(e) =>
                    setCommissionModal((prev) => ({ ...prev, newRate: e.target.value }))
                  }
                  className="brutal-input pl-9 w-full text-base font-mono"
                  placeholder="Ej: 50"
                  required
                />
              </div>
              <span className="text-[11px] text-gray-400 font-sans mt-1 block">
                Por ejemplo: 50% significa que el 50% del valor del servicio va para el barbero y el 50% para la barbería.
              </span>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() =>
                  setCommissionModal({ isOpen: false, barber: null, newRate: 50 })
                }
                disabled={submittingCommission}
                className="brutal-btn-outline flex-1 py-3 text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveCommissionRate}
                disabled={submittingCommission}
                className="brutal-btn-primary flex-1 py-3 text-xs flex items-center justify-center gap-2"
              >
                {submittingCommission ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Check size={16} strokeWidth={3} />
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
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Calendar, User, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import PageTransition from '../../components/ui/PageTransition';
import { appointmentService } from '../../services/appointmentService';
import { barberService } from '../../services/barberService';
import { formatTime } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function AdminAppointments() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [barberFilter, setBarberFilter] = useState('');
  const [page, setPage] = useState(1);

  // Fetch barbers for filter
  const { data: barbersData } = useQuery({
    queryKey: ['barbers'],
    queryFn: () => barberService.getAll()
  });
  const barbers = barbersData?.data?.barbers || barbersData?.barbers || [];

  // Fetch appointments
  const { data, isLoading } = useQuery({
    queryKey: ['admin-appointments', { page, status: statusFilter, date: dateFilter, barberId: barberFilter, search: searchTerm }],
    queryFn: async () => {
      const res = await appointmentService.getAll({
        page,
        limit: 10,
        status: statusFilter || undefined,
        date: dateFilter || undefined,
        barberId: barberFilter || undefined,
        search: searchTerm || undefined
      });
      return res.data || res;
    },
    keepPreviousData: true,
  });

  const appointments = data?.appointments || [];
  const pagination = data?.pagination || { totalPages: 1, currentPage: 1 };

  // Status mutations
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => appointmentService.updateStatus(id, status),
    onSuccess: () => {
      toast.success('Estado de la cita actualizado');
      queryClient.invalidateQueries(['admin-appointments']);
      queryClient.invalidateQueries(['admin-stats']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error al actualizar estado');
    }
  });

  const handleUpdateStatus = (id, status) => {
    updateStatusMutation.mutate({ id, status });
  };

  const statuses = [
    { value: '', label: 'Todas las citas' },
    { value: 'pendiente', label: 'Pendientes' },
    { value: 'confirmada', label: 'Confirmadas' },
    { value: 'completada', label: 'Completadas' },
    { value: 'cancelada', label: 'Canceladas' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completada':
        return 'tag-depot-green';
      case 'confirmada':
        return 'tag-depot-blue';
      case 'pendiente':
        return 'tag-depot-neutral';
      case 'cancelada':
        return 'tag-depot-danger';
      default:
        return 'tag-depot-neutral';
    }
  };

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-20">
        
        {/* Header — Depot Terminal Style */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-6 border-b border-[#2b292d]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#71d083] shadow-[0_0_8px_#71d083]"></span>
              <span className="text-[11px] font-mono uppercase tracking-[0.025em] text-[#71d083]">MÓDULO ADMINISTRATIVO</span>
            </div>
            <h1 className="font-sans font-semibold tracking-[-0.025em] text-2xl sm:text-3xl text-[#e5e5e5]">
              Gestión de <span className="text-[#71d083]">Citas</span>
            </h1>
            <p className="text-[#7c7a85] text-xs font-sans mt-1">
              Supervisión de agendas, cambios de estado y control operativo.
            </p>
          </div>
          
          <div className="flex gap-2.5">
            <button 
              onClick={() => setDateFilter(format(new Date(), 'yyyy-MM-dd'))}
              className="btn-depot-primary text-xs !py-2 !px-4"
            >
              Citas de Hoy
            </button>
            <button 
              onClick={() => {
                setDateFilter('');
                setStatusFilter('');
                setBarberFilter('');
                setSearchTerm('');
              }}
              className="btn-depot-outline text-xs !py-2 !px-4"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>

        {/* Filters Bar — Depot Style */}
        <div className="bg-[#121113] border border-[#2b292d] rounded-[6px] mb-6 p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7c7a85]" size={15} />
              <input
                type="text"
                placeholder="Buscar cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-depot pl-9 pr-3 !py-2 text-xs"
              />
            </div>
            
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="input-depot px-3 !py-2 text-xs font-mono"
            />
            
            <select
              value={barberFilter}
              onChange={(e) => setBarberFilter(e.target.value)}
              className="input-depot px-3 !py-2 text-xs cursor-pointer font-sans"
            >
              <option value="">Todos los barberos</option>
              {barbers.map(b => (
                <option key={b._id} value={b.user?._id || b._id}>{b.user?.name}</option>
              ))}
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-depot px-3 !py-2 text-xs cursor-pointer font-sans"
            >
              {statuses.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#71d083] border-t-transparent"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-16 bg-[#121113] border border-[#2b292d] rounded-[6px] p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
            <Calendar size={36} className="text-[#7c7a85] mx-auto mb-3" />
            <p className="font-sans font-medium uppercase tracking-[-0.025em] text-sm text-[#e5e5e5] mb-1">
              No se encontraron citas
            </p>
            <p className="text-[#7c7a85] text-xs font-sans mt-1">
              Intenta ajustando los filtros de fecha o barbero.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {appointments.map((apt) => (
              <div 
                key={apt._id} 
                className="bg-[#121113] border border-[#2b292d] hover:border-[#3c393f] rounded-[6px] overflow-hidden transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
              >
                <div className="flex flex-col lg:flex-row">
                  
                  {/* Info Section */}
                  <div className="flex-1 p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Client & Date */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={getStatusBadge(apt.status)}>
                          {apt.status}
                        </span>
                        <span className="text-[#7c7a85] font-mono text-xs">#{apt._id?.slice(-5)}</span>
                      </div>
                      <h3 className="font-sans font-medium text-base text-[#e5e5e5] leading-tight mb-1 tracking-[-0.025em]">
                        {apt.client?.name || 'Cliente sin nombre'}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[#7c7a85] text-xs font-sans mt-1">
                        <Calendar size={13} className="text-[#71d083]" />
                        <span className="font-mono">{new Date(apt.date + 'T12:00:00').toLocaleDateString('es-CO')}</span>
                        <span>•</span>
                        <span className="font-mono text-[#eeeef0] font-medium">{formatTime(apt.startTime)}</span>
                      </div>
                    </div>
                    
                    {/* Services */}
                    <div>
                      <p className="text-[#7c7a85] font-sans text-[11px] uppercase tracking-[0.025em] mb-2 font-medium">
                        Servicios solicitados
                      </p>
                      <div className="flex flex-col gap-1.5">
                        {apt.services?.map(s => (
                          <div key={s._id} className="text-[#b5b2bc] text-xs flex justify-between items-center border-b border-[#2b292d]/60 pb-1">
                            <span>{s.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Barber & Price */}
                    <div>
                      <p className="text-[#7c7a85] font-sans text-[11px] uppercase tracking-[0.025em] mb-2 font-medium">
                        Barbero & Pago
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-[4px] bg-[#1a191b] border border-[#2b292d] flex items-center justify-center font-mono text-[#71d083] text-xs font-medium">
                          {apt.barber?.user?.name?.charAt(0) || 'B'}
                        </div>
                        <span className="text-[#eeeef0] text-xs font-sans">{apt.barber?.user?.name || 'Por asignar'}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2 p-2 bg-[#1a191b] border border-[#2b292d] rounded-[4px]">
                        <span className="text-[#7c7a85] text-[10px] uppercase font-mono">{apt.paymentMethod}</span>
                        <span className="text-[#71d083] font-mono font-medium text-sm">${apt.totalPrice?.toLocaleString('es-CO')}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions Section */}
                  <div className="flex flex-row lg:flex-col border-t lg:border-t-0 lg:border-l border-[#2b292d] bg-[#1a191b] min-w-[150px]">
                    {apt.status === 'pendiente' && (
                      <button 
                        onClick={() => handleUpdateStatus(apt._id, 'confirmada')}
                        className="flex-1 py-3 px-4 text-[#70b8ff] hover:bg-[#70b8ff]/10 text-xs font-sans uppercase tracking-[0.025em] flex items-center justify-center gap-1.5 border-r lg:border-r-0 lg:border-b border-[#2b292d] transition-colors cursor-pointer"
                      >
                        <Check size={14} /> Confirmar
                      </button>
                    )}
                    
                    {(apt.status === 'pendiente' || apt.status === 'confirmada') && (
                      <button 
                        onClick={() => handleUpdateStatus(apt._id, 'completada')}
                        className="flex-1 py-3 px-4 text-[#71d083] hover:bg-[#1b2a1e] text-xs font-sans uppercase tracking-[0.025em] flex items-center justify-center gap-1.5 border-r lg:border-r-0 lg:border-b border-[#2b292d] transition-colors cursor-pointer"
                      >
                        <Check size={14} /> Finalizar
                      </button>
                    )}
                    
                    {(apt.status === 'pendiente' || apt.status === 'confirmada') && (
                      <button 
                        onClick={() => handleUpdateStatus(apt._id, 'cancelada')}
                        className="flex-1 py-3 px-4 text-rose-400 hover:bg-rose-500/10 text-xs font-sans uppercase tracking-[0.025em] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <X size={14} /> Cancelar
                      </button>
                    )}

                    {apt.status === 'completada' && (
                      <div className="flex-1 py-3 px-4 text-[#71d083] text-xs font-sans uppercase tracking-[0.025em] flex items-center justify-center gap-1.5 font-medium">
                        <Check size={14} /> Concluida
                      </div>
                    )}

                    {apt.status === 'cancelada' && (
                      <div className="flex-1 py-3 px-4 text-rose-400/70 text-xs font-sans uppercase tracking-[0.025em] flex items-center justify-center gap-1.5">
                        <X size={14} /> Anulada
                      </div>
                    )}
                  </div>
                  
                </div>
              </div>
            ))}
            
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button 
                  disabled={page === 1} 
                  onClick={() => setPage(p => p - 1)}
                  className="btn-depot-outline !py-1.5 !px-3 font-mono"
                >
                  &lt;
                </button>
                <div className="bg-[#1a191b] border border-[#2b292d] text-[#71d083] px-4 py-1.5 font-mono font-medium text-xs rounded-[6px] flex items-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
                  {page} / {pagination.totalPages}
                </div>
                <button 
                  disabled={page === pagination.totalPages} 
                  onClick={() => setPage(p => p + 1)}
                  className="btn-depot-outline !py-1.5 !px-3 font-mono"
                >
                  &gt;
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </PageTransition>
  );
}

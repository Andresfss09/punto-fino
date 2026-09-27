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
        return 'bg-emerald-950/50 text-emerald-400 border-emerald-800/40';
      case 'confirmada':
        return 'bg-blue-950/50 text-blue-400 border-blue-800/40';
      case 'pendiente':
        return 'bg-amber-950/50 text-gold-400 border-amber-800/40';
      case 'cancelada':
        return 'bg-rose-950/50 text-rose-400 border-rose-800/40';
      default:
        return 'bg-[#161d19] text-[#b3b3b3] border-[#222a26]';
    }
  };

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-6 border-b border-[#1f2723]">
          <div>
            <span className="editorial-tag text-gold-400 block mb-1">Módulo Administrativo</span>
            <h1 className="font-serif italic text-3xl sm:text-4xl text-white">
              Gestión de <span className="text-gold-400">Citas</span>
            </h1>
            <p className="text-[#8e9b94] text-xs font-sans mt-1">
              Supervisión de agendas, cambios de estado y control operativo
            </p>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setDateFilter(format(new Date(), 'yyyy-MM-dd'))}
              className="bg-gold-400 hover:bg-gold-300 text-[#0e1311] font-sans font-semibold text-xs tracking-wider uppercase px-4 py-2 rounded-[4px] transition-colors cursor-pointer shadow-sm"
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
              className="bg-[#161d19] hover:bg-[#1f2723] text-[#dfdbca] border border-[#2b3530] text-xs font-sans uppercase tracking-wider px-4 py-2 rounded-[4px] transition-colors cursor-pointer"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-[#121815] border border-[#1f2723] rounded-[4px] mb-6 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8e9b94]" size={16} />
              <input
                type="text"
                placeholder="Buscar cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0e1311] border border-[#222a26] text-white focus:border-gold-400/50 rounded-[4px] pl-9 pr-3 py-2 text-xs outline-none transition-colors"
              />
            </div>
            
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full bg-[#0e1311] border border-[#222a26] text-white focus:border-gold-400/50 rounded-[4px] px-3 py-2 text-xs outline-none transition-colors"
            />
            
            <select
              value={barberFilter}
              onChange={(e) => setBarberFilter(e.target.value)}
              className="w-full bg-[#0e1311] border border-[#222a26] text-white focus:border-gold-400/50 rounded-[4px] px-3 py-2 text-xs outline-none transition-colors cursor-pointer"
            >
              <option value="">Todos los barberos</option>
              {barbers.map(b => (
                <option key={b._id} value={b.user?._id || b._id}>{b.user?.name}</option>
              ))}
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#0e1311] border border-[#222a26] text-white focus:border-gold-400/50 rounded-[4px] px-3 py-2 text-xs outline-none transition-colors cursor-pointer"
            >
              {statuses.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-400"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-16 bg-[#121815] border border-[#1f2723] rounded-[4px] p-8">
            <Calendar size={40} className="text-gold-400/40 mx-auto mb-3" />
            <p className="font-serif italic text-xl text-white mb-1">No se encontraron citas</p>
            <p className="text-[#8e9b94] text-xs font-sans mt-1">Intenta ajustando los filtros de fecha o barbero.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((apt) => (
              <div key={apt._id} className="bg-[#121815] border border-[#1f2723] hover:border-[#2b3530] rounded-[4px] overflow-hidden transition-colors">
                <div className="flex flex-col lg:flex-row">
                  
                  {/* Info Section */}
                  <div className="flex-1 p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Client & Date */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-sans uppercase tracking-wider border ${getStatusBadge(apt.status)}`}>
                          {apt.status}
                        </span>
                        <span className="text-[#666] font-mono text-xs">#{apt._id?.slice(-5)}</span>
                      </div>
                      <h3 className="font-serif italic text-xl text-white leading-tight mb-1">
                        {apt.client?.name || 'Cliente sin nombre'}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[#8e9b94] text-xs font-sans mt-1">
                        <Calendar size={13} className="text-gold-400" />
                        <span>{new Date(apt.date + 'T12:00:00').toLocaleDateString('es-CO')}</span>
                        <span>•</span>
                        <span className="font-mono text-white font-medium">{formatTime(apt.startTime)}</span>
                      </div>
                    </div>
                    
                    {/* Services */}
                    <div>
                      <p className="text-[#8e9b94] font-sans text-[11px] uppercase tracking-wider mb-2">Servicios solicitados</p>
                      <div className="flex flex-col gap-1.5">
                        {apt.services?.map(s => (
                          <div key={s._id} className="text-[#dfdbca] text-xs flex justify-between items-center border-b border-[#1f2723] pb-1">
                            <span>{s.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Barber & Price */}
                    <div>
                      <p className="text-[#8e9b94] font-sans text-[11px] uppercase tracking-wider mb-2">Barbero & Pago</p>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-[2px] bg-[#161d19] border border-[#222a26] flex items-center justify-center font-serif italic text-gold-400 text-xs">
                          {apt.barber?.user?.name?.charAt(0) || 'B'}
                        </div>
                        <span className="text-white text-xs font-serif italic">{apt.barber?.user?.name || 'Por asignar'}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2 p-2 bg-[#161d19]/60 border border-[#222a26] rounded-[4px]">
                        <span className="text-[#8e9b94] text-[11px] uppercase font-mono">{apt.paymentMethod}</span>
                        <span className="text-gold-400 font-mono font-bold text-sm">${apt.totalPrice?.toLocaleString('es-CO')}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions Section */}
                  <div className="flex flex-row lg:flex-col border-t lg:border-t-0 lg:border-l border-[#1f2723] bg-[#161d19]/40 min-w-[150px]">
                    {apt.status === 'pendiente' && (
                      <button 
                        onClick={() => handleUpdateStatus(apt._id, 'confirmada')}
                        className="flex-1 py-3 px-4 text-blue-400 hover:bg-blue-950/40 text-xs font-sans uppercase tracking-wider flex items-center justify-center gap-1.5 border-r lg:border-r-0 lg:border-b border-[#1f2723] transition-colors cursor-pointer"
                      >
                        <Check size={14} /> Confirmar
                      </button>
                    )}
                    
                    {(apt.status === 'pendiente' || apt.status === 'confirmada') && (
                      <button 
                        onClick={() => handleUpdateStatus(apt._id, 'completada')}
                        className="flex-1 py-3 px-4 text-emerald-400 hover:bg-emerald-950/40 text-xs font-sans uppercase tracking-wider flex items-center justify-center gap-1.5 border-r lg:border-r-0 lg:border-b border-[#1f2723] transition-colors cursor-pointer"
                      >
                        <Check size={14} /> Finalizar
                      </button>
                    )}
                    
                    {(apt.status === 'pendiente' || apt.status === 'confirmada') && (
                      <button 
                        onClick={() => handleUpdateStatus(apt._id, 'cancelada')}
                        className="flex-1 py-3 px-4 text-rose-400 hover:bg-rose-950/40 text-xs font-sans uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <X size={14} /> Cancelar
                      </button>
                    )}

                    {apt.status === 'completada' && (
                      <div className="flex-1 py-3 px-4 text-emerald-500 text-xs font-sans uppercase tracking-wider flex items-center justify-center gap-1.5">
                        <Check size={14} /> Concluida
                      </div>
                    )}

                    {apt.status === 'cancelada' && (
                      <div className="flex-1 py-3 px-4 text-rose-400/60 text-xs font-sans uppercase tracking-wider flex items-center justify-center gap-1.5">
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
                  className="bg-[#161d19] hover:bg-[#1f2723] text-white border border-[#222a26] px-4 py-2 rounded-[4px] text-xs font-sans font-bold disabled:opacity-40 cursor-pointer"
                >
                  &lt;
                </button>
                <div className="bg-gold-400 text-[#0e1311] px-4 py-2 font-mono font-bold text-xs rounded-[4px] flex items-center">
                  {page} / {pagination.totalPages}
                </div>
                <button 
                  disabled={page === pagination.totalPages} 
                  onClick={() => setPage(p => p + 1)}
                  className="bg-[#161d19] hover:bg-[#1f2723] text-white border border-[#222a26] px-4 py-2 rounded-[4px] text-xs font-sans font-bold disabled:opacity-40 cursor-pointer"
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

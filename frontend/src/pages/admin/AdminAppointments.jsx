import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Calendar, Filter, User, Check, X, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import PageTransition from '../../components/ui/PageTransition';
import BrutalCard from '../../components/ui/BrutalCard';
import StatsCard from '../../components/ui/StatsCard';
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
  const { data, isLoading, error } = useQuery({
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
      toast.success('Estado actualizado');
      queryClient.invalidateQueries(['admin-appointments']);
      queryClient.invalidateQueries(['admin-stats']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error al actualizar');
    }
  });

  const handleUpdateStatus = (id, status) => {
    updateStatusMutation.mutate({ id, status });
  };

  const statuses = [
    { value: '', label: 'Todas' },
    { value: 'pendiente', label: 'Pendientes' },
    { value: 'confirmada', label: 'Confirmadas' },
    { value: 'completada', label: 'Completadas' },
    { value: 'cancelada', label: 'Canceladas' },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completada': return 'bg-[#22c55e] border-[#0a0a0a] text-black shadow-[2px_2px_0_#0a0a0a]';
      case 'confirmada': return 'bg-[#3b82f6] border-[#0a0a0a] text-black shadow-[2px_2px_0_#0a0a0a]';
      case 'pendiente': return 'bg-[#d4af37] border-[#0a0a0a] text-black shadow-[2px_2px_0_#0a0a0a]';
      case 'cancelada': return 'bg-[#ef4444] border-[#0a0a0a] text-black shadow-[2px_2px_0_#0a0a0a]';
      default: return 'bg-[#111111] border-[#333] text-[#a0a0a0]';
    }
  };

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-20">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="font-display text-4xl uppercase text-white mb-1">
              Gestión de <span className="text-[#d4af37]">Citas</span>
            </h1>
            <p className="text-[#a0a0a0] font-mono text-sm uppercase tracking-widest">
              PANEL DE ADMINISTRADOR
            </p>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setDateFilter(format(new Date(), 'yyyy-MM-dd'))}
              className="brutal-btn-primary px-4 py-2 text-xs"
            >
              HOY
            </button>
            <button 
              onClick={() => {
                setDateFilter('');
                setStatusFilter('');
                setBarberFilter('');
                setSearchTerm('');
              }}
              className="brutal-btn-outline px-4 py-2 text-xs"
            >
              LIMPIAR FILTROS
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <BrutalCard variant="default" className="mb-8 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" size={18} />
              <input
                type="text"
                placeholder="Buscar cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="brutal-input w-full pl-10"
              />
            </div>
            
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="brutal-input w-full"
            />
            
            <select
              value={barberFilter}
              onChange={(e) => setBarberFilter(e.target.value)}
              className="brutal-input w-full appearance-none"
            >
              <option value="">Todos los barberos</option>
              {barbers.map(b => (
                <option key={b._id} value={b.user?._id || b._id}>{b.user?.name}</option>
              ))}
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="brutal-input w-full appearance-none"
            >
              {statuses.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </BrutalCard>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37]"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-[#333]">
            <Calendar size={48} className="text-[#333] mx-auto mb-4" />
            <p className="text-[#a0a0a0] font-bold uppercase tracking-wider text-lg">No hay citas</p>
            <p className="text-[#666] font-mono text-sm mt-2">No se encontraron citas con los filtros actuales.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <BrutalCard key={apt._id} className="p-0 overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  
                  {/* Info Section */}
                  <div className="flex-1 p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Client & Date */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`brutal-badge ${getStatusStyle(apt.status)}`}>
                          {apt.status}
                        </span>
                        <span className="text-[#a0a0a0] font-mono text-xs">#{apt._id?.slice(-5)}</span>
                      </div>
                      <h3 className="font-display text-xl text-white uppercase leading-tight mb-1">
                        {apt.client?.name || 'Cliente Eliminado'}
                      </h3>
                      <div className="flex items-center gap-2 text-[#a0a0a0] text-sm">
                        <Calendar size={14} />
                        {new Date(apt.date + 'T12:00:00').toLocaleDateString('es-CO')} a las {formatTime(apt.startTime)}
                      </div>
                    </div>
                    
                    {/* Services */}
                    <div>
                      <p className="text-[#666] font-bold uppercase text-xs mb-2 tracking-wider">Servicios</p>
                      <div className="flex flex-col gap-1">
                        {apt.services?.map(s => (
                          <div key={s._id} className="text-white text-sm flex justify-between items-center border-b border-dashed border-[#333] pb-1">
                            <span className="uppercase">{s.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Barber & Price */}
                    <div>
                      <p className="text-[#666] font-bold uppercase text-xs mb-2 tracking-wider">Barbero & Pago</p>
                      <div className="flex items-center gap-2 mb-2">
                        <User size={14} className="text-[#a0a0a0]" />
                        <span className="text-white uppercase text-sm">{apt.barber?.user?.name || 'Cualquiera'}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2 p-2 bg-[#1a1a1a] border-2 border-[#333]">
                        <span className="text-[#a0a0a0] text-xs font-bold uppercase">{apt.paymentMethod}</span>
                        <span className="text-[#d4af37] font-mono-price font-bold">${apt.totalPrice?.toLocaleString('es-CO')}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions Section */}
                  <div className="flex flex-row lg:flex-col border-t-2 lg:border-t-0 lg:border-l-2 border-[#333] bg-[#111111]">
                    {apt.status === 'pendiente' && (
                      <button 
                        onClick={() => handleUpdateStatus(apt._id, 'confirmada')}
                        className="flex-1 py-4 px-6 text-[#3b82f6] font-bold uppercase text-xs hover:bg-[#3b82f6]/10 flex items-center justify-center gap-2 border-r-2 lg:border-r-0 lg:border-b-2 border-[#333] transition-colors"
                      >
                        <Check size={16} /> Confirmar
                      </button>
                    )}
                    
                    {(apt.status === 'pendiente' || apt.status === 'confirmada') && (
                      <button 
                        onClick={() => handleUpdateStatus(apt._id, 'completada')}
                        className="flex-1 py-4 px-6 text-[#22c55e] font-bold uppercase text-xs hover:bg-[#22c55e]/10 flex items-center justify-center gap-2 border-r-2 lg:border-r-0 lg:border-b-2 border-[#333] transition-colors"
                      >
                        <Check size={16} strokeWidth={3} /> Completar
                      </button>
                    )}
                    
                    {(apt.status === 'pendiente' || apt.status === 'confirmada') && (
                      <button 
                        onClick={() => handleUpdateStatus(apt._id, 'cancelada')}
                        className="flex-1 py-4 px-6 text-[#ef4444] font-bold uppercase text-xs hover:bg-[#ef4444]/10 flex items-center justify-center gap-2 transition-colors"
                      >
                        <X size={16} /> Cancelar
                      </button>
                    )}
                  </div>
                  
                </div>
              </BrutalCard>
            ))}
            
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button 
                  disabled={page === 1} 
                  onClick={() => setPage(p => p - 1)}
                  className="brutal-btn bg-[#111111] text-white border-[#333] px-4 py-2 font-bold disabled:opacity-50"
                >
                  &lt;
                </button>
                <div className="brutal-btn bg-[#d4af37] text-black border-[#0a0a0a] shadow-[4px_4px_0_#0a0a0a] px-4 py-2 font-mono font-bold flex items-center">
                  {page} / {pagination.totalPages}
                </div>
                <button 
                  disabled={page === pagination.totalPages} 
                  onClick={() => setPage(p => p + 1)}
                  className="brutal-btn bg-[#111111] text-white border-[#333] px-4 py-2 font-bold disabled:opacity-50"
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

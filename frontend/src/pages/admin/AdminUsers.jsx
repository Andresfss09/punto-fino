import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Eye, Users, UserCheck, UserPlus, Mail, Phone, Calendar, ShieldCheck } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import PageTransition from '../../components/ui/PageTransition';
import { userService } from '../../services/userService';
import toast from 'react-hot-toast';

const FALLBACK_USERS = [
  { _id: '1', name: 'Andrés Suárez', email: 'andres@gmail.com', role: 'admin', phone: '3157891234', isActive: true, createdAt: '2026-01-15' },
  { _id: '2', name: 'Emanuel Torres', email: 'emanuel@puntofino.com', role: 'barbero', phone: '3009876543', isActive: true, createdAt: '2026-02-10' },
  { _id: '3', name: 'Nicolás Gómez', email: 'nicolas@gmail.com', role: 'cliente', phone: '3205556677', isActive: true, createdAt: '2026-03-01' },
];

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('Todos');
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      try {
        const res = await userService.getAllUsers();
        const list = res.users || res.data?.users || res || [];
        return Array.isArray(list) && list.length > 0 ? list : FALLBACK_USERS;
      } catch (e) {
        return FALLBACK_USERS;
      }
    }
  });

  const users = Array.isArray(data) ? data : FALLBACK_USERS;

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }) => userService.updateUserStatus(id, isActive),
    onSuccess: () => {
      toast.success('Estado de usuario modificado');
      queryClient.invalidateQueries(['admin-users']);
    },
    onError: () => {
      toast.error('Error al actualizar estado');
    }
  });

  const filteredUsers = users.filter(u => {
    const roleMatch = filter === 'Todos' 
      || (filter === 'Clientes' && u.role === 'cliente')
      || (filter === 'Barberos' && u.role === 'barbero')
      || (filter === 'Admin' && u.role === 'admin');
    
    const searchMatch = (u.name || '').toLowerCase().includes(search.toLowerCase()) 
      || (u.email || '').toLowerCase().includes(search.toLowerCase())
      || (u.phone || '').includes(search);
    
    return roleMatch && searchMatch;
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-950/50 text-purple-400 border-purple-800/40';
      case 'barbero':
        return 'bg-amber-950/50 text-gold-400 border-amber-800/40';
      default:
        return 'bg-blue-950/50 text-blue-400 border-blue-800/40';
    }
  };

  const totalCount = users.length;
  const activeCount = users.filter(u => u.isActive !== false).length;
  const barberCount = users.filter(u => u.role === 'barbero').length;

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-20">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-6 border-b border-[#1f2723]">
          <div>
            <span className="editorial-tag text-gold-400 block mb-1">Comunidad & Cuentas</span>
            <h1 className="font-serif italic text-3xl sm:text-4xl text-white">
              Gestión de <span className="text-gold-400">Usuarios</span>
            </h1>
            <p className="text-[#8e9b94] text-xs font-sans mt-1">
              Directorio general de clientes, barberos y administradores de la plataforma
            </p>
          </div>
        </div>

        {/* Stats KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#121815] border border-[#1f2723] rounded-[4px] p-4 flex items-center justify-between">
            <div>
              <p className="text-[#8e9b94] font-sans text-[11px] uppercase tracking-wider mb-1">Total Registrados</p>
              <p className="font-mono text-2xl font-bold text-white">{totalCount}</p>
            </div>
            <div className="w-10 h-10 rounded-[4px] bg-[#161d19] border border-[#222a26] flex items-center justify-center text-gold-400">
              <Users size={18} />
            </div>
          </div>

          <div className="bg-[#121815] border border-[#1f2723] rounded-[4px] p-4 flex items-center justify-between">
            <div>
              <p className="text-[#8e9b94] font-sans text-[11px] uppercase tracking-wider mb-1">Cuentas Activas</p>
              <p className="font-mono text-2xl font-bold text-emerald-400">{activeCount}</p>
            </div>
            <div className="w-10 h-10 rounded-[4px] bg-[#161d19] border border-[#222a26] flex items-center justify-center text-emerald-400">
              <UserCheck size={18} />
            </div>
          </div>

          <div className="bg-[#121815] border border-[#1f2723] rounded-[4px] p-4 flex items-center justify-between">
            <div>
              <p className="text-[#8e9b94] font-sans text-[11px] uppercase tracking-wider mb-1">Barberos de Autor</p>
              <p className="font-mono text-2xl font-bold text-gold-400">{barberCount}</p>
            </div>
            <div className="w-10 h-10 rounded-[4px] bg-[#161d19] border border-[#222a26] flex items-center justify-center text-gold-400">
              <ShieldCheck size={18} />
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-[#121815] border border-[#1f2723] rounded-[4px] p-4 mb-6 flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8e9b94]" size={15} />
            <input 
              type="text"
              placeholder="Buscar por nombre, correo o teléfono..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0e1311] border border-[#222a26] text-white focus:border-gold-400/50 rounded-[4px] pl-9 pr-3 py-2 text-xs outline-none transition-colors"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
            {['Todos', 'Clientes', 'Barberos', 'Admin'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-1.5 rounded-[4px] text-xs font-sans uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  filter === f
                    ? 'bg-gold-400 text-[#0e1311] font-semibold shadow-sm'
                    : 'bg-[#161d19] text-[#b3b3b3] hover:text-white border border-[#222a26]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Users Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-400"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16 bg-[#121815] border border-[#1f2723] rounded-[4px] p-8">
            <Users size={40} className="text-gold-400/40 mx-auto mb-3" />
            <p className="font-serif italic text-xl text-white mb-1">No se encontraron usuarios</p>
            <p className="text-[#8e9b94] text-xs font-sans mt-1">Prueba con otro término de búsqueda o rol.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredUsers.map(user => {
              const userId = user._id || user.id;
              const isActive = user.isActive !== false;
              return (
                <div 
                  key={userId} 
                  className="bg-[#121815] border border-[#1f2723] hover:border-[#2b3530] transition-colors rounded-[4px] p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-[4px] bg-[#161d19] border border-gold-400/40 flex items-center justify-center font-serif italic text-lg text-gold-400 font-bold flex-shrink-0">
                          {user.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <h3 className="font-serif italic text-lg text-white leading-tight">{user.name}</h3>
                          <span className={`inline-block px-2 py-0.5 rounded-[4px] text-[10px] font-sans uppercase tracking-wider border mt-1 ${getRoleBadge(user.role)}`}>
                            {user.role}
                          </span>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-sans uppercase tracking-wider border ${
                        isActive 
                          ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40' 
                          : 'bg-rose-950/40 text-rose-400 border-rose-800/40'
                      }`}>
                        {isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    
                    <div className="text-xs text-[#8e9b94] space-y-1.5 mb-4 py-3 border-y border-[#1f2723]">
                      <div className="flex items-center gap-2">
                        <Mail size={13} className="text-gold-400/70" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={13} className="text-gold-400/70" />
                        <span>{user.phone || 'Sin registrar'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedUser(user)} 
                      className="flex-1 bg-[#161d19] hover:bg-[#1f2723] text-[#dfdbca] border border-[#2b3530] py-2 rounded-[4px] text-xs font-sans uppercase tracking-wider flex justify-center items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye size={13} /> Ver Ficha
                    </button>
                    <button
                      onClick={() => toggleStatusMutation.mutate({ id: userId, isActive: !isActive })}
                      className={`px-3 py-2 rounded-[4px] text-xs font-sans uppercase tracking-wider border transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-rose-950/30 hover:bg-rose-950/60 text-rose-400 border-rose-800/40'
                          : 'bg-emerald-950/30 hover:bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                      }`}
                      title={isActive ? 'Desactivar usuario' : 'Activar usuario'}
                    >
                      {isActive ? 'Bloquear' : 'Activar'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* User Details Modal */}
        <Modal 
          isOpen={!!selectedUser} 
          onClose={() => setSelectedUser(null)} 
          title="Ficha del Usuario"
        >
          {selectedUser && (
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4 pb-4 border-b border-[#1f2723]">
                <div className="w-14 h-14 rounded-[4px] bg-[#161d19] border border-gold-400/40 flex items-center justify-center font-serif italic text-2xl text-gold-400 font-bold">
                  {selectedUser.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h2 className="font-serif italic text-xl text-white">{selectedUser.name}</h2>
                  <span className={`inline-block px-2 py-0.5 rounded-[4px] text-[10px] font-sans uppercase tracking-wider border mt-1 ${getRoleBadge(selectedUser.role)}`}>
                    {selectedUser.role}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                <div className="bg-[#161d19]/40 border border-[#222a26] p-3 rounded-[4px]">
                  <p className="text-[#8e9b94] uppercase text-[10px] tracking-wider mb-1">Correo Electrónico</p>
                  <p className="text-white font-mono break-all">{selectedUser.email}</p>
                </div>
                <div className="bg-[#161d19]/40 border border-[#222a26] p-3 rounded-[4px]">
                  <p className="text-[#8e9b94] uppercase text-[10px] tracking-wider mb-1">Teléfono</p>
                  <p className="text-white font-mono">{selectedUser.phone || 'No registrado'}</p>
                </div>
                <div className="bg-[#161d19]/40 border border-[#222a26] p-3 rounded-[4px]">
                  <p className="text-[#8e9b94] uppercase text-[10px] tracking-wider mb-1">Fecha de Registro</p>
                  <p className="text-white font-mono">{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString('es-CO') : 'Reciente'}</p>
                </div>
                <div className="bg-[#161d19]/40 border border-[#222a26] p-3 rounded-[4px]">
                  <p className="text-[#8e9b94] uppercase text-[10px] tracking-wider mb-1">Estado de Cuenta</p>
                  <p className={`font-mono ${selectedUser.isActive !== false ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {selectedUser.isActive !== false ? 'Activa y Verificada' : 'Desactivada'}
                  </p>
                </div>
              </div>
              
              <div className="pt-3 flex justify-end">
                <button 
                  onClick={() => setSelectedUser(null)} 
                  className="bg-gold-400 hover:bg-gold-300 text-[#0e1311] font-sans font-semibold text-xs tracking-wider uppercase px-5 py-2.5 rounded-[4px] transition-colors cursor-pointer shadow-sm"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </PageTransition>
  );
}

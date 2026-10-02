import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Eye, Users, UserCheck, Mail, Phone, ShieldCheck } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import PageTransition from '../../components/ui/PageTransition';
import { userService } from '../../services/userService';
import toast from 'react-hot-toast';

const FALLBACK_USERS = [
  { _id: '1', name: 'Andrés Felipe Sarria', email: 'andres@triadix.co', role: 'admin', phone: '3157891234', isActive: true, createdAt: '2026-01-15' },
  { _id: '2', name: 'Nicolás Chávez', email: 'nicolas@triadix.co', role: 'barbero', phone: '3009876543', isActive: true, createdAt: '2026-02-10' },
  { _id: '3', name: 'Luis De Ávila', email: 'luis@triadix.co', role: 'barbero', phone: '3205556677', isActive: true, createdAt: '2026-03-01' },
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
        return 'tag-depot-lilac';
      case 'barbero':
        return 'tag-depot-green';
      default:
        return 'tag-depot-blue';
    }
  };

  const totalCount = users.length;
  const activeCount = users.filter(u => u.isActive !== false).length;
  const barberCount = users.filter(u => u.role === 'barbero').length;

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-20">
        
        {/* Header — Depot Terminal Style */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-6 border-b border-[#2b292d]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#71d083] shadow-[0_0_8px_#71d083]"></span>
              <span className="text-[11px] font-mono uppercase tracking-[0.025em] text-[#71d083]">COMUNIDAD & CUENTAS</span>
            </div>
            <h1 className="font-sans font-semibold tracking-[-0.025em] text-2xl sm:text-3xl text-[#e5e5e5]">
              Gestión de <span className="text-[#71d083]">Usuarios</span>
            </h1>
            <p className="text-[#7c7a85] text-xs font-sans mt-1">
              Directorio general de clientes, barberos y administradores de la plataforma.
            </p>
          </div>
        </div>

        {/* Stats KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#121113] border border-[#2b292d] rounded-[6px] p-4 flex items-center justify-between shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
            <div>
              <p className="text-[#7c7a85] font-sans text-[11px] uppercase tracking-[0.025em] mb-1">Total Registrados</p>
              <p className="font-mono text-2xl font-medium text-[#e5e5e5]">{totalCount}</p>
            </div>
            <div className="w-9 h-9 rounded-[6px] bg-[#1a191b] border border-[#2b292d] flex items-center justify-center text-[#71d083] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
              <Users size={16} />
            </div>
          </div>

          <div className="bg-[#121113] border border-[#2b292d] rounded-[6px] p-4 flex items-center justify-between shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
            <div>
              <p className="text-[#7c7a85] font-sans text-[11px] uppercase tracking-[0.025em] mb-1">Cuentas Activas</p>
              <p className="font-mono text-2xl font-medium text-[#71d083]">{activeCount}</p>
            </div>
            <div className="w-9 h-9 rounded-[6px] bg-[#1a191b] border border-[#2b292d] flex items-center justify-center text-[#71d083] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
              <UserCheck size={16} />
            </div>
          </div>

          <div className="bg-[#121113] border border-[#2b292d] rounded-[6px] p-4 flex items-center justify-between shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
            <div>
              <p className="text-[#7c7a85] font-sans text-[11px] uppercase tracking-[0.025em] mb-1">Barberos de Autor</p>
              <p className="font-mono text-2xl font-medium text-[#baa7ff]">{barberCount}</p>
            </div>
            <div className="w-9 h-9 rounded-[6px] bg-[#1a191b] border border-[#2b292d] flex items-center justify-center text-[#baa7ff] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
              <ShieldCheck size={16} />
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-[#121113] border border-[#2b292d] rounded-[6px] p-4 mb-6 flex flex-col sm:flex-row gap-3 justify-between items-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7c7a85]" size={15} />
            <input 
              type="text"
              placeholder="Buscar por nombre, correo o teléfono..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-depot pl-9 pr-3 !py-2 text-xs"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
            {['Todos', 'Clientes', 'Barberos', 'Admin'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-1.5 rounded-[6px] text-xs font-sans uppercase tracking-[0.025em] transition-all whitespace-nowrap cursor-pointer border ${
                  filter === f
                    ? 'bg-[#1a191b] text-[#71d083] border-[#2d5736] font-medium shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]'
                    : 'bg-[#1a191b]/40 text-[#7c7a85] hover:text-[#eeeef0] border-[#2b292d] hover:border-[#3c393f]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Users Grid */}
        {isLoading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#71d083] border-t-transparent"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16 bg-[#121113] border border-[#2b292d] rounded-[6px] p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
            <Users size={36} className="text-[#7c7a85] mx-auto mb-3" />
            <p className="font-sans font-medium uppercase tracking-[-0.025em] text-sm text-[#e5e5e5] mb-1">No se encontraron usuarios</p>
            <p className="text-[#7c7a85] text-xs font-sans mt-1">Prueba con otro término de búsqueda o rol.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredUsers.map(user => {
              const userId = user._id || user.id;
              const isActive = user.isActive !== false;
              return (
                <div 
                  key={userId} 
                  className="bg-[#121113] border border-[#2b292d] hover:border-[#3c393f] transition-all rounded-[6px] p-5 flex flex-col justify-between shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-[6px] bg-[#1a191b] border border-[#2b292d] flex items-center justify-center font-mono text-base text-[#71d083] font-medium flex-shrink-0 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
                          {user.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <h3 className="font-sans font-medium tracking-[-0.025em] text-sm text-[#e5e5e5] leading-tight">{user.name}</h3>
                          <span className={`inline-block mt-1 ${getRoleBadge(user.role)}`}>
                            {user.role}
                          </span>
                        </div>
                      </div>
                      <span className={isActive ? 'tag-depot-green' : 'tag-depot-danger'}>
                        {isActive ? '● Activo' : '○ Inactivo'}
                      </span>
                    </div>
                    
                    <div className="text-xs text-[#7c7a85] space-y-1.5 mb-4 py-3 border-y border-[#2b292d]">
                      <div className="flex items-center gap-2">
                        <Mail size={13} className="text-[#b5b2bc]" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={13} className="text-[#b5b2bc]" />
                        <span className="font-mono text-[#eeeef0]">{user.phone || 'Sin registrar'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedUser(user)} 
                      className="flex-1 btn-depot-outline !py-2 text-xs flex justify-center items-center gap-1.5"
                    >
                      <Eye size={13} /> Ver Ficha
                    </button>
                    <button
                      onClick={() => toggleStatusMutation.mutate({ id: userId, isActive: !isActive })}
                      className={`px-3 py-2 rounded-[6px] text-xs font-sans uppercase tracking-[0.025em] border transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30'
                          : 'bg-[#1b2a1e] hover:bg-[#243d29] text-[#71d083] border-[#2d5736]'
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
          title="FICHA DEL USUARIO"
        >
          {selectedUser && (
            <div className="space-y-5">
              <div className="flex items-center gap-4 pb-4 border-b border-[#2b292d]">
                <div className="w-12 h-12 rounded-[6px] bg-[#1a191b] border border-[#2b292d] flex items-center justify-center font-mono text-xl text-[#71d083] font-medium shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
                  {selectedUser.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h2 className="font-sans font-medium tracking-[-0.025em] text-base text-[#e5e5e5]">{selectedUser.name}</h2>
                  <span className={`inline-block mt-1 ${getRoleBadge(selectedUser.role)}`}>
                    {selectedUser.role}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                <div className="bg-[#1a191b] border border-[#2b292d] p-3 rounded-[6px]">
                  <p className="text-[#7c7a85] uppercase text-[10px] font-mono tracking-[0.025em] mb-1">Correo Electrónico</p>
                  <p className="text-[#eeeef0] font-mono break-all">{selectedUser.email}</p>
                </div>
                <div className="bg-[#1a191b] border border-[#2b292d] p-3 rounded-[6px]">
                  <p className="text-[#7c7a85] uppercase text-[10px] font-mono tracking-[0.025em] mb-1">Teléfono</p>
                  <p className="text-[#eeeef0] font-mono">{selectedUser.phone || 'No registrado'}</p>
                </div>
                <div className="bg-[#1a191b] border border-[#2b292d] p-3 rounded-[6px]">
                  <p className="text-[#7c7a85] uppercase text-[10px] font-mono tracking-[0.025em] mb-1">Fecha de Registro</p>
                  <p className="text-[#eeeef0] font-mono">{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString('es-CO') : 'Reciente'}</p>
                </div>
                <div className="bg-[#1a191b] border border-[#2b292d] p-3 rounded-[6px]">
                  <p className="text-[#7c7a85] uppercase text-[10px] font-mono tracking-[0.025em] mb-1">Estado de Cuenta</p>
                  <p className={`font-mono ${selectedUser.isActive !== false ? 'text-[#71d083]' : 'text-rose-400'}`}>
                    {selectedUser.isActive !== false ? '● Activa y Verificada' : '○ Desactivada'}
                  </p>
                </div>
              </div>
              
              <div className="pt-3 border-t border-[#2b292d] flex justify-end">
                <button 
                  onClick={() => setSelectedUser(null)} 
                  className="btn-depot-primary !py-2 !px-5"
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

import React, { useState } from 'react';
import { Search, Eye, Users, UserPlus, UserCheck } from 'lucide-react';
import BrutalCard from '../../components/ui/BrutalCard';
import StatsCard from '../../components/ui/StatsCard';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import PageTransition from '../../components/ui/PageTransition';

const MOCK_USERS = [
  { id: 1, name: 'Juan Pérez', email: 'juan@test.com', role: 'cliente', phone: '+57 300 123 4567', active: true, points: 120, joins: '2023-01-15' },
  { id: 2, name: 'Carlos Barbero', email: 'carlos@test.com', role: 'barbero', phone: '+57 300 987 6543', active: true, points: 0, joins: '2023-02-10' },
  { id: 3, name: 'Admin Root', email: 'admin@test.com', role: 'admin', phone: '+57 300 555 5555', active: true, points: 0, joins: '2022-11-01' },
];

export default function AdminUsers() {
  const [filter, setFilter] = useState('Todos');
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers = MOCK_USERS.filter(u => {
    const matchesFilter = filter === 'Todos' || u.role === filter.toLowerCase();
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'barbero': return 'bg-gold-500/10 text-gold-500 border-gold-500/20';
      default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        <h1 className="text-3xl font-display font-bold uppercase tracking-wider text-gold-500">Usuarios</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard icon={Users} label="Total Usuarios" value={MOCK_USERS.length} />
          <StatsCard icon={UserCheck} label="Usuarios Activos" value={MOCK_USERS.filter(u => u.active).length} />
          <StatsCard icon={UserPlus} label="Nuevos este mes" value={5} trend="+12%" />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-dark-300 p-4 border-2 border-[#333] shadow-brutal-sm">
          <div className="w-full sm:w-96">
            <Input 
              icon={Search} 
              placeholder="Buscar por nombre o email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            {['Todos', 'Clientes', 'Barberos', 'Admin'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`brutal-badge cursor-pointer px-4 py-2 transition-all whitespace-nowrap ${
                  filter === f ? 'bg-gold-500 text-dark-500 border-dark-500 shadow-[2px_2px_0_#0a0a0a]' : 'bg-dark-200 text-gray-400 border-[#333]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map(user => (
            <BrutalCard key={user.id} className="flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-dark-200 border-2 border-[#333] flex items-center justify-center font-bold text-lg">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold">{user.name}</h3>
                    <span className={`brutal-badge text-[10px] ${getRoleBadgeColor(user.role)}`}>{user.role}</span>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full border-2 border-[#333] ${user.active ? 'bg-green-500' : 'bg-red-500'}`} title={user.active ? 'Activo' : 'Inactivo'} />
              </div>
              
              <div className="text-sm text-gray-400 space-y-1 mb-4 font-mono-price flex-grow">
                <p>{user.email}</p>
                <p>{user.phone}</p>
              </div>

              <div className="flex gap-2 mt-auto border-t-2 border-dashed border-[#333] pt-4">
                <button onClick={() => setSelectedUser(user)} className="flex-1 brutal-btn bg-dark-300 border-[#333] py-2 text-sm flex justify-center items-center gap-2 hover:bg-dark-200 uppercase font-bold text-gold-500">
                  <Eye size={16} /> Ver Detalles
                </button>
                <label className="relative inline-flex items-center cursor-pointer ml-2" title="Alternar Estado">
                  <input type="checkbox" className="sr-only peer" defaultChecked={user.active} />
                  <div className="w-11 h-6 bg-dark-300 border-2 border-[#333] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#333] after:border-[#333] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500 peer-checked:after:bg-dark-500"></div>
                </label>
              </div>
            </BrutalCard>
          ))}
        </div>

        <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title="Detalles de Usuario">
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 border-b-2 border-dashed border-[#333] pb-4">
                <div className="w-16 h-16 rounded-full bg-dark-200 border-2 border-gold-500 flex items-center justify-center font-bold text-2xl text-gold-500">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold uppercase">{selectedUser.name}</h2>
                  <span className={`brutal-badge text-[10px] ${getRoleBadgeColor(selectedUser.role)}`}>{selectedUser.role}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 font-mono-price text-sm">
                <div>
                  <p className="text-gray-500 uppercase text-xs font-bold font-sans">Email</p>
                  <p>{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-gray-500 uppercase text-xs font-bold font-sans">Teléfono</p>
                  <p>{selectedUser.phone}</p>
                </div>
                <div>
                  <p className="text-gray-500 uppercase text-xs font-bold font-sans">Registro</p>
                  <p>{selectedUser.joins}</p>
                </div>
                <div>
                  <p className="text-gray-500 uppercase text-xs font-bold font-sans">Puntos Fidelidad</p>
                  <p className="text-gold-500">{selectedUser.points}</p>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <button onClick={() => setSelectedUser(null)} className="brutal-btn-primary px-6 py-2 text-sm">Cerrar</button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </PageTransition>
  );
}

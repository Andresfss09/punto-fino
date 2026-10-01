import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Calendar, Scissors, User, LayoutDashboard, Sparkles, Users, LogOut } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const role = user?.role || 'cliente';

  let links = [];
  switch (role) {
    case 'admin':
      links = [
        { icon: LayoutDashboard, label: 'Dashboard & Nómina', path: '/admin' },
        { icon: Calendar, label: 'Citas', path: '/admin/citas' },
        { icon: Scissors, label: 'Barberos', path: '/admin/barberos' },
        { icon: Sparkles, label: 'Servicios', path: '/admin/servicios' },
        { icon: Users, label: 'Usuarios', path: '/admin/usuarios' },
      ];
      break;
    case 'barbero':
      links = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/barber' },
        { icon: Calendar, label: 'Agenda', path: '/barber/agenda' },
        { icon: User, label: 'Mi Perfil', path: '/barber/perfil' },
      ];
      break;
    case 'cliente':
    default:
      links = [
        { icon: Home, label: 'Inicio', path: '/cliente' },
        { icon: Calendar, label: 'Mis Citas', path: '/cliente/citas' },
        { icon: Scissors, label: 'Reservar', path: '/reservar' },
        { icon: User, label: 'Perfil', path: '/cliente/perfil' },
      ];
      break;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-[#0a0a0a] border-r border-[#1e1e1e] flex-shrink-0 z-40 relative">
      {/* Logo Area */}
      <div className="h-16 py-3 flex items-center gap-3 px-5 border-b border-[#1e1e1e]">
        <img
          src="/logo.png"
          alt="Barbería Triadix"
          className="w-8 h-8 object-contain rounded-none border border-[#222222] p-0.5 bg-[#0d0d0d]"
        />
        <div>
          <h2 className="font-sans font-medium uppercase tracking-[0.2em] text-xs text-white leading-none">TRIADIX</h2>
          <span className="text-[9px] text-gold-400 tracking-[0.22em] font-medium uppercase block mt-1">Barbería</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {links.map((link, idx) => (
          <NavLink
            key={idx}
            to={link.path}
            end={link.path === '/cliente' || link.path === '/barber' || link.path === '/admin'}
            className={({ isActive }) =>
              `flex items-center px-3.5 py-2.5 rounded-none text-xs font-sans uppercase tracking-[0.16em] transition-all duration-150 ${
                isActive
                  ? 'bg-[#141414] border border-[#2e2e2e] text-white font-medium'
                  : 'text-[#888888] hover:text-white hover:bg-white/5 border border-transparent'
              }`
            }
          >
            <link.icon className="w-4 h-4 mr-3 flex-shrink-0" />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Area - User info & Logout */}
      <div className="p-3 border-t border-[#1e1e1e] flex flex-col gap-2">
        <button 
          onClick={handleLogout}
          className="flex items-center px-3.5 py-2.5 rounded-none text-xs font-sans uppercase tracking-[0.16em] text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent transition-colors w-full text-left cursor-pointer"
        >
          <LogOut className="w-4 h-4 mr-3 flex-shrink-0" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}

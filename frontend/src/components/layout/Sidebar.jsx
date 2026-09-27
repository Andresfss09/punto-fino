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
    <aside className="hidden md:flex flex-col w-64 h-screen bg-[#0e1311] border-r border-[#1f2723] flex-shrink-0 z-40 relative">
      {/* Logo Area */}
      <div className="h-18 py-3 flex items-center gap-3 px-5 border-b border-[#1f2723]">
        <img
          src="/logo.png"
          alt="Punto Fino"
          className="w-9 h-9 object-contain rounded-full border border-gold-400/40"
        />
        <div>
          <h2 className="font-serif italic text-xl text-white tracking-tight leading-none">Punto Fino</h2>
          <span className="text-[10px] text-gold-400 tracking-[0.2em] font-medium uppercase block mt-1">Barbería de Autor</span>
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
              `flex items-center px-3.5 py-2.5 rounded-[4px] text-xs font-sans uppercase tracking-wider transition-all duration-150 ${
                isActive
                  ? 'bg-[#161d19] border border-gold-400/50 text-gold-400 font-medium'
                  : 'text-[#b3b3b3] hover:text-white hover:bg-white/5 border border-transparent'
              }`
            }
          >
            <link.icon className="w-4 h-4 mr-3 flex-shrink-0" />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Area - User info & Logout */}
      <div className="p-3 border-t border-[#1f2723] flex flex-col gap-2">
        <button 
          onClick={handleLogout}
          className="flex items-center px-3.5 py-2.5 rounded-[4px] text-xs font-sans uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent transition-colors w-full text-left cursor-pointer"
        >
          <LogOut className="w-4 h-4 mr-3 flex-shrink-0" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}

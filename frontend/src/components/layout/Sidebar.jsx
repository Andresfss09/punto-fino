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
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
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
    <aside className="hidden md:flex flex-col w-64 h-screen bg-[#111111] border-r-2 border-[#333] flex-shrink-0 z-40 relative">
      {/* Logo Area */}
      <div className="h-16 flex items-center gap-3 px-5 border-b-2 border-[#333]">
        <img
          src="/logo.png"
          alt="Steel House"
          className="w-9 h-9 object-contain rounded-full border border-gold-500/40"
        />
        <div>
          <h2 className="font-display font-bold text-base text-white tracking-wide leading-none">Steel House</h2>
          <span className="text-[10px] text-gold-500 tracking-[0.2em] font-semibold uppercase">Barberia's 👑</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {links.map((link, idx) => (
          <NavLink
            key={idx}
            to={link.path}
            end={link.path === '/cliente' || link.path === '/barbero' || link.path === '/admin'}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 min-h-[44px] border-2 transition-colors duration-100 ${
                isActive
                  ? 'border-[#d4af37] text-[#d4af37] bg-[#d4af37]/10'
                  : 'border-transparent text-[#a0a0a0] hover:text-white hover:bg-[#333]/50 hover:border-[#333]'
              }`
            }
          >
            <link.icon className="w-5 h-5 mr-3 flex-shrink-0" />
            <span className="font-medium">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Area - User info & Logout */}
      <div className="p-4 border-t-2 border-[#333] flex flex-col gap-2">
        <button 
          onClick={handleLogout}
          className="flex items-center px-4 py-3 min-h-[44px] text-[#a0a0a0] hover:text-white hover:bg-[#333]/50 border-2 border-transparent hover:border-[#333] transition-colors w-full text-left"
        >
          <LogOut className="w-5 h-5 mr-3 flex-shrink-0" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}

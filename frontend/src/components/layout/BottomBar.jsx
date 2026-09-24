import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, Scissors, User, LayoutDashboard, Sparkles, Users } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const BottomBar = () => {
  const { user } = useAuthStore();
  const role = user?.role || 'cliente';

  let links = [];

  switch (role) {
    case 'admin':
      links = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: Calendar, label: 'Citas', path: '/admin/citas' },
        { icon: Scissors, label: 'Barberos', path: '/admin/barberos' },
        { icon: Sparkles, label: 'Servicios', path: '/admin/servicios' },
      ];
      break;
    case 'barbero':
      links = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/barber' },
        { icon: Calendar, label: 'Agenda', path: '/barber/agenda' },
        { icon: User, label: 'Perfil', path: '/barber/perfil' },
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

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t-3 border-[#333] pb-safe z-40">
      <div className="flex justify-around items-center h-16">
        {links.map((link, idx) => (
          <NavLink
            key={idx}
            to={link.path}
            end={link.path === '/cliente' || link.path === '/barber' || link.path === '/admin'}
            className={({ isActive }) => 
              `flex flex-col items-center justify-center flex-1 h-full min-w-[44px] border-t-3 transition-colors ${
                isActive 
                  ? 'border-[#d4af37] text-[#d4af37] bg-[#d4af37]/5' 
                  : 'border-transparent text-[#a0a0a0] hover:text-white'
              }`
            }
          >
            <link.icon className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium uppercase tracking-wider">{link.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomBar;

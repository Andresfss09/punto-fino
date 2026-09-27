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
        { icon: LayoutDashboard, label: 'Nómina', path: '/admin' },
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0e1311] border-t border-[#1f2723] pb-safe z-40">
      <div className="flex justify-around items-center h-16">
        {links.map((link, idx) => (
          <NavLink
            key={idx}
            to={link.path}
            end={link.path === '/cliente' || link.path === '/barber' || link.path === '/admin'}
            className={({ isActive }) => 
              `flex flex-col items-center justify-center flex-1 h-full min-w-[44px] transition-colors ${
                isActive 
                  ? 'text-gold-400 bg-[#161d19]/80 border-t-2 border-gold-400' 
                  : 'text-[#808080] hover:text-[#dfdbca] border-t-2 border-transparent'
              }`
            }
          >
            <link.icon className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-sans font-medium uppercase tracking-wider">{link.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomBar;

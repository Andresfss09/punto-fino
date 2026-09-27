import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, Scissors, User, LayoutDashboard, Sparkles } from 'lucide-react';
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-[#1e1e1e] pb-safe z-40">
      <div className="flex justify-around items-center h-16">
        {links.map((link, idx) => (
          <NavLink
            key={idx}
            to={link.path}
            end={link.path === '/cliente' || link.path === '/barber' || link.path === '/admin'}
            className={({ isActive }) => 
              `flex flex-col items-center justify-center flex-1 h-full min-w-[44px] transition-colors ${
                isActive 
                  ? 'text-white bg-[#141414] border-t-2 border-white' 
                  : 'text-[#888888] hover:text-white border-t-2 border-transparent'
              }`
            }
          >
            <link.icon className="w-4 h-4 mb-1" />
            <span className="text-[10px] font-sans font-medium uppercase tracking-[0.14em]">{link.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomBar;

import { NavLink } from 'react-router-dom';
import { Calendar, Scissors, User, LayoutDashboard, Sparkles } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const BottomBar = () => {
  const { user } = useAuthStore();
  const role = user?.role || 'cliente';

  const links = role === 'admin'
    ? [
        { icon: LayoutDashboard, label: 'Nómina', path: '/admin' },
        { icon: Calendar, label: 'Citas', path: '/admin/citas' },
        { icon: Scissors, label: 'Barberos', path: '/admin/barberos' },
        { icon: Sparkles, label: 'Servicios', path: '/admin/servicios' },
      ]
    : [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/barber' },
        { icon: Calendar, label: 'Agenda', path: '/barber/agenda' },
        { icon: User, label: 'Perfil', path: '/barber/perfil' },
      ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#121113] border-t border-[#2b292d] pb-safe z-40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
      <div className="flex justify-around items-center h-16">
        {links.map((link, idx) => (
          <NavLink
            key={idx}
            to={link.path}
            end={link.path === '/barber' || link.path === '/admin'}
            className={({ isActive }) => 
              `flex flex-col items-center justify-center flex-1 h-full min-w-[44px] transition-colors ${
                isActive 
                  ? 'text-[#71d083] bg-[#1a191b] border-t-2 border-[#71d083]' 
                  : 'text-[#7c7a85] hover:text-[#eeeef0] border-t-2 border-transparent'
              }`
            }
          >
            <link.icon className="w-4 h-4 mb-1" />
            <span className="text-[10px] font-sans font-medium uppercase tracking-[0.025em]">{link.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomBar;

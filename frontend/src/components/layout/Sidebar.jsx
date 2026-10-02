import { NavLink, useNavigate } from 'react-router-dom';
import { Calendar, Scissors, User, LayoutDashboard, Sparkles, Users, LogOut } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const role = user?.role || 'cliente';

  const links = role === 'admin'
    ? [
        { icon: LayoutDashboard, label: 'Dashboard & Nómina', path: '/admin' },
        { icon: Calendar, label: 'Citas', path: '/admin/citas' },
        { icon: Scissors, label: 'Barberos', path: '/admin/barberos' },
        { icon: Sparkles, label: 'Servicios', path: '/admin/servicios' },
        { icon: Users, label: 'Usuarios', path: '/admin/usuarios' },
      ]
    : [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/barber' },
        { icon: Calendar, label: 'Agenda', path: '/barber/agenda' },
        { icon: User, label: 'Mi Perfil', path: '/barber/perfil' },
      ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-[#121113] border-r border-[#2b292d] flex-shrink-0 z-40 relative shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
      {/* Logo Area */}
      <div className="h-16 py-3 flex items-center gap-3 px-5 border-b border-[#2b292d]">
        <img
          src="/logo.png"
          alt="Barbería Triadix"
          className="w-8 h-8 object-contain rounded-[4px] border border-[#2b292d] p-0.5 bg-[#1a191b]"
        />
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-sans font-medium uppercase tracking-[-0.025em] text-xs text-[#e5e5e5] leading-none">TRIADIX</h2>
            <span className="w-1.5 h-1.5 rounded-full bg-[#71d083] shadow-[0_0_6px_#71d083]"></span>
          </div>
          <span className="text-[9px] text-[#71d083] tracking-[0.025em] font-mono uppercase block mt-1">Consola Staff</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        {links.map((link, idx) => (
          <NavLink
            key={idx}
            to={link.path}
            end={link.path === '/barber' || link.path === '/admin'}
            className={({ isActive }) =>
              `flex items-center px-3.5 py-2.5 rounded-[6px] text-xs font-sans uppercase tracking-[0.025em] transition-all duration-150 ${
                isActive
                  ? 'bg-[#1a191b] border border-[#2d5736] text-[#71d083] font-medium shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]'
                  : 'text-[#7c7a85] hover:text-[#eeeef0] hover:bg-[#1a191b]/60 border border-transparent'
              }`
            }
          >
            <link.icon className="w-4 h-4 mr-3 flex-shrink-0" />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Area - User info & Logout */}
      <div className="p-3 border-t border-[#2b292d] flex flex-col gap-2">
        <button 
          onClick={handleLogout}
          className="flex items-center px-3.5 py-2.5 rounded-[6px] text-xs font-sans uppercase tracking-[0.025em] text-rose-400/90 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors w-full text-left cursor-pointer"
        >
          <LogOut className="w-4 h-4 mr-3 flex-shrink-0" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}

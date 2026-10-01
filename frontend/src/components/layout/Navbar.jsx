import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Bell, LogOut, Calendar, Settings, LayoutDashboard, Sparkles, MessageCircle, MapPin, ArrowRight } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useAppStore from '../../store/useAppStore';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isAuthenticated, logout, isAdmin, isBarber } = useAuthStore();
  const { unreadCount } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  const getDashboardLink = () => {
    if (isAdmin()) return '/admin';
    if (isBarber()) return '/barber';
    return '/cliente';
  };

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setIsOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `#${targetId}`);
      }
    } else {
      navigate(`/#${targetId}`);
    }
  };

  const isStaff = isAuthenticated && (isBarber() || isAdmin());
  const navLinks = [
    { label: 'Cortes & Servicios', targetId: 'servicios', path: '/#servicios' },
    { label: 'Bebidas', targetId: 'bebidas', path: '/#bebidas' },
    ...(!isStaff ? [{ label: 'Reservar Cita', targetId: 'reservar', path: '/#reservar' }] : []),
    { label: 'Los Barberos', targetId: 'barberos', path: '/#barberos' },
    { label: 'Opiniones', targetId: 'resenas', path: '/#resenas' },
    { label: 'Ubicación', targetId: 'ubicacion', path: '/#ubicacion' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      {/* Top Utility Announcement Bar — Clean Barbershop Info */}
      <div className="bg-[#0a0a0a] text-[#888888] text-[11px] font-sans py-2 px-4 sm:px-8 border-b border-[#1e1e1e]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          {/* Location / Presence */}
          <div className="flex items-center gap-2 text-[#cccccc]">
            <MapPin size={11} className="text-[#cfa53b] shrink-0" />
            <span className="font-mono uppercase tracking-wider text-[11px]">
              Barbería Triadix · Cali, Colombia
            </span>
          </div>

          {/* Schedule & WhatsApp */}
          <div className="flex items-center gap-5">
            <span className="hidden md:inline font-mono uppercase tracking-wider text-[10px] text-[#888888]">
              Lun-Sáb 09:00 - 20:30 · Dom 09:00 - 16:00
            </span>
            <a
              href="https://wa.me/573122398964?text=Hola,%20me%20gustar%C3%ADa%20agendar%20una%20cita%20en%20Barber%C3%ADa%20Triadix"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-mono text-[11px] text-[#ffffff] hover:text-[#cfa53b] transition-colors"
            >
              <MessageCircle size={11} className="text-[#25D366] shrink-0" />
              <span>WhatsApp: 312 239 8964</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-black/90 backdrop-blur-md border-b border-[#1e1e1e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 py-2">
            {/* Logo Brand */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="Barbería Triadix"
                  className="w-10 h-10 object-contain rounded-none border border-[#222222] group-hover:border-[#cfa53b] transition-all duration-300 p-0.5 bg-black"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-sans uppercase font-bold text-lg text-white tracking-[0.24em] leading-none group-hover:text-[#cfa53b] transition-colors">
                  Triadix
                </span>
                <span className="text-[9px] text-[#cfa53b] font-sans tracking-[0.24em] uppercase font-medium mt-1">
                  Barbería · Cali
                </span>
              </div>
            </Link>

            {/* Desktop Nav — Ferrari Uppercase Spaced Register */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <a
                  key={link.targetId}
                  href={`#${link.targetId}`}
                  onClick={(e) => handleNavClick(e, link.targetId)}
                  className={`px-3.5 py-2 rounded-none text-xs uppercase tracking-[0.2em] font-sans font-medium transition-colors cursor-pointer ${
                    location.pathname === '/' && location.hash === `#${link.targetId}`
                      ? 'text-white'
                      : 'text-[#888888] hover:text-white'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <button 
                    className="relative p-2 text-[#888888] hover:text-white rounded-none transition-all cursor-pointer"
                    aria-label="Notificaciones"
                  >
                    <Bell size={16} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-white text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* User Profile Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2.5 p-1.5 rounded-none border border-[#222222] hover:border-white/40 bg-[#0d0d0d] transition-all cursor-pointer"
                    >
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-none object-cover" />
                      ) : (
                        <div className="w-6 h-6 bg-[#171717] border border-[#333333] rounded-none flex items-center justify-center">
                          <span className="text-white text-xs font-medium font-sans">
                            {user?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="hidden md:block text-left pr-1">
                        <p className="text-xs font-medium text-white leading-none font-sans uppercase tracking-wider">{user?.name?.split(' ')[0]}</p>
                        <p className="text-[9px] text-[#888888] uppercase tracking-wider leading-none mt-1 font-sans">{user?.role}</p>
                      </div>
                    </button>

                    <AnimatePresence>
                      {showUserMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          className="absolute right-0 mt-2 w-56 bg-[#0a0a0a] border border-[#222222] rounded-none shadow-2xl overflow-hidden z-50"
                        >
                          <div className="p-3 border-b border-[#1e1e1e]">
                            <p className="font-sans font-medium text-white text-xs uppercase tracking-wider leading-tight">{user?.name}</p>
                            <p className="text-[11px] text-[#888888] font-mono truncate mt-0.5">{user?.email}</p>
                          </div>
                          <div className="p-1 space-y-0.5 font-sans">
                            <Link
                              to={getDashboardLink()}
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs uppercase tracking-wider text-[#888888] hover:text-white hover:bg-white/5 transition-all"
                            >
                              <LayoutDashboard size={14} />
                              Panel Principal
                            </Link>
                            <Link
                              to={`${getDashboardLink()}/perfil`}
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs uppercase tracking-wider text-[#888888] hover:text-white hover:bg-white/5 transition-all"
                            >
                              <Settings size={14} />
                              Ajustes
                            </Link>
                          </div>
                          <div className="p-1 border-t border-[#1e1e1e]">
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs uppercase tracking-wider font-sans text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all cursor-pointer text-left"
                            >
                              <LogOut size={14} />
                              Cerrar Sesión
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <Link 
                    to="/login" 
                    className="font-sans text-xs uppercase tracking-[0.2em] font-medium text-[#888888] hover:text-white transition-colors"
                  >
                    Ingresar
                  </Link>
                  <a 
                    href="#reservar" 
                    onClick={(e) => handleNavClick(e, 'reservar')}
                    className="bg-white hover:bg-[#e5e5e5] text-black font-sans font-medium uppercase tracking-[0.2em] text-xs px-4 py-2 rounded-none transition-all inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Reservar</span>
                    <ArrowRight size={12} />
                  </a>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 text-[#888888] hover:text-white rounded-none cursor-pointer"
                aria-label="Menú principal"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#0a0a0a] border-b border-[#1e1e1e] overflow-hidden"
          >
            <div className="px-4 py-6 space-y-3 font-sans">
              {navLinks.map((link) => (
                <a
                  key={link.targetId}
                  href={`#${link.targetId}`}
                  onClick={(e) => handleNavClick(e, link.targetId)}
                  className="block text-xs uppercase tracking-[0.2em] text-[#888888] hover:text-white py-2 cursor-pointer"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 border-t border-[#1e1e1e]">
                <a
                  href="#reservar"
                  onClick={(e) => handleNavClick(e, 'reservar')}
                  className="w-full bg-white text-black font-medium text-xs uppercase tracking-[0.2em] py-3 px-4 rounded-none flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Reservar Cita</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
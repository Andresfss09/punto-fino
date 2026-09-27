import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Bell, LogOut, Calendar, Settings, LayoutDashboard, MapPin, Phone } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useAppStore from '../../store/useAppStore';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout, isAdmin, isBarber } = useAuthStore();
  const { unreadCount } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const isStaff = isAuthenticated && (isBarber() || isAdmin());
  const navLinks = [
    { label: 'EXPERIENCIAS', path: '/#servicios' },
    { label: 'BARBEROS', path: '/#barberos' },
    { label: 'RESEÑAS', path: '/#testimonios' },
    { label: 'UBICACIÓN', path: '/#ubicacion' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300">
      {/* Top Utility Announcement Bar — Ferrari Minimalist Spec */}
      <div className="bg-[#050505] text-[#888888] text-[10px] sm:text-[11px] font-display uppercase tracking-[2px] py-1.5 px-4 text-center border-b border-[#1a1a1a] flex items-center justify-between sm:justify-center gap-4">
        <span className="truncate">
          PUNTO FINO · CRA 12 #53-51, VILLACOLOMBIA, CALI
        </span>
        <span className="hidden md:inline text-[#333333]">/</span>
        <span className="hidden md:inline text-white/90">
          WHATSAPP: +57 312 239 8964
        </span>
        <span className="hidden lg:inline text-[#333333]">/</span>
        <span className="hidden lg:inline text-[#888888]">
          LUN-SÁB 09:00 - 20:30 · DOM 09:00 - 16:00
        </span>
      </div>

      {/* Main Navigation Bar */}
      <div 
        className={`transition-all duration-300 ${
          scrolled 
            ? 'bg-black/95 backdrop-blur-md border-b border-[#222222] shadow-2xl py-3' 
            : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo Brand */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="Punto Fino"
                  className="w-10 h-10 object-contain invert contrast-150 transition-opacity group-hover:opacity-80"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-medium text-lg sm:text-xl text-white tracking-[3px] uppercase leading-none">
                  PUNTO FINO
                </span>
                <span className="text-[9px] text-[#888888] font-display tracking-[3px] uppercase font-normal mt-1">
                  CALI · ATELIER
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  className="text-xs font-display font-normal uppercase tracking-[2px] text-white/80 hover:text-white transition-colors duration-200 py-1 border-b border-transparent hover:border-white/60"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <button 
                    className="relative p-2 text-[#888888] hover:text-white transition-colors rounded-none cursor-pointer"
                    aria-label="Notificaciones"
                  >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                    )}
                  </button>

                  {/* User Profile Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2.5 p-1.5 border border-[#333333] hover:border-white bg-[#111111] transition-all cursor-pointer rounded-none"
                    >
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-7 h-7 object-cover rounded-none" />
                      ) : (
                        <div className="w-7 h-7 bg-black border border-[#333333] flex items-center justify-center rounded-none">
                          <span className="text-white text-xs font-display font-medium">
                            {user?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="hidden md:block text-left pr-1">
                        <p className="text-xs font-medium text-white leading-none font-display uppercase tracking-wider">{user?.name?.split(' ')[0]}</p>
                        <p className="text-[9px] text-[#888888] uppercase tracking-widest leading-none mt-1 font-display">{user?.role}</p>
                      </div>
                    </button>

                    <AnimatePresence>
                      {showUserMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          className="absolute right-0 mt-2 w-56 bg-[#111111] border border-[#262626] rounded-none shadow-2xl overflow-hidden z-50"
                        >
                          <div className="p-4 border-b border-[#222222]">
                            <p className="font-display font-medium text-white text-sm uppercase tracking-wider">{user?.name}</p>
                            <p className="text-xs text-[#888888] truncate mt-0.5">{user?.email}</p>
                          </div>
                          <div className="p-2 space-y-1">
                            <Link
                              to={getDashboardLink()}
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-display uppercase tracking-[1.5px] text-[#888888] hover:text-white hover:bg-white/5 transition-all"
                            >
                              <LayoutDashboard size={14} />
                              PANEL PRINCIPAL
                            </Link>
                            {isBarber() ? (
                              <Link
                                to="/barber/agenda"
                                onClick={() => setShowUserMenu(false)}
                                className="flex items-center gap-2.5 px-3 py-2 text-xs font-display uppercase tracking-[1.5px] text-[#888888] hover:text-white hover:bg-white/5 transition-all"
                              >
                                <Calendar size={14} />
                                MI AGENDA
                              </Link>
                            ) : isAdmin() ? (
                              <Link
                                to="/admin/citas"
                                onClick={() => setShowUserMenu(false)}
                                className="flex items-center gap-2.5 px-3 py-2 text-xs font-display uppercase tracking-[1.5px] text-[#888888] hover:text-white hover:bg-white/5 transition-all"
                              >
                                <Calendar size={14} />
                                GESTIÓN DE CITAS
                              </Link>
                            ) : (
                              <Link
                                to="/reservar"
                                onClick={() => setShowUserMenu(false)}
                                className="flex items-center gap-2.5 px-3 py-2 text-xs font-display uppercase tracking-[1.5px] text-[#888888] hover:text-white hover:bg-white/5 transition-all"
                              >
                                <Calendar size={14} />
                                NUEVA CITA
                              </Link>
                            )}
                            <Link
                              to={`${getDashboardLink()}/perfil`}
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-display uppercase tracking-[1.5px] text-[#888888] hover:text-white hover:bg-white/5 transition-all"
                            >
                              <Settings size={14} />
                              AJUSTES
                            </Link>
                          </div>
                          <div className="p-2 border-t border-[#222222]">
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-display uppercase tracking-[1.5px] text-primary hover:bg-white/5 transition-all cursor-pointer text-left"
                            >
                              <LogOut size={14} />
                              CERRAR SESIÓN
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
                    className="font-display text-xs uppercase tracking-[2px] text-[#888888] hover:text-white transition-colors hidden sm:inline-block"
                  >
                    INGRESAR
                  </Link>
                  <a 
                    href="#reservar" 
                    className="border border-white hover:bg-white hover:text-black text-white font-display text-xs uppercase tracking-[2px] font-medium px-4 py-2 sm:px-5 sm:py-2.5 rounded-none transition-all duration-200 cursor-pointer inline-flex items-center justify-center"
                  >
                    RESERVAR CITA
                  </a>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 text-white/80 hover:text-white transition-colors cursor-pointer"
                aria-label="Abrir menú"
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0a0a0a] border-b border-[#222222] overflow-hidden"
          >
            <div className="px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block text-xs uppercase font-display tracking-[3px] text-white/80 hover:text-white py-2 border-b border-[#1a1a1a]"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 flex flex-col gap-3">
                <a
                  href="#reservar"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center border border-white hover:bg-white hover:text-black text-white font-display text-xs uppercase tracking-[2px] py-3 rounded-none transition-all"
                >
                  RESERVAR CITA EN LÍNEA
                </a>
                {!isAuthenticated ? (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center text-[#888888] hover:text-white font-display text-xs uppercase tracking-[2px] py-2 transition-all"
                  >
                    INGRESAR A TU CUENTA
                  </Link>
                ) : (
                  <Link
                    to={getDashboardLink()}
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center text-white/90 hover:text-white font-display text-xs uppercase tracking-[2px] py-2 transition-all border border-[#333333]"
                  >
                    IR AL PANEL PRINCIPAL
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
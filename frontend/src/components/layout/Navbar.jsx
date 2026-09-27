import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Bell, LogOut, Calendar, Settings, LayoutDashboard, Sparkles, MessageCircle, MapPin, Phone } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useAppStore from '../../store/useAppStore';
import Badge from '../ui/Badge';

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

  const isStaff = isAuthenticated && (isBarber() || isAdmin());
  const navLinks = [
    { label: 'Inicio', path: '/' },
    { label: 'Servicios & Experiencias', path: '/#servicios' },
    ...(!isStaff ? [{ label: 'Reservar Cita', path: '/#reservar' }] : []),
    { label: 'Maestros Barberos', path: '/#barberos' },
    { label: 'Sede & Contacto', path: '/#ubicacion' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      {/* Top Utility Announcement Bar — High Visibility Location & WhatsApp */}
      <div className="bg-[#121815] text-[#dfdbca] text-[11px] sm:text-xs font-sans py-2 px-3 sm:px-6 border-b border-[#1f2723]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          {/* Address with MapPin */}
          <a
            href="https://maps.google.com/?q=Cra.+12+%2353-51,+Villacolombia,+Cali"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <MapPin size={12} className="text-gold-400 shrink-0" />
            <span className="font-medium tracking-wide">
              Cra. 12 #53-51, Villacolombia, Cali
            </span>
          </a>

          {/* WhatsApp Direct Line */}
          <div className="flex items-center gap-4">
            <span className="hidden md:inline font-sans text-[11px] text-[#808080]">
              Lun-Sáb 8:00–20:30 · Dom 9:00–16:00
            </span>
            <a
              href="https://wa.me/573122398964?text=Hola,%20me%20gustar%C3%ADa%20agendar%20una%20cita%20en%20Punto%20Fino"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-mono text-[#25D366] hover:text-white font-semibold transition-colors bg-[#19231d] px-2.5 py-0.5 rounded-[3px] border border-[#2b3a30]"
            >
              <MessageCircle size={12} className="text-[#25D366] shrink-0" />
              <span>WhatsApp: 312 239 8964</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-[#0e1311]/95 backdrop-blur-md border-b border-[#1f2723]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-3">
            {/* Logo Brand */}
            <Link to="/" className="flex items-center gap-3.5 group">
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="Punto Fino Barbería"
                  className="w-11 h-11 object-contain rounded-[4px] border border-[#26302a] group-hover:border-gold-400/60 transition-all duration-300 shadow-sm"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif italic text-2xl text-white tracking-tight leading-none group-hover:text-gold-300 transition-colors">
                  Punto Fino
                </span>
                <span className="text-[10px] text-gold-400 font-sans tracking-[0.25em] uppercase font-medium mt-1">
                  Barbería de Autor · Cali
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-1.5 rounded-[4px] text-xs uppercase tracking-wider font-sans font-medium transition-all ${
                    location.pathname === link.path
                      ? 'text-white border-b-2 border-gold-400'
                      : 'text-[#b3b3b3] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <button 
                    className="relative p-2 text-[#b3b3b3] hover:text-white hover:bg-white/5 rounded-[4px] transition-all cursor-pointer"
                    aria-label="Notificaciones"
                  >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-gold-400 text-[#0e1311] text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* User Profile Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2.5 p-1.5 rounded-[4px] border border-[#26302a] hover:border-gold-400/50 bg-[#121815] transition-all cursor-pointer"
                    >
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-[4px] object-cover" />
                      ) : (
                        <div className="w-7 h-7 bg-[#1c2420] border border-gold-400/40 rounded-[4px] flex items-center justify-center">
                          <span className="text-gold-400 text-xs font-bold font-sans">
                            {user?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="hidden md:block text-left pr-1">
                        <p className="text-xs font-medium text-white leading-none font-sans">{user?.name?.split(' ')[0]}</p>
                        <p className="text-[10px] text-gold-400 capitalize leading-none mt-1 font-sans">{user?.role}</p>
                      </div>
                    </button>

                    <AnimatePresence>
                      {showUserMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.98 }}
                          className="absolute right-0 mt-2 w-56 bg-[#121815] border border-[#2b3530] rounded-[4px] shadow-lg overflow-hidden z-50"
                        >
                          <div className="p-3 border-b border-[#222a26]">
                            <p className="font-serif italic text-white text-base leading-tight">{user?.name}</p>
                            <p className="text-xs text-[#b3b3b3] truncate mt-0.5">{user?.email}</p>
                            {user?.loyaltyPoints > 0 && (
                              <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#19221d] border border-gold-400/30 text-gold-400 text-[11px] rounded-[4px]">
                                <Sparkles size={11} /> {user.loyaltyPoints} puntos de fidelidad
                              </div>
                            )}
                          </div>
                          <div className="p-1 space-y-0.5">
                            <Link
                              to={getDashboardLink()}
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-sans text-[#b3b3b3] hover:text-white hover:bg-white/5 rounded-[4px] transition-all"
                            >
                              <LayoutDashboard size={15} />
                              Panel Principal
                            </Link>
                            {isBarber() ? (
                              <Link
                                to="/barber/agenda"
                                onClick={() => setShowUserMenu(false)}
                                className="flex items-center gap-2.5 px-3 py-2 text-xs font-sans text-[#b3b3b3] hover:text-white hover:bg-white/5 rounded-[4px] transition-all"
                              >
                                <Calendar size={15} />
                                Mi Agenda
                              </Link>
                            ) : isAdmin() ? (
                              <Link
                                to="/admin/citas"
                                onClick={() => setShowUserMenu(false)}
                                className="flex items-center gap-2.5 px-3 py-2 text-xs font-sans text-[#b3b3b3] hover:text-white hover:bg-white/5 rounded-[4px] transition-all"
                              >
                                <Calendar size={15} />
                                Gestión de Citas
                              </Link>
                            ) : (
                              <Link
                                to="/reservar"
                                onClick={() => setShowUserMenu(false)}
                                className="flex items-center gap-2.5 px-3 py-2 text-xs font-sans text-[#b3b3b3] hover:text-white hover:bg-white/5 rounded-[4px] transition-all"
                              >
                                <Calendar size={15} />
                                Nueva Cita
                              </Link>
                            )}
                            <Link
                              to={`${getDashboardLink()}/perfil`}
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-sans text-[#b3b3b3] hover:text-white hover:bg-white/5 rounded-[4px] transition-all"
                            >
                              <Settings size={15} />
                              {isBarber() ? 'Mi Perfil de Barbero' : 'Ajustes'}
                            </Link>
                          </div>
                          <div className="p-1 border-t border-[#222a26]">
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-sans text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-[4px] transition-all cursor-pointer"
                            >
                              <LogOut size={15} />
                              Cerrar Sesión
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2.5">
                  <a
                    href="https://wa.me/573122398964?text=Hola,%20me%20gustar%C3%ADa%20agendar%20una%20cita%20en%20Punto%20Fino"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-[#2b3a30] hover:border-[#25D366]/60 bg-[#121815] text-[#25D366] hover:bg-[#16201b] font-mono text-xs font-medium transition-all"
                    title="Chatear con Punto Fino por WhatsApp"
                  >
                    <MessageCircle size={13} className="text-[#25D366]" />
                    <span>312 239 8964</span>
                  </a>
                  <Link 
                    to="/login" 
                    className="font-sans text-xs uppercase tracking-wider text-[#b3b3b3] hover:text-white px-3 py-2 transition-colors"
                  >
                    Ingresar
                  </Link>
                  <Link 
                    to="/reservar" 
                    className="price-pill hover:bg-white transition-all transform hover:scale-[1.02]"
                  >
                    Agendar Cita
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 text-[#b3b3b3] hover:text-white hover:bg-white/5 rounded-[4px] transition-all cursor-pointer"
                aria-label="Abrir menú"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
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
            className="md:hidden bg-[#0e1311] border-b border-[#222a26]"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2.5 rounded-[4px] text-xs uppercase tracking-wider text-[#b3b3b3] hover:text-white hover:bg-white/5 transition-all"
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && (
                <Link
                  to={getDashboardLink()}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2.5 rounded-[4px] text-xs uppercase tracking-wider text-gold-400 font-medium hover:bg-white/5 transition-all border-t border-[#222a26] mt-1 pt-3"
                >
                  Ir al Panel ({isBarber() ? 'Barbero' : isAdmin() ? 'Administrador' : 'Cliente'})
                </Link>
              )}

              {/* Mobile Contact Quick Card */}
              <div className="mt-3 p-3.5 bg-[#121815] border border-[#2b3530] rounded-[4px] space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-[#dfdbca]">
                  <MapPin size={13} className="text-gold-400 shrink-0" />
                  <span>Cra. 12 #53-51, Villacolombia, Cali</span>
                </div>
                <a
                  href="https://wa.me/573122398964?text=Hola,%20me%20gustar%C3%ADa%20agendar%20una%20cita%20en%20Punto%20Fino"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#19231d] hover:bg-[#202d25] border border-[#25D366]/50 text-[#25D366] py-2 px-3 rounded-[4px] font-mono text-xs font-semibold transition-all"
                >
                  <MessageCircle size={14} />
                  <span>WhatsApp: 312 239 8964</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
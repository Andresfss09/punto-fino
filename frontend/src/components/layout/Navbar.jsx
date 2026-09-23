import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Scissors, Bell, User, LogOut, Calendar, Settings, LayoutDashboard } from 'lucide-react';
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

  const navLinks = [
    { label: 'Inicio', path: '/' },
    { label: 'Servicios', path: '/#servicios' },
    { label: 'Barberos', path: '/#barberos' },
    { label: 'Reservar', path: '/reservar' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40">
      <div className="bg-dark-300/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="Steel House Barberia's"
                className="w-10 h-10 object-contain rounded-full border border-gold-500/30 group-hover:scale-105 group-hover:border-gold-500 transition-all duration-300"
              />
              <div className="flex flex-col">
                <span className="font-display text-lg font-bold text-white tracking-wide leading-none group-hover:text-gold-400 transition-colors">
                  Steel House
                </span>
                <span className="text-[10px] text-gold-500 tracking-[0.25em] uppercase font-semibold mt-1">
                  BARBERIA'S 👑
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? 'text-gold-400 bg-gold-500/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  {/* Notificaciones */}
                  <button className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-gold-500 text-black text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-all"
                    >
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-lg object-cover" />
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-br from-gold-500 to-gold-700 rounded-lg flex items-center justify-center">
                          <span className="text-black text-sm font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="hidden md:block text-left">
                        <p className="text-sm font-medium text-white leading-none">{user?.name?.split(' ')[0]}</p>
                        <p className="text-xs text-gold-500 capitalize leading-none mt-0.5">{user?.role}</p>
                      </div>
                    </button>

                    <AnimatePresence>
                      {showUserMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-2 w-56 bg-dark-100 border border-white/10 rounded-xl shadow-xl overflow-hidden"
                        >
                          <div className="p-3 border-b border-white/5">
                            <p className="font-medium text-white text-sm">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            {user?.loyaltyPoints > 0 && (
                              <Badge variant="gold" className="mt-1.5">
                                ⭐ {user.loyaltyPoints} puntos
                              </Badge>
                            )}
                          </div>
                          <div className="p-1">
                            <Link
                              to={getDashboardLink()}
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                            >
                              <LayoutDashboard size={16} />
                              Dashboard
                            </Link>
                            <Link
                              to="/reservar"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                            >
                              <Calendar size={16} />
                              Nueva cita
                            </Link>
                            <Link
                              to={`${getDashboardLink()}/perfil`}
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                            >
                              <Settings size={16} />
                              Configuración
                            </Link>
                          </div>
                          <div className="p-1 border-t border-white/5">
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                            >
                              <LogOut size={16} />
                              Cerrar sesión
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="btn-ghost text-sm">Iniciar sesión</Link>
                  <Link to="/register" className="btn-primary text-sm py-2 px-4">Registrarse</Link>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark-200 border-b border-white/5"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
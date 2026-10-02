import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomBar from './BottomBar';
import { Bell, User, Check, X, Calendar, DollarSign, Scissors, ShieldAlert, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import useAuthStore from '../../store/useAuthStore';

export default function DashboardLayout() {
  const { user } = useAuthStore();
  const location = useLocation();

  // Notification system state
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const [notifications, setNotifications] = useState(() => {
    if (user?.role === 'admin') {
      return [
        {
          id: 1,
          icon: Scissors,
          title: 'Cita completada hoy',
          desc: 'Nicolás Chávez completó un Corte Fade Clásico.',
          time: 'Hace 15m',
          read: false,
          amount: '$35.000',
        },
        {
          id: 2,
          icon: DollarSign,
          title: 'Liquidación al día',
          desc: 'Se totalizaron 9 citas en nómina con $250.000 de ingresos.',
          time: 'Hace 45m',
          read: false,
          amount: '$125.000',
        },
        {
          id: 3,
          icon: Calendar,
          title: 'Disponibilidad activa',
          desc: 'Personal de barbería con agenda sincronizada.',
          time: 'Hace 2h',
          read: true,
        },
        {
          id: 4,
          icon: Sparkles,
          title: 'Sistema en línea',
          desc: 'Motor Supabase y MongoDB conectados sin incidencias.',
          time: 'Hace 4h',
          read: true,
        },
      ];
    } else {
      return [
        {
          id: 1,
          icon: Calendar,
          title: 'Próxima cita asignada',
          desc: 'Cliente: Andrés Pastrana (Corte + Barba Express).',
          time: 'Hace 10m',
          read: false,
          amount: '$45.000',
        },
        {
          id: 2,
          icon: DollarSign,
          title: 'Comisión acreditada',
          desc: 'Acumulado de comisiones hoy: $125.000 COP.',
          time: 'Hace 1h',
          read: false,
        },
        {
          id: 3,
          icon: Sparkles,
          title: 'Calificación 5.0 ★',
          desc: 'Excelente valoración recibida en el servicio de hoy.',
          time: 'Hace 3h',
          read: true,
        },
      ];
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id, e) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  // Page title generator based on path
  const getPageTitle = (path) => {
    const parts = path.split('/').filter(Boolean);
    if (parts.length === 1) {
      if (parts[0] === 'admin') return 'NÓMINA & CONTROL GENERAL';
      if (parts[0] === 'barber') return 'PANEL DEL BARBERO';
      return 'PANEL';
    }
    const lastPart = parts[parts.length - 1];
    switch (lastPart) {
      case 'citas': return 'GESTIÓN DE CITAS';
      case 'agenda': return 'AGENDA & HORARIOS';
      case 'servicios': return 'CATÁLOGO DE SERVICIOS';
      case 'barberos': return 'STAFF DE BARBEROS';
      case 'usuarios': return 'CONTROL DE USUARIOS';
      case 'perfil': return 'MI PERFIL';
      default: return lastPart.toUpperCase();
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'ADMINISTRADOR';
      case 'barbero': return 'MAESTRO BARBERO';
      default: return 'STAFF';
    }
  };

  return (
    <div className="min-h-screen bg-[#04040b] text-[#eeeef0] flex flex-col md:flex-row antialiased selection:bg-[#71d083] selection:text-[#04040b]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header — Depot Graphite */}
        <header className="h-16 border-b border-[#2b292d] bg-[#121113]/95 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30 flex-shrink-0 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
          <div className="flex items-center gap-3 truncate mr-4">
            <span className="w-2 h-2 rounded-full bg-[#71d083] shadow-[0_0_8px_#71d083] flex-shrink-0"></span>
            <h1 className="text-xs sm:text-sm font-sans font-medium uppercase tracking-[-0.025em] text-[#e5e5e5] truncate">
              {getPageTitle(location.pathname)}
            </h1>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.025em] rounded-[2px] border border-[#2d5736] bg-[#1b2a1e] text-[#71d083]">
              {getRoleLabel(user?.role)}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Interactive Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(prev => !prev)}
                className={`relative p-2 rounded-[6px] border transition-colors cursor-pointer ${
                  showNotifications 
                    ? 'bg-[#1a191b] border-[#71d083]/40 text-[#eeeef0]' 
                    : 'bg-[#1a191b]/50 border-[#2b292d] text-[#7c7a85] hover:text-[#eeeef0] hover:border-[#3c393f] hover:bg-[#1a191b]'
                }`}
                title="Notificaciones"
                aria-label="Abrir panel de notificaciones"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#71d083] text-[#04040b] font-mono text-[9px] font-bold shadow-[0_0_8px_#71d083]">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Popover Drawer */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#121113] border border-[#2b292d] rounded-[6px] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] z-50 overflow-hidden"
                  >
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-[#2b292d] bg-[#1a191b] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#71d083] shadow-[0_0_6px_#71d083]"></span>
                        <span className="text-xs font-sans font-medium uppercase tracking-[-0.025em] text-[#e5e5e5]">
                          NOTIFICACIONES
                        </span>
                        {unreadCount > 0 && (
                          <span className="px-1.5 py-0.2 rounded-[2px] bg-[#1b2a1e] border border-[#2d5736] text-[#71d083] font-mono text-[10px]">
                            {unreadCount} nuevas
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-[11px] font-sans text-[#71d083] hover:underline cursor-pointer tracking-[0.025em]"
                        >
                          Marcar leídas
                        </button>
                      )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-80 overflow-y-auto divide-y divide-[#2b292d]/60">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-[#7c7a85] text-xs">
                          No tienes notificaciones pendientes
                        </div>
                      ) : (
                        notifications.map((item) => {
                          const IconComp = item.icon || Bell;
                          return (
                            <div
                              key={item.id}
                              onClick={() => {
                                setNotifications(prev =>
                                  prev.map(n => n.id === item.id ? { ...n, read: true } : n)
                                );
                              }}
                              className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                                item.read
                                  ? 'bg-transparent hover:bg-[#1a191b]/40 text-[#7c7a85]'
                                  : 'bg-[#1a191b]/80 hover:bg-[#1a191b] text-[#eeeef0]'
                              }`}
                            >
                              <div className={`p-2 rounded-[4px] border flex-shrink-0 ${
                                item.read
                                  ? 'bg-[#121113] border-[#2b292d] text-[#7c7a85]'
                                  : 'bg-[#1b2a1e] border-[#2d5736] text-[#71d083]'
                              }`}>
                                <IconComp className="w-3.5 h-3.5" />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <p className={`text-xs font-sans truncate ${item.read ? 'text-[#b5b2bc]' : 'text-[#e5e5e5] font-medium'}`}>
                                    {item.title}
                                  </p>
                                  {item.amount && (
                                    <span className="font-mono text-[11px] text-[#71d083] flex-shrink-0">
                                      {item.amount}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-[#7c7a85] mt-0.5 line-clamp-2 leading-relaxed">
                                  {item.desc}
                                </p>
                                <div className="flex items-center justify-between mt-1.5">
                                  <span className="font-mono text-[10px] text-[#7c7a85]">
                                    {item.time}
                                  </span>
                                  {!item.read && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#71d083]"></span>
                                  )}
                                </div>
                              </div>

                              <button
                                onClick={(e) => removeNotification(item.id, e)}
                                className="text-[#7c7a85] hover:text-[#eeeef0] p-1 rounded hover:bg-[#232225] transition-colors"
                                title="Eliminar notificación"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-2 border-t border-[#2b292d] bg-[#1a191b]/60 flex items-center justify-between text-[10px] text-[#7c7a85] font-mono">
                      <span>CONSOLA TRIADIX</span>
                      <span className="text-[#71d083]">● EN VIVO</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Profile Info */}
            <div className="flex items-center gap-3 pl-4 border-l border-[#2b292d]">
              <div className="hidden sm:block text-right">
                <div className="text-xs font-sans font-medium text-[#e5e5e5] uppercase tracking-[0.025em] truncate max-w-[150px]">
                  {user?.name || user?.nombre || 'Usuario'}
                </div>
                <div className="text-[10px] text-[#71d083] uppercase tracking-[0.025em] font-mono">
                  {user?.role || 'Staff'}
                </div>
              </div>
              <div className="w-8 h-8 rounded-[6px] bg-[#1a191b] border border-[#2b292d] flex items-center justify-center overflow-hidden text-[#e5e5e5] font-mono text-xs font-bold shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5 text-[#e5e5e5]" />}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area — Depot Carbon */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 bg-[#04040b]">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      <BottomBar />
    </div>
  );
}

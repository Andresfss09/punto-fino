import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomBar from './BottomBar';
import { Bell, User } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

export default function DashboardLayout() {
  const { user } = useAuthStore();
  const location = useLocation();

  // Simple title generator based on path
  const getPageTitle = (path) => {
    const parts = path.split('/').filter(Boolean);
    if (parts.length === 1) {
      if (parts[0] === 'admin') return 'Nómina & Control General';
      if (parts[0] === 'barber') return 'Panel del Barbero';
      if (parts[0] === 'cliente') return 'Mi Cuenta';
      return 'Dashboard';
    }
    const lastPart = parts[parts.length - 1];
    switch (lastPart) {
      case 'citas': return 'Gestión de Citas';
      case 'agenda': return 'Agenda & Horarios';
      case 'servicios': return 'Catálogo de Servicios';
      case 'barberos': return 'Staff de Barberos';
      case 'usuarios': return 'Control de Usuarios';
      case 'perfil': return 'Mi Perfil';
      default: return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'barbero': return 'Maestro Barbero';
      case 'cliente': return 'Cliente Distinguido';
      default: return 'Usuario';
    }
  };

  return (
    <div className="min-h-screen bg-[#0e1311] text-[#dfdbca] flex flex-col md:flex-row antialiased selection:bg-gold-400 selection:text-[#0e1311]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-[#1f2723] bg-[#0e1311]/95 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30 flex-shrink-0">
          <div className="flex items-center gap-3 truncate mr-4">
            <h1 className="text-xl sm:text-2xl font-serif italic text-white font-normal truncate">
              {getPageTitle(location.pathname)}
            </h1>
            <span className="hidden sm:inline-block editorial-tag bg-[#161d19] border-[#2b3530] text-gold-400">
              {getRoleLabel(user?.role)}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-[#b3b3b3] hover:text-white hover:bg-white/5 rounded-[4px] transition-colors cursor-pointer" title="Notificaciones">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-gold-400 rounded-full"></span>
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-[#1f2723]">
              <div className="hidden sm:block text-right">
                <div className="text-xs font-sans font-medium text-white truncate max-w-[150px]">
                  {user?.name || user?.nombre || 'Usuario'}
                </div>
                <div className="text-[10px] text-gold-400/90 uppercase tracking-wider font-mono">
                  {user?.role || 'Cliente'}
                </div>
              </div>
              <div className="w-8 h-8 rounded-[4px] bg-[#161d19] border border-[#2b3530] flex items-center justify-center overflow-hidden text-gold-400 font-serif italic text-sm font-bold">
                {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4 text-gold-400" />}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 bg-[#0e1311]">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      <BottomBar />
    </div>
  );
}

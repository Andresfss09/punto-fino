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
    <div className="min-h-screen bg-[#000000] text-[#ffffff] flex flex-col md:flex-row antialiased selection:bg-white selection:text-black">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-[#1e1e1e] bg-[#0a0a0a]/90 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30 flex-shrink-0">
          <div className="flex items-center gap-3 truncate mr-4">
            <h1 className="text-sm sm:text-base font-sans font-medium uppercase tracking-[0.16em] text-white truncate">
              {getPageTitle(location.pathname)}
            </h1>
            <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-[#141414] border border-[#262626] text-gold-400">
              {getRoleLabel(user?.role)}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-[#888888] hover:text-white hover:bg-white/5 rounded-none transition-colors cursor-pointer" title="Notificaciones">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-gold-400 rounded-full"></span>
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-[#1e1e1e]">
              <div className="hidden sm:block text-right">
                <div className="text-xs font-sans font-medium text-white uppercase tracking-wider truncate max-w-[150px]">
                  {user?.name || user?.nombre || 'Usuario'}
                </div>
                <div className="text-[10px] text-gold-400 uppercase tracking-widest font-mono">
                  {user?.role || 'Cliente'}
                </div>
              </div>
              <div className="w-8 h-8 rounded-none bg-[#141414] border border-[#262626] flex items-center justify-center overflow-hidden text-white font-mono text-xs font-bold">
                {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5 text-white" />}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 bg-[#000000]">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      <BottomBar />
    </div>
  );
}

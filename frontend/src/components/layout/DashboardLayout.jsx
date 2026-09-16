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
    if (parts.length === 1) return 'Dashboard';
    const lastPart = parts[parts.length - 1];
    return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col md:flex-row">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b-2 border-[#333] bg-[#111111] flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30 flex-shrink-0">
          <h1 className="text-xl font-display font-bold text-white truncate mr-4">
            {getPageTitle(location.pathname)}
          </h1>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-[#a0a0a0] hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#d4af37] rounded-full border-2 border-[#111111]"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l-2 border-[#333]">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium text-white">{user?.nombre || 'Usuario'}</div>
                <div className="text-xs text-[#a0a0a0] capitalize">{user?.role || 'Cliente'}</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#333] border-2 border-[#d4af37] flex items-center justify-center overflow-hidden">
                <User className="w-5 h-5 text-[#a0a0a0]" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      <BottomBar />
    </div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Scissors, Calendar, DollarSign, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import BrutalCard from '../../components/ui/BrutalCard';
import StatsCard from '../../components/ui/StatsCard';
import PageTransition from '../../components/ui/PageTransition';

export default function AdminDashboard() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const NAV_LINKS = [
    { to: '/admin/appointments', icon: Calendar, label: 'Citas', desc: 'Gestionar agenda global' },
    { to: '/admin/barbers', icon: Scissors, label: 'Barberos', desc: 'Personal y horarios' },
    { to: '/admin/services', icon: Activity, label: 'Servicios', desc: 'Precios y categorías' },
    { to: '/admin/users', icon: Users, label: 'Usuarios', desc: 'Clientes y roles' },
  ];

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <h1 className="text-3xl font-display font-bold uppercase tracking-wider">
            PANEL DE <span className="text-gold-500">ADMINISTRACIÓN</span>
          </h1>
          <p className="text-gray-400 font-mono-price mt-2">Resumen General del Sistema</p>
        </motion.div>

        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div variants={item}><StatsCard icon={Calendar} label="Citas Hoy" value={24} trend="+5%" /></motion.div>
          <motion.div variants={item}><StatsCard icon={DollarSign} label="Ingresos Mes" value={3500000} trend="+12%" className="border-gold-500" /></motion.div>
          <motion.div variants={item}><StatsCard icon={Scissors} label="Barberos Activos" value={5} /></motion.div>
          <motion.div variants={item}><StatsCard icon={Users} label="Clientes Totales" value={1250} trend="+15" /></motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-xl font-bold uppercase tracking-wider flex items-center gap-2">
              <Activity className="text-gold-500"/> Actividad Reciente
            </h2>
            <BrutalCard padding={false} className="divide-y-2 divide-dashed divide-[#333]">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-dark-200 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                    <div>
                      <p className="font-bold uppercase text-sm">Nueva Cita Programada</p>
                      <p className="text-xs text-gray-400 font-mono-price">Carlos M. con Juan Pérez</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono-price text-gray-500">Hace 5 min</span>
                </div>
              ))}
            </BrutalCard>
          </div>

          <div className="space-y-6">
             <h2 className="text-xl font-bold uppercase tracking-wider flex items-center gap-2">
              <Users className="text-gold-500"/> Accesos Rápidos
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
              {NAV_LINKS.map(link => (
                <Link key={link.to} to={link.to}>
                  <BrutalCard variant="interactive" className="h-full flex flex-col items-center text-center p-4">
                    <link.icon size={24} className="text-gold-500 mb-2" />
                    <h3 className="font-bold uppercase text-sm mb-1">{link.label}</h3>
                    <p className="text-[10px] text-gray-400 font-mono-price">{link.desc}</p>
                  </BrutalCard>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
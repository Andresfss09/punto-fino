import React from 'react';
import { motion } from 'framer-motion';
import { Users, CheckCircle, DollarSign, Clock, Play, Check } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import BrutalCard from '../../components/ui/BrutalCard';
import StatsCard from '../../components/ui/StatsCard';
import PageTransition from '../../components/ui/PageTransition';

export default function BarberDashboard() {
  const { user } = useAuth();

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const MOCK_APPOINTMENTS = [
    { id: 1, time: '09:00', client: 'Juan Pérez', service: 'Corte Clásico', status: 'completada' },
    { id: 2, time: '10:30', client: 'Carlos Gómez', service: 'Corte + Barba', status: 'en_progreso', isNext: true },
    { id: 3, time: '11:45', client: 'Andrés Silva', service: 'Diseño', status: 'pendiente' },
    { id: 4, time: '14:00', client: 'Luis Torres', service: 'Corte Clásico', status: 'pendiente' },
  ];

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl font-display font-bold uppercase tracking-wider">
              PANEL DE <span className="text-gold-500">BARBERO</span>
            </h1>
            <p className="text-gray-400 font-mono-price mt-2">{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </motion.div>
          <input type="date" className="brutal-input bg-dark-300 py-2" defaultValue={new Date().toISOString().split('T')[0]} />
        </div>

        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div variants={item}><StatsCard icon={Users} label="Citas Hoy" value={8} /></motion.div>
          <motion.div variants={item}><StatsCard icon={CheckCircle} label="Completadas" value={1} /></motion.div>
          <motion.div variants={item}><StatsCard icon={DollarSign} label="Ingresos (Hoy)" value={45000} className="border-gold-500" /></motion.div>
          <motion.div variants={item}><StatsCard icon={Clock} label="Pendientes" value={7} /></motion.div>
        </motion.div>

        <div className="mt-8">
          <h2 className="text-xl font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
            <Clock className="text-gold-500"/> Agenda del Día
          </h2>
          
          <div className="space-y-4">
            {MOCK_APPOINTMENTS.map(apt => (
              <BrutalCard 
                key={apt.id} 
                variant={apt.isNext ? 'gold' : 'default'}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-6 w-full sm:w-auto">
                  <div className="font-mono-price text-2xl font-bold text-gold-500">{apt.time}</div>
                  <div>
                    <h3 className="font-bold text-lg uppercase">{apt.client}</h3>
                    <p className="text-gray-400 text-sm">{apt.service}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <span className={`brutal-badge ${
                    apt.status === 'completada' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                    apt.status === 'en_progreso' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                    'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                  }`}>
                    {apt.status.replace('_', ' ')}
                  </span>
                  
                  <div className="flex gap-2">
                    {apt.status === 'pendiente' && (
                      <button className="brutal-btn bg-blue-500/20 text-blue-500 border-blue-500/50 p-2 hover:bg-blue-500/30" title="Iniciar">
                        <Play size={18} />
                      </button>
                    )}
                    {apt.status === 'en_progreso' && (
                      <button className="brutal-btn bg-green-500/20 text-green-500 border-green-500/50 p-2 hover:bg-green-500/30" title="Completar">
                        <Check size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </BrutalCard>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
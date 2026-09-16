import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, Clock, Star, History, CalendarPlus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import BrutalCard from '../../components/ui/BrutalCard';
import StatsCard from '../../components/ui/StatsCard';
import PageTransition from '../../components/ui/PageTransition';

export default function ClientDashboard() {
  const { user } = useAuth();
  
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <h1 className="text-4xl font-display font-bold uppercase tracking-wider">
            HOLA, <span className="text-gold-500">{user?.name?.split(' ')[0] || 'CLIENTE'}</span>
          </h1>
          <p className="text-gray-400 font-mono-price mt-2">Bienvenido de vuelta a Punto Fino</p>
        </motion.div>

        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div variants={item}><StatsCard icon={Calendar} label="Total Citas" value={12} /></motion.div>
          <motion.div variants={item}><StatsCard icon={Clock} label="Próximas" value={1} /></motion.div>
          <motion.div variants={item}><StatsCard icon={CheckCircle} label="Completadas" value={11} /></motion.div>
          <motion.div variants={item}><StatsCard icon={Star} label="Puntos" value={450} className="border-gold-500" /></motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <BrutalCard variant="gold" className="relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gold-500 text-dark-500 font-bold px-4 py-1 text-sm uppercase tracking-wider rounded-bl-[4px] border-l-2 border-b-2 border-dark-500">
                Próxima Cita
              </div>
              <h3 className="text-2xl font-bold uppercase mb-4 mt-2">Corte Clásico + Barba</h3>
              <div className="flex flex-col sm:flex-row gap-6 font-mono-price">
                <div>
                  <p className="text-gray-400 text-sm mb-1 uppercase font-sans font-bold">Fecha</p>
                  <p className="text-xl">15 Oct 2023</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1 uppercase font-sans font-bold">Hora</p>
                  <p className="text-xl">14:30</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1 uppercase font-sans font-bold">Barbero</p>
                  <p className="text-xl">Carlos M.</p>
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <button className="brutal-btn bg-dark-500 text-white border-white hover:bg-dark-400 px-6 py-2 uppercase font-bold text-sm">Modificar</button>
                <button className="brutal-btn bg-red-500/20 text-red-500 border-red-500 hover:bg-red-500/30 px-6 py-2 uppercase font-bold text-sm">Cancelar</button>
              </div>
            </BrutalCard>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <BrutalCard variant="interactive" className="flex items-center justify-between p-6 group">
                <div>
                  <h3 className="font-bold uppercase text-lg">Reservar Cita</h3>
                  <p className="text-gray-400 text-sm">Agenda tu próximo corte</p>
                </div>
                <div className="w-12 h-12 bg-gold-500 text-dark-500 rounded-full flex items-center justify-center border-2 border-dark-500 group-hover:scale-110 transition-transform">
                  <CalendarPlus size={24} />
                </div>
              </BrutalCard>
              <BrutalCard variant="interactive" className="flex items-center justify-between p-6 group">
                <div>
                  <h3 className="font-bold uppercase text-lg">Historial</h3>
                  <p className="text-gray-400 text-sm">Ver citas pasadas</p>
                </div>
                <div className="w-12 h-12 bg-dark-300 text-white rounded-full flex items-center justify-center border-2 border-[#333] group-hover:scale-110 transition-transform">
                  <History size={24} />
                </div>
              </BrutalCard>
            </div>
          </div>

          <div className="space-y-6">
            <BrutalCard padding={false}>
              <div className="p-4 bg-dark-300 border-b-2 border-[#333]">
                <h3 className="font-bold uppercase tracking-wider flex items-center gap-2"><Star size={18} className="text-gold-500"/> Fidelidad</h3>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm text-gray-400 uppercase font-bold">Nivel Plata</span>
                  <span className="font-mono-price text-gold-500 font-bold">450 / 500</span>
                </div>
                <div className="w-full h-4 bg-dark-200 border-2 border-[#333] rounded-full overflow-hidden">
                  <div className="h-full bg-gold-500 w-[90%] border-r-2 border-dark-500"></div>
                </div>
                <p className="text-xs text-gray-400 mt-3 text-center">Faltan 50 pts para Nivel Oro</p>
              </div>
            </BrutalCard>

            <BrutalCard padding={false}>
               <div className="p-4 bg-dark-300 border-b-2 border-[#333]">
                <h3 className="font-bold uppercase tracking-wider flex items-center gap-2"><History size={18}/> Recientes</h3>
              </div>
              <div className="divide-y-2 divide-dashed divide-[#333]">
                {[1, 2, 3].map(i => (
                  <div key={i} className="p-4 flex justify-between items-center hover:bg-dark-200 transition-colors cursor-pointer">
                    <div>
                      <p className="font-bold uppercase text-sm">Corte Clásico</p>
                      <p className="text-xs text-gray-400 font-mono-price mt-1">10 Sep • Carlos M.</p>
                    </div>
                    <span className="brutal-badge bg-green-500/10 text-green-500 border-green-500/20">Completada</span>
                  </div>
                ))}
              </div>
            </BrutalCard>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
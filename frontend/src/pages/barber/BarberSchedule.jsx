import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, subDays, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import PageTransition from '../../components/ui/PageTransition';
import { appointmentService } from '../../services/appointmentService';
import { barberService } from '../../services/barberService';
import useAuthStore from '../../store/useAuthStore';
import { formatTime } from '../../utils/formatters';
import toast from 'react-hot-toast';

const DAYS_OF_WEEK = [
  { id: 'monday', label: 'Lunes' },
  { id: 'tuesday', label: 'Martes' },
  { id: 'wednesday', label: 'Miércoles' },
  { id: 'thursday', label: 'Jueves' },
  { id: 'friday', label: 'Viernes' },
  { id: 'saturday', label: 'Sábado' },
  { id: 'sunday', label: 'Domingo' },
];

const DAY_INDEX_TO_ID = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
};

const DAY_ID_TO_INDEX = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

const DEFAULT_SCHEDULE_DAY = {
  isWorking: true,
  startTime: '09:00',
  endTime: '20:00',
  breakStartTime: '13:00',
  breakEndTime: '14:00'
};

export default function BarberSchedule() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('agenda'); // 'agenda' or 'horario'
  
  // Agenda State
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [loadingAgenda, setLoadingAgenda] = useState(true);
  
  // Schedule State
  const [schedule, setSchedule] = useState({});
  const [loadingSchedule, setLoadingSchedule] = useState(true);
  const [savingSchedule, setSavingSchedule] = useState(false);

  useEffect(() => {
    if (user?._id) {
      setLoadingSchedule(true);
      barberService.getOne(user._id)
        .then(res => {
          const barberData = res.barber || res.data?.barber;
          const raw = barberData?.schedule;
          const cleanSchedule = {};
          DAYS_OF_WEEK.forEach(d => {
            cleanSchedule[d.id] = { ...DEFAULT_SCHEDULE_DAY, isWorking: d.id !== 'sunday' };
          });

          if (Array.isArray(raw) && raw.length > 0) {
            raw.forEach(item => {
              const dayId = typeof item.day === 'number' ? DAY_INDEX_TO_ID[item.day] : item.day;
              if (dayId && cleanSchedule[dayId]) {
                cleanSchedule[dayId] = {
                  isWorking: item.isWorking !== false,
                  startTime: item.startTime || '09:00',
                  endTime: item.endTime || '20:00',
                  breakStartTime: item.breakStartTime || item.breakStart || '13:00',
                  breakEndTime: item.breakEndTime || item.breakEnd || '14:00',
                };
              }
            });
          } else if (raw && typeof raw === 'object') {
            Object.entries(raw).forEach(([k, v]) => {
              const dayId = DAY_INDEX_TO_ID[k] || k;
              if (dayId && cleanSchedule[dayId]) {
                cleanSchedule[dayId] = {
                  isWorking: v.isWorking !== false,
                  startTime: v.startTime || '09:00',
                  endTime: v.endTime || '20:00',
                  breakStartTime: v.breakStartTime || v.breakStart || '13:00',
                  breakEndTime: v.breakEndTime || v.breakEnd || '14:00',
                };
              }
            });
          }
          setSchedule(cleanSchedule);
        })
        .catch(err => console.error(err))
        .finally(() => setLoadingSchedule(false));
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'agenda') {
      fetchAgenda();
    }
  }, [selectedDate, activeTab]);

  const fetchAgenda = () => {
    setLoadingAgenda(true);
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    appointmentService.getBarberAppointments({ date: dateStr })
      .then(res => {
        const apts = res.appointments || res.data?.appointments || [];
        setAppointments(apts);
      })
      .catch(() => toast.error('Error cargando la agenda'))
      .finally(() => setLoadingAgenda(false));
  };

  const handleUpdateScheduleDay = (dayId, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        [field]: value
      }
    }));
  };

  const handleSaveSchedule = async () => {
    setSavingSchedule(true);
    try {
      const formattedSchedule = Object.entries(schedule).map(([dayId, config]) => ({
        day: DAY_ID_TO_INDEX[dayId] !== undefined ? DAY_ID_TO_INDEX[dayId] : 1,
        isWorking: config.isWorking !== false,
        startTime: config.startTime || '09:00',
        endTime: config.endTime || '20:00',
        breakStart: config.breakStartTime || '13:00',
        breakEnd: config.breakEndTime || '14:00',
      }));

      await barberService.updateProfile({ schedule: formattedSchedule });
      toast.success('Horario actualizado exitosamente');
    } catch (error) {
      console.error('Error al guardar horario:', error);
      toast.error('Error al guardar horario');
    } finally {
      setSavingSchedule(false);
    }
  };

  const stats = {
    total: appointments.length,
    completed: appointments.filter(a => a.status === 'completada').length,
    earnings: appointments.filter(a => a.status === 'completada').reduce((sum, a) => sum + (a.totalPrice || 0), 0)
  };

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-2 pb-20">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-6 border-b border-[#1f2723]">
          <div>
            <span className="editorial-tag text-gold-400 block mb-1">Control de Agenda</span>
            <h1 className="font-serif italic text-3xl sm:text-4xl text-white">
              Mi <span className="text-gold-400">Agenda & Horario</span>
            </h1>
            <p className="text-[#8e9b94] text-xs font-sans mt-1">
              Gestiona tus citas programadas y tus jornadas de trabajo disponibles
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-[#1f2723] pb-4">
          <button
            onClick={() => setActiveTab('agenda')}
            className={`px-5 py-2.5 text-xs font-sans uppercase tracking-wider rounded-[4px] transition-all cursor-pointer ${
              activeTab === 'agenda' 
                ? 'bg-gold-400 text-[#0e1311] font-semibold shadow-sm' 
                : 'bg-[#161d19] text-[#b3b3b3] hover:text-white border border-[#222a26]'
            }`}
          >
            Agenda Diaria
          </button>
          <button
            onClick={() => setActiveTab('horario')}
            className={`px-5 py-2.5 text-xs font-sans uppercase tracking-wider rounded-[4px] transition-all cursor-pointer ${
              activeTab === 'horario' 
                ? 'bg-gold-400 text-[#0e1311] font-semibold shadow-sm' 
                : 'bg-[#161d19] text-[#b3b3b3] hover:text-white border border-[#222a26]'
            }`}
          >
            Configurar Horario
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'agenda' && (
            <motion.div
              key="agenda"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Date Selector */}
              <div className="flex items-center justify-between p-4 bg-[#121815] border border-[#1f2723] rounded-[4px]">
                <button 
                  onClick={() => setSelectedDate(prev => subDays(prev, 1))}
                  className="p-2 bg-[#161d19] hover:bg-[#1f2723] border border-[#2b3530] text-[#dfdbca] rounded-[4px] transition-colors cursor-pointer"
                  title="Día anterior"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="text-center">
                  <h3 className="font-serif italic text-xl text-white capitalize mb-1">
                    {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
                  </h3>
                  {isSameDay(selectedDate, new Date()) && (
                    <span className="inline-block px-2.5 py-0.5 rounded-[4px] text-[10px] font-sans uppercase tracking-wider bg-gold-400/10 text-gold-400 border border-gold-400/30">
                      Hoy
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => setSelectedDate(prev => addDays(prev, 1))}
                  className="p-2 bg-[#161d19] hover:bg-[#1f2723] border border-[#2b3530] text-[#dfdbca] rounded-[4px] transition-colors cursor-pointer"
                  title="Día siguiente"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Stats for the day */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#121815] border border-[#1f2723] rounded-[4px] p-4 text-center">
                  <p className="text-[#8e9b94] font-sans text-xs uppercase tracking-wider mb-1">Total Citas</p>
                  <p className="font-mono text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <div className="bg-[#121815] border border-[#1f2723] rounded-[4px] p-4 text-center">
                  <p className="text-[#8e9b94] font-sans text-xs uppercase tracking-wider mb-1">Completadas</p>
                  <p className="font-mono text-2xl font-bold text-emerald-400">{stats.completed}</p>
                </div>
                <div className="bg-[#121815] border border-[#1f2723] rounded-[4px] p-4 text-center">
                  <p className="text-[#8e9b94] font-sans text-xs uppercase tracking-wider mb-1">Ingresos</p>
                  <p className="font-mono text-2xl font-bold text-gold-400">${stats.earnings.toLocaleString('es-CO')}</p>
                </div>
              </div>

              {/* Timeline Container */}
              <div className="bg-[#121815] border border-[#1f2723] rounded-[4px] overflow-hidden relative min-h-[300px]">
                {/* Current time indicator (only if today) */}
                {isSameDay(selectedDate, new Date()) && (
                  <div className="absolute left-0 right-0 border-t border-dashed border-gold-400/40 z-10 pointer-events-none" 
                       style={{ top: `${Math.max(10, (new Date().getHours() - 8) * 60 + new Date().getMinutes())}px` }} 
                  >
                    <div className="absolute -top-3 left-3 bg-[#0e1311] border border-gold-400/40 px-2 py-0.5 rounded-[2px] text-gold-400 font-mono font-semibold text-[10px] uppercase">
                      Ahora
                    </div>
                  </div>
                )}
                
                {loadingAgenda ? (
                  <div className="p-20 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-400"></div>
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="p-16 text-center">
                    <p className="font-serif italic text-xl text-white mb-1">Día Libre / Sin Citas</p>
                    <p className="text-[#8e9b94] text-xs font-sans">No tienes citas agendadas para esta fecha.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#1f2723]">
                    {appointments.map(apt => (
                      <div key={apt._id} className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 hover:bg-[#161d19]/60 transition-colors">
                        <div className="w-24 flex-shrink-0 pt-0.5">
                          <p className="font-mono font-bold text-white text-base">{formatTime(apt.startTime)}</p>
                          <p className="text-[#8e9b94] font-mono text-xs mt-0.5">
                            {Math.floor(apt.totalDuration / 60)}h {apt.totalDuration % 60}m
                          </p>
                        </div>
                        
                        <div className="flex-1 border-l-2 pl-4 py-0.5 flex flex-col justify-between" 
                             style={{ borderColor: apt.status === 'completada' ? '#10b981' : apt.status === 'cancelada' ? '#f43f5e' : '#cfa53b' }}>
                          <div>
                            <div className="flex justify-between items-start mb-1.5">
                              <h4 className="font-serif italic text-lg text-white">{apt.client?.name}</h4>
                              <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-sans uppercase tracking-wider border ${
                                apt.status === 'completada' ? 'bg-emerald-950/50 text-emerald-400 border-emerald-800/40' :
                                apt.status === 'confirmada' ? 'bg-blue-950/50 text-blue-400 border-blue-800/40' :
                                apt.status === 'cancelada' ? 'bg-rose-950/50 text-rose-400 border-rose-800/40' :
                                'bg-amber-950/50 text-gold-400 border-amber-800/40'
                              }`}>
                                {apt.status}
                              </span>
                            </div>
                            <p className="text-[#b3b3b3] text-xs mb-3">
                              {apt.services?.map(s => s.name).join(', ')}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs font-mono border-t border-[#1f2723] pt-2 mt-2">
                            <span className="text-[#8e9b94] uppercase">{apt.paymentMethod}</span>
                            <span className="text-gold-400 font-bold">${apt.totalPrice?.toLocaleString('es-CO')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'horario' && (
            <motion.div
              key="horario"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-[#121815] border border-[#1f2723] rounded-[4px] p-6">
                <div className="flex items-start gap-4 mb-6 pb-6 border-b border-[#1f2723]">
                  <div className="w-10 h-10 bg-[#161d19] border border-gold-400/40 rounded-[4px] flex items-center justify-center flex-shrink-0 text-gold-400">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif italic text-xl text-white mb-1">Horario Laboral y Descansos</h3>
                    <p className="text-[#8e9b94] text-xs leading-relaxed">
                      Configura los días en los que atiendes y tus intervalos de descanso. Los clientes solo podrán agendar dentro de estos rangos libres.
                    </p>
                  </div>
                </div>

                {loadingSchedule ? (
                  <div className="p-10 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-400"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {DAYS_OF_WEEK.map(day => {
                      const daySchedule = schedule[day.id] || DEFAULT_SCHEDULE_DAY;
                      return (
                        <div key={day.id} className="border border-[#1f2723] p-4 bg-[#161d19]/40 rounded-[4px]">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-serif italic text-base text-white">{day.label}</h4>
                            <label className="flex items-center cursor-pointer relative">
                              <input 
                                type="checkbox" 
                                className="sr-only"
                                checked={daySchedule.isWorking}
                                onChange={(e) => handleUpdateScheduleDay(day.id, 'isWorking', e.target.checked)}
                              />
                              <div className={`w-11 h-6 rounded-[4px] border transition-colors ${daySchedule.isWorking ? 'bg-emerald-950/80 border-emerald-600' : 'bg-[#121815] border-[#222a26]'}`}></div>
                              <div className={`absolute w-4 h-4 rounded-[2px] bg-gold-400 top-1 transition-transform ${daySchedule.isWorking ? 'translate-x-6' : 'translate-x-1 opacity-40'}`}></div>
                            </label>
                          </div>

                          {daySchedule.isWorking ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#1f2723]">
                              <div>
                                <label className="text-[#8e9b94] font-sans text-[11px] uppercase tracking-wider mb-1.5 block">Jornada</label>
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="time" 
                                    value={daySchedule.startTime}
                                    onChange={(e) => handleUpdateScheduleDay(day.id, 'startTime', e.target.value)}
                                    className="bg-[#0e1311] border border-[#222a26] text-white focus:border-gold-400/50 rounded-[4px] py-1.5 px-2.5 flex-1 font-mono text-xs outline-none"
                                  />
                                  <span className="text-[#666]">-</span>
                                  <input 
                                    type="time" 
                                    value={daySchedule.endTime}
                                    onChange={(e) => handleUpdateScheduleDay(day.id, 'endTime', e.target.value)}
                                    className="bg-[#0e1311] border border-[#222a26] text-white focus:border-gold-400/50 rounded-[4px] py-1.5 px-2.5 flex-1 font-mono text-xs outline-none"
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <label className="text-[#8e9b94] font-sans text-[11px] uppercase tracking-wider mb-1.5 block flex justify-between">
                                  <span>Descanso</span>
                                  <span className="text-[#666] font-normal lowercase">(opcional)</span>
                                </label>
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="time" 
                                    value={daySchedule.breakStartTime}
                                    onChange={(e) => handleUpdateScheduleDay(day.id, 'breakStartTime', e.target.value)}
                                    className="bg-[#0e1311] border border-[#222a26] text-white focus:border-gold-400/50 rounded-[4px] py-1.5 px-2.5 flex-1 font-mono text-xs outline-none"
                                  />
                                  <span className="text-[#666]">-</span>
                                  <input 
                                    type="time" 
                                    value={daySchedule.breakEndTime}
                                    onChange={(e) => handleUpdateScheduleDay(day.id, 'breakEndTime', e.target.value)}
                                    className="bg-[#0e1311] border border-[#222a26] text-white focus:border-gold-400/50 rounded-[4px] py-1.5 px-2.5 flex-1 font-mono text-xs outline-none"
                                  />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="pt-3 border-t border-[#1f2723] text-center py-2">
                              <span className="text-[#8e9b94] font-sans text-xs uppercase tracking-wider">
                                Día Libre / Descanso
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                
                <div className="mt-8 pt-6 border-t border-[#1f2723] flex justify-end">
                  <button 
                    onClick={handleSaveSchedule}
                    disabled={savingSchedule || loadingSchedule}
                    className="bg-gold-400 hover:bg-gold-300 disabled:opacity-50 text-[#0e1311] font-sans font-semibold text-xs tracking-wider uppercase px-6 py-3 rounded-[4px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm w-full sm:w-auto"
                  >
                    {savingSchedule ? (
                      <div className="w-4 h-4 border-2 border-[#0e1311] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Save size={16} />
                        Guardar Horario
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}

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
        .catch(() => {
          const fallback = {};
          DAYS_OF_WEEK.forEach(d => {
            fallback[d.id] = { ...DEFAULT_SCHEDULE_DAY, isWorking: d.id !== 'sunday' };
          });
          setSchedule(fallback);
        })
        .finally(() => setLoadingSchedule(false));
    }
  }, [user?._id]);

  useEffect(() => {
    if (activeTab === 'agenda') {
      setLoadingAgenda(true);
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      appointmentService.getBarberAppointments({ date: dateStr })
        .then(res => {
          setAppointments(res.appointments || res.data?.appointments || []);
        })
        .catch(() => {
          setAppointments([]);
        })
        .finally(() => setLoadingAgenda(false));
    }
  }, [selectedDate, activeTab]);

  const handleUpdateScheduleDay = (dayId, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [dayId]: {
        ...(prev[dayId] || DEFAULT_SCHEDULE_DAY),
        [field]: value
      }
    }));
  };

  const handleSaveSchedule = async () => {
    try {
      setSavingSchedule(true);
      const formattedSchedule = Object.entries(schedule).map(([dayId, dayData]) => ({
        day: DAY_ID_TO_INDEX[dayId] !== undefined ? DAY_ID_TO_INDEX[dayId] : dayId,
        isWorking: dayData.isWorking,
        startTime: dayData.startTime,
        endTime: dayData.endTime,
        breakStartTime: dayData.breakStartTime,
        breakEndTime: dayData.breakEndTime,
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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-6 border-b border-[#2b292d]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#71d083] shadow-[0_0_6px_#71d083]" />
              <span className="font-mono text-[10px] text-[#71d083] uppercase tracking-wider">
                Operaciones · Gestión de Jornada
              </span>
            </div>
            <h1 className="font-sans font-semibold tracking-[-0.025em] text-2xl sm:text-3xl text-[#eeeef0]">
              Agenda & <span className="text-[#71d083]">Disponibilidad</span>
            </h1>
            <p className="text-[#888888] text-xs font-sans mt-1">
              Visualiza tus citas programadas en tiempo real y calibra tus franjas laborales.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-[#2b292d] pb-4">
          <button
            onClick={() => setActiveTab('agenda')}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-[6px] transition-all cursor-pointer border ${
              activeTab === 'agenda' 
                ? 'bg-[#71d083] text-[#04040b] border-[#366740] font-semibold' 
                : 'bg-[#1a191b] text-[#888888] hover:text-[#eeeef0] border-[#2b292d] hover:border-[#366740]/60'
            }`}
          >
            Agenda Diaria
          </button>
          <button
            onClick={() => setActiveTab('horario')}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-[6px] transition-all cursor-pointer border ${
              activeTab === 'horario' 
                ? 'bg-[#71d083] text-[#04040b] border-[#366740] font-semibold' 
                : 'bg-[#1a191b] text-[#888888] hover:text-[#eeeef0] border-[#2b292d] hover:border-[#366740]/60'
            }`}
          >
            Configurar Horario
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'agenda' && (
            <motion.div
              key="agenda"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              {/* Date Selector */}
              <div className="flex items-center justify-between p-4 bg-[#121113] border border-[#2b292d] rounded-[6px] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                <button 
                  onClick={() => setSelectedDate(prev => subDays(prev, 1))}
                  className="p-2 bg-[#1a191b] hover:bg-[#232225] border border-[#2b292d] text-[#888888] hover:text-white rounded-[6px] transition-colors cursor-pointer"
                  title="Día anterior"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="text-center">
                  <h3 className="font-sans font-medium tracking-[-0.015em] text-base text-[#eeeef0] mb-1">
                    {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
                  </h3>
                  {isSameDay(selectedDate, new Date()) && (
                    <span className="inline-block px-2 py-0.5 rounded-[2px] text-[10px] font-mono uppercase tracking-wider bg-[#1b2a1e] text-[#71d083] border border-[#2d5736]">
                      Hoy
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => setSelectedDate(prev => addDays(prev, 1))}
                  className="p-2 bg-[#1a191b] hover:bg-[#232225] border border-[#2b292d] text-[#888888] hover:text-white rounded-[6px] transition-colors cursor-pointer"
                  title="Día siguiente"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Stats for the day */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#121113] border border-[#2b292d] rounded-[6px] p-4 text-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                  <p className="text-[#888888] font-mono text-[10px] uppercase tracking-wider mb-1">Total Citas</p>
                  <p className="font-mono text-2xl font-semibold text-[#eeeef0]">{stats.total}</p>
                </div>
                <div className="bg-[#121113] border border-[#2b292d] rounded-[6px] p-4 text-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                  <p className="text-[#888888] font-mono text-[10px] uppercase tracking-wider mb-1">Completadas</p>
                  <p className="font-mono text-2xl font-semibold text-[#71d083]">{stats.completed}</p>
                </div>
                <div className="bg-[#121113] border border-[#2b292d] rounded-[6px] p-4 text-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                  <p className="text-[#888888] font-mono text-[10px] uppercase tracking-wider mb-1">Ingresos</p>
                  <p className="font-mono text-2xl font-semibold text-[#eeeef0]">${stats.earnings.toLocaleString('es-CO')}</p>
                </div>
              </div>

              {/* Timeline Container */}
              <div className="bg-[#121113] border border-[#2b292d] rounded-[6px] overflow-hidden relative min-h-[300px] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                {loadingAgenda ? (
                  <div className="p-20 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border border-[#71d083] border-t-transparent"></div>
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="p-16 text-center">
                    <p className="font-sans font-medium text-sm text-[#eeeef0] mb-1">Día Libre / Sin Citas</p>
                    <p className="text-[#888888] text-xs font-sans">No tienes citas agendadas para esta fecha.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#2b292d]/60">
                    {appointments.map(apt => (
                      <div key={apt._id} className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 hover:bg-[#1a191b]/50 transition-colors">
                        <div className="w-24 flex-shrink-0 pt-0.5">
                          <p className="font-mono font-medium text-[#eeeef0] text-base">{formatTime(apt.startTime)}</p>
                          <p className="text-[#888888] font-mono text-xs mt-0.5">
                            {Math.floor(apt.totalDuration / 60)}h {apt.totalDuration % 60}m
                          </p>
                        </div>
                        
                        <div className="flex-1 border-l-2 pl-4 py-0.5 flex flex-col justify-between" 
                             style={{ borderColor: apt.status === 'completada' ? '#71d083' : apt.status === 'cancelada' ? '#ef4444' : '#60a5fa' }}>
                          <div>
                            <div className="flex justify-between items-start mb-1.5">
                              <h4 className="font-sans font-medium tracking-[-0.015em] text-sm text-[#eeeef0]">{apt.client?.name}</h4>
                              <span className={`px-2 py-0.5 rounded-[2px] text-[10px] font-mono uppercase tracking-wider border ${
                                apt.status === 'completada' ? 'bg-[#1b2a1e] text-[#71d083] border-[#2d5736]' :
                                apt.status === 'confirmada' ? 'bg-[#1e293b] text-blue-400 border-blue-500/30' :
                                apt.status === 'cancelada' ? 'bg-[#2a1717] text-red-400 border-red-500/30' :
                                'bg-[#2a2417] text-amber-400 border-amber-500/30'
                              }`}>
                                {apt.status}
                              </span>
                            </div>
                            <p className="text-[#888888] text-xs mb-3 font-sans">
                              {apt.services?.map(s => s.name).join(', ')}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs font-mono border-t border-[#2b292d]/60 pt-2 mt-2">
                            <span className="text-[#888888] uppercase">{apt.paymentMethod}</span>
                            <span className="text-[#eeeef0] font-medium">${apt.totalPrice?.toLocaleString('es-CO')}</span>
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
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              <div className="bg-[#121113] border border-[#2b292d] rounded-[6px] p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                <div className="flex items-start gap-4 mb-6 pb-6 border-b border-[#2b292d]">
                  <div className="w-10 h-10 bg-[#1a191b] border border-[#2b292d] rounded-[6px] flex items-center justify-center flex-shrink-0 text-[#71d083]">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h3 className="font-sans font-medium text-sm text-[#eeeef0] mb-1">Horario Laboral y Descansos</h3>
                    <p className="text-[#888888] text-xs leading-relaxed font-sans">
                      Configura los días en los que atiendes y tus intervalos de descanso. Los clientes solo podrán agendar dentro de estos rangos libres.
                    </p>
                  </div>
                </div>

                {loadingSchedule ? (
                  <div className="p-10 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border border-[#71d083] border-t-transparent"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {DAYS_OF_WEEK.map(day => {
                      const daySchedule = schedule[day.id] || DEFAULT_SCHEDULE_DAY;
                      return (
                        <div key={day.id} className="border border-[#2b292d] p-4 bg-[#1a191b] rounded-[6px]">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-mono text-xs uppercase tracking-wider text-[#eeeef0]">{day.label}</h4>
                            <label className="flex items-center cursor-pointer relative">
                              <input 
                                type="checkbox" 
                                className="sr-only"
                                checked={daySchedule.isWorking}
                                onChange={(e) => handleUpdateScheduleDay(day.id, 'isWorking', e.target.checked)}
                              />
                              <div className={`w-11 h-6 rounded-full border transition-colors ${daySchedule.isWorking ? 'bg-[#71d083] border-[#366740]' : 'bg-[#121113] border-[#2b292d]'}`}></div>
                              <div className={`absolute w-4 h-4 rounded-full bg-[#04040b] top-1 transition-transform ${daySchedule.isWorking ? 'translate-x-6' : 'translate-x-1 opacity-40'}`}></div>
                            </label>
                          </div>

                          {daySchedule.isWorking ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#2b292d]">
                              <div>
                                <label className="text-[#888888] font-mono text-[10px] uppercase tracking-wider mb-1.5 block">Jornada</label>
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="time" 
                                    value={daySchedule.startTime}
                                    onChange={(e) => handleUpdateScheduleDay(day.id, 'startTime', e.target.value)}
                                    className="bg-[#232225] border border-[#2b292d] text-[#eeeef0] focus:border-[#71d083] rounded-[6px] py-1.5 px-2.5 flex-1 font-mono text-xs outline-none transition-colors"
                                  />
                                  <span className="text-[#666]">-</span>
                                  <input 
                                    type="time" 
                                    value={daySchedule.endTime}
                                    onChange={(e) => handleUpdateScheduleDay(day.id, 'endTime', e.target.value)}
                                    className="bg-[#232225] border border-[#2b292d] text-[#eeeef0] focus:border-[#71d083] rounded-[6px] py-1.5 px-2.5 flex-1 font-mono text-xs outline-none transition-colors"
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <label className="text-[#888888] font-mono text-[10px] uppercase tracking-wider mb-1.5 flex justify-between">
                                  <span>Descanso</span>
                                  <span className="text-[#666] font-normal lowercase font-mono">(opcional)</span>
                                </label>
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="time" 
                                    value={daySchedule.breakStartTime}
                                    onChange={(e) => handleUpdateScheduleDay(day.id, 'breakStartTime', e.target.value)}
                                    className="bg-[#232225] border border-[#2b292d] text-[#eeeef0] focus:border-[#71d083] rounded-[6px] py-1.5 px-2.5 flex-1 font-mono text-xs outline-none transition-colors"
                                  />
                                  <span className="text-[#666]">-</span>
                                  <input 
                                    type="time" 
                                    value={daySchedule.breakEndTime}
                                    onChange={(e) => handleUpdateScheduleDay(day.id, 'breakEndTime', e.target.value)}
                                    className="bg-[#232225] border border-[#2b292d] text-[#eeeef0] focus:border-[#71d083] rounded-[6px] py-1.5 px-2.5 flex-1 font-mono text-xs outline-none transition-colors"
                                  />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="pt-3 border-t border-[#2b292d] text-center py-2">
                              <span className="text-[#888888] font-mono text-xs uppercase tracking-wider">
                                Día Libre / Descanso
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                
                <div className="mt-8 pt-6 border-t border-[#2b292d] flex justify-end">
                  <button 
                    onClick={handleSaveSchedule}
                    disabled={savingSchedule || loadingSchedule}
                    className="btn-depot-primary flex items-center justify-center gap-2 !py-2.5 !px-6 w-full sm:w-auto"
                  >
                    {savingSchedule ? (
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Save size={14} />
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

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, subDays, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Save, User, UserCheck } from 'lucide-react';
import PageTransition from '../../components/ui/PageTransition';
import BrutalCard from '../../components/ui/BrutalCard';
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

const DEFAULT_SCHEDULE_DAY = {
  isWorking: true,
  startTime: '09:00',
  endTime: '19:00',
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
    // Fetch barber profile for schedule
    if (user?._id) {
      setLoadingSchedule(true);
      barberService.getOne(user._id)
        .then(res => {
          const barberData = res.barber || res.data?.barber;
          if (barberData?.schedule) {
            setSchedule(barberData.schedule);
          } else {
            // init default schedule
            const initSchedule = {};
            DAYS_OF_WEEK.forEach(d => {
              initSchedule[d.id] = { ...DEFAULT_SCHEDULE_DAY };
            });
            setSchedule(initSchedule);
          }
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
      await barberService.updateProfile({ schedule });
      toast.success('Horario actualizado exitosamente');
    } catch (error) {
      toast.error('Error al guardar horario');
    } finally {
      setSavingSchedule(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completada': return 'bg-[#22c55e] border-[#0a0a0a] text-black';
      case 'confirmada': return 'bg-[#3b82f6] border-[#0a0a0a] text-black';
      case 'pendiente': return 'bg-[#d4af37] border-[#0a0a0a] text-black';
      case 'cancelada': return 'bg-[#ef4444] border-[#0a0a0a] text-black';
      default: return 'bg-[#111111] border-[#333] text-[#a0a0a0]';
    }
  };

  // Generate timeline slots for the day (e.g. from 8:00 to 20:00 every 30 mins)
  const generateTimeline = () => {
    const slots = [];
    for (let i = 8; i <= 20; i++) {
      slots.push(`${i.toString().padStart(2, '0')}:00`);
      slots.push(`${i.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const stats = {
    total: appointments.length,
    completed: appointments.filter(a => a.status === 'completada').length,
    earnings: appointments.filter(a => a.status === 'completada').reduce((sum, a) => sum + (a.totalPrice || 0), 0)
  };

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-2 pb-20">
        
        <div className="mb-8">
          <h1 className="font-display text-4xl uppercase text-white mb-1">
            Mi <span className="text-[#d4af37]">Agenda</span>
          </h1>
          <p className="text-[#a0a0a0] font-mono text-sm uppercase tracking-widest">
            GESTIÓN DE HORARIOS Y CITAS
          </p>
        </div>

        {/* Tabs */}
        <div className="flex mb-8 border-b-2 border-[#333]">
          <button
            onClick={() => setActiveTab('agenda')}
            className={`flex-1 py-4 font-bold text-sm uppercase tracking-wider transition-all ${
              activeTab === 'agenda' 
                ? 'text-[#d4af37] border-b-4 border-[#d4af37] -mb-[2px]' 
                : 'text-[#666] hover:text-[#a0a0a0]'
            }`}
          >
            Agenda Diaria
          </button>
          <button
            onClick={() => setActiveTab('horario')}
            className={`flex-1 py-4 font-bold text-sm uppercase tracking-wider transition-all ${
              activeTab === 'horario' 
                ? 'text-[#d4af37] border-b-4 border-[#d4af37] -mb-[2px]' 
                : 'text-[#666] hover:text-[#a0a0a0]'
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
              <div className="flex items-center justify-between p-4 bg-[#111111] border-2 border-[#333]">
                <button 
                  onClick={() => setSelectedDate(prev => subDays(prev, 1))}
                  className="brutal-btn-outline p-2"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="text-center">
                  <h3 className="font-display text-xl text-white uppercase mb-1">
                    {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
                  </h3>
                  {isSameDay(selectedDate, new Date()) && (
                    <span className="brutal-badge border-[#d4af37] text-[#d4af37]">HOY</span>
                  )}
                </div>
                <button 
                  onClick={() => setSelectedDate(prev => addDays(prev, 1))}
                  className="brutal-btn-outline p-2"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Stats for the day */}
              <div className="grid grid-cols-3 gap-4">
                <BrutalCard className="p-4 text-center">
                  <p className="text-[#a0a0a0] font-bold text-xs uppercase mb-1">Total Citas</p>
                  <p className="font-mono text-2xl text-white">{stats.total}</p>
                </BrutalCard>
                <BrutalCard className="p-4 text-center border-[#22c55e]">
                  <p className="text-[#a0a0a0] font-bold text-xs uppercase mb-1">Completadas</p>
                  <p className="font-mono text-2xl text-[#22c55e]">{stats.completed}</p>
                </BrutalCard>
                <BrutalCard className="p-4 text-center border-[#d4af37]">
                  <p className="text-[#a0a0a0] font-bold text-xs uppercase mb-1">Ingresos</p>
                  <p className="font-mono-price text-lg text-[#d4af37]">${stats.earnings.toLocaleString('es-CO')}</p>
                </BrutalCard>
              </div>

              {/* Timeline */}
              <BrutalCard className="p-0 overflow-hidden relative">
                {/* Current time indicator (only if today) */}
                {isSameDay(selectedDate, new Date()) && (
                  <div className="absolute left-0 right-0 border-t-2 border-dashed border-[#d4af37] z-10 opacity-50 pointer-events-none" 
                       style={{ top: `${(new Date().getHours() - 8) * 60 + new Date().getMinutes()}px` }} 
                  >
                    <div className="absolute -top-3 left-2 bg-[#111111] px-2 text-[#d4af37] font-mono font-bold text-xs">
                      AHORA
                    </div>
                  </div>
                )}
                
                {loadingAgenda ? (
                  <div className="p-20 flex justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#d4af37]"></div>
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="p-20 text-center">
                    <p className="text-[#a0a0a0] font-bold text-lg uppercase tracking-wider mb-2">Día Libre</p>
                    <p className="text-[#666] font-mono text-sm">No tienes citas agendadas para esta fecha.</p>
                  </div>
                ) : (
                  <div className="divide-y-2 divide-dashed divide-[#333]">
                    {appointments.map(apt => (
                      <div key={apt._id} className="p-4 flex flex-col sm:flex-row gap-4 hover:bg-[#1a1a1a] transition-colors">
                        <div className="w-24 flex-shrink-0 pt-1">
                          <p className="font-mono font-bold text-white text-lg">{formatTime(apt.startTime)}</p>
                          <p className="text-[#666] font-mono text-xs mt-1">
                            {Math.floor(apt.totalDuration / 60)}h {apt.totalDuration % 60}m
                          </p>
                        </div>
                        
                        <div className="flex-1 border-l-4 pl-4 py-1 flex flex-col justify-between" 
                             style={{ borderColor: apt.status === 'completada' ? '#22c55e' : apt.status === 'cancelada' ? '#ef4444' : '#d4af37' }}>
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-display text-lg text-white uppercase">{apt.client?.name}</h4>
                              <span className={`brutal-badge text-[10px] ${getStatusStyle(apt.status)}`}>
                                {apt.status}
                              </span>
                            </div>
                            <p className="text-[#a0a0a0] text-sm mb-3">
                              {apt.services?.map(s => s.name).join(', ')}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs font-mono border-t border-[#333] pt-2 mt-2">
                            <span className="text-[#666] uppercase">{apt.paymentMethod}</span>
                            <span className="text-[#d4af37] font-bold">${apt.totalPrice?.toLocaleString('es-CO')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </BrutalCard>
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
              <BrutalCard className="p-6">
                <div className="flex items-start gap-4 mb-6 pb-6 border-b-2 border-dashed border-[#333]">
                  <div className="w-12 h-12 bg-[#d4af37]/20 border-2 border-[#d4af37] rounded flex items-center justify-center flex-shrink-0">
                    <Clock size={24} className="text-[#d4af37]" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-white uppercase mb-1">Horario de Trabajo</h3>
                    <p className="text-[#a0a0a0] text-sm">
                      Configura los días que trabajas y tus horas de descanso. 
                      Los clientes solo podrán agendar en los espacios disponibles.
                    </p>
                  </div>
                </div>

                {loadingSchedule ? (
                  <div className="p-10 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4af37]"></div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {DAYS_OF_WEEK.map(day => {
                      const daySchedule = schedule[day.id] || DEFAULT_SCHEDULE_DAY;
                      return (
                        <div key={day.id} className="border-2 border-[#333] p-4 bg-[#111111]">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-display text-lg text-white uppercase">{day.label}</h4>
                            <label className="flex items-center cursor-pointer relative">
                              <input 
                                type="checkbox" 
                                className="sr-only"
                                checked={daySchedule.isWorking}
                                onChange={(e) => handleUpdateScheduleDay(day.id, 'isWorking', e.target.checked)}
                              />
                              <div className={`w-12 h-6 border-2 transition-colors ${daySchedule.isWorking ? 'bg-[#22c55e] border-[#22c55e]' : 'bg-[#333] border-[#333]'}`}></div>
                              <div className={`absolute w-4 h-4 bg-white border-2 border-[#0a0a0a] top-1 transition-transform ${daySchedule.isWorking ? 'translate-x-7' : 'translate-x-1'}`}></div>
                            </label>
                          </div>

                          {daySchedule.isWorking ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t-2 border-dashed border-[#333]">
                              <div>
                                <label className="text-[#666] font-bold text-xs uppercase mb-2 block">Jornada</label>
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="time" 
                                    value={daySchedule.startTime}
                                    onChange={(e) => handleUpdateScheduleDay(day.id, 'startTime', e.target.value)}
                                    className="brutal-input py-2 px-2 flex-1 font-mono text-sm"
                                  />
                                  <span className="text-[#666]">-</span>
                                  <input 
                                    type="time" 
                                    value={daySchedule.endTime}
                                    onChange={(e) => handleUpdateScheduleDay(day.id, 'endTime', e.target.value)}
                                    className="brutal-input py-2 px-2 flex-1 font-mono text-sm"
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <label className="text-[#666] font-bold text-xs uppercase mb-2 block flex justify-between">
                                  Descanso
                                  <span className="text-[#a0a0a0] font-normal text-[10px] lowercase">(opcional)</span>
                                </label>
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="time" 
                                    value={daySchedule.breakStartTime}
                                    onChange={(e) => handleUpdateScheduleDay(day.id, 'breakStartTime', e.target.value)}
                                    className="brutal-input py-2 px-2 flex-1 font-mono text-sm"
                                  />
                                  <span className="text-[#666]">-</span>
                                  <input 
                                    type="time" 
                                    value={daySchedule.breakEndTime}
                                    onChange={(e) => handleUpdateScheduleDay(day.id, 'breakEndTime', e.target.value)}
                                    className="brutal-input py-2 px-2 flex-1 font-mono text-sm"
                                  />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="pt-4 border-t-2 border-dashed border-[#333] text-center py-4">
                              <span className="text-[#a0a0a0] font-mono text-sm uppercase tracking-wider bg-[#1a1a1a] px-4 py-2 border-2 border-[#333]">
                                Día Libre
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                
                <div className="mt-8 pt-6 border-t-2 border-[#333] flex justify-end">
                  <button 
                    onClick={handleSaveSchedule}
                    disabled={savingSchedule || loadingSchedule}
                    className="brutal-btn-primary px-8 py-4 flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    {savingSchedule ? (
                      <div className="w-5 h-5 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Save size={20} strokeWidth={2.5} />
                        Guardar Horario
                      </>
                    )}
                  </button>
                </div>
              </BrutalCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}

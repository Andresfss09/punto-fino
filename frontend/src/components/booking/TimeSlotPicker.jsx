import React from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { formatTime } from '../../utils/formatters';

export default function TimeSlotPicker({ 
  selectedDate, 
  onSelectDate, 
  availableSlots = [], 
  slots = [],
  selectedSlot, 
  onSelectSlot, 
  isLoading 
}) {
  const effectiveSlots = Array.isArray(availableSlots) && availableSlots.length > 0
    ? availableSlots
    : (Array.isArray(slots) ? slots : []);
  
  const getTodayDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getMaxDate = () => {
    const d = new Date();
    d.setMonth(d.getMonth() + 2);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const groupSlots = (slotsList) => {
    const morning = [];
    const afternoon = [];
    const evening = [];

    slotsList.forEach(slot => {
      const h = parseInt(slot.split(':')[0], 10);
      if (h < 12) morning.push(slot);
      else if (h < 17) afternoon.push(slot);
      else evening.push(slot);
    });

    return { MAÑANA: morning, TARDE: afternoon, NOCHE: evening };
  };

  const groupedSlots = groupSlots(effectiveSlots);

  return (
    <div className="space-y-6">
      {/* Date Picker Card */}
      <div className="bg-[#111111] border border-[#262626] rounded-none p-6">
        <label className="font-display font-medium text-white text-sm uppercase tracking-[2px] block mb-3 flex items-center gap-2">
          <CalendarIcon size={16} className="text-white/80" />
          <span>SELECCIONA LA FECHA</span>
        </label>
        <input
          type="date"
          value={selectedDate}
          min={getTodayDate()}
          max={getMaxDate()}
          onChange={(e) => onSelectDate(e.target.value)}
          className="w-full bg-black border border-[#333333] focus:border-white rounded-none text-white px-4 py-3 font-mono text-sm focus:outline-none transition-all cursor-pointer"
        />
        <p className="text-[11px] text-[#777777] font-sans mt-2">
          Atención en sede: Lunes a Sábado 09:00 - 20:30 (Lunes abre 08:00) · Domingos 09:00 - 16:00
        </p>
      </div>

      {/* Slots Card */}
      {selectedDate && (
        <div className="bg-[#111111] border border-[#262626] rounded-none p-6">
          <label className="font-display font-medium text-white text-sm uppercase tracking-[2px] block mb-4 flex items-center gap-2">
            <Clock size={16} className="text-white/80" />
            <span>HORARIOS DISPONIBLES</span>
          </label>
          
          {isLoading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 bg-[#181818] border border-[#262626] rounded-none" />
              ))}
            </div>
          ) : effectiveSlots.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-[#333333] rounded-none">
              <p className="text-white font-display text-sm uppercase tracking-[1px]">No hay horarios disponibles para esta fecha</p>
              <p className="text-[#888888] text-xs font-sans mt-1">Por favor elige otro día en el calendario</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedSlots).map(([period, periodSlots]) => {
                if (periodSlots.length === 0) return null;
                return (
                  <div key={period}>
                    <h4 className="text-[#888888] font-display font-normal uppercase tracking-[2px] text-[11px] mb-3 pb-1 border-b border-[#222222]">
                      {period}
                    </h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                      {periodSlots.map(slot => (
                        <button
                          key={slot}
                          onClick={() => onSelectSlot(slot)}
                          type="button"
                          className={`py-2.5 px-3 font-mono text-xs rounded-none border transition-all cursor-pointer ${
                            selectedSlot === slot
                              ? 'bg-white text-black border-white font-semibold'
                              : 'bg-black text-[#cccccc] border-[#2b2b2b] hover:border-white hover:text-white'
                          }`}
                        >
                          {formatTime(slot)}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

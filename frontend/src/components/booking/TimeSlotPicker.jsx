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

    return { Mañana: morning, Tarde: afternoon, Noche: evening };
  };

  const groupedSlots = groupSlots(effectiveSlots);

  return (
    <div className="space-y-6">
      <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-none p-5 sm:p-6">
        <label className="font-sans font-medium uppercase tracking-[0.16em] text-xs text-white block mb-3 flex items-center gap-2">
          <CalendarIcon size={14} className="text-[#888888]" />
          <span>Selecciona la Fecha</span>
        </label>
        <input
          type="date"
          value={selectedDate}
          min={getTodayDate()}
          max={getMaxDate()}
          onChange={(e) => onSelectDate(e.target.value)}
          className="w-full bg-[#000000] border border-[#222222] focus:border-white rounded-none text-white px-4 py-3 font-mono text-sm focus:outline-none transition-colors"
        />
      </div>

      {selectedDate && (
        <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-none p-5 sm:p-6">
          <label className="font-sans font-medium uppercase tracking-[0.16em] text-xs text-white block mb-4 flex items-center gap-2">
            <Clock size={14} className="text-[#888888]" />
            <span>Horarios Disponibles</span>
          </label>
          
          {isLoading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 animate-pulse">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-11 bg-[#141414] border border-[#1e1e1e] rounded-none" />
              ))}
            </div>
          ) : effectiveSlots.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-[#222222] rounded-none">
              <p className="text-white font-sans uppercase tracking-[0.16em] text-xs font-medium">No hay horarios disponibles para esta fecha</p>
              <p className="text-[#666666] text-xs font-mono mt-1">Por favor elige otro día en el calendario</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedSlots).map(([period, periodSlots]) => {
                if (periodSlots.length === 0) return null;
                return (
                  <div key={period}>
                    <h4 className="text-[#888888] font-sans font-medium uppercase tracking-[0.2em] text-[11px] mb-3 pb-1 border-b border-[#1e1e1e]">
                      {period}
                    </h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                      {periodSlots.map(slot => (
                        <button
                          key={slot}
                          onClick={() => onSelectSlot(slot)}
                          className={`py-2.5 px-2 rounded-none font-mono text-xs font-medium border transition-colors cursor-pointer ${
                            selectedSlot === slot
                              ? 'bg-white text-black border-white font-semibold'
                              : 'bg-[#141414] text-[#888888] border-[#222222] hover:border-white/50 hover:text-white'
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

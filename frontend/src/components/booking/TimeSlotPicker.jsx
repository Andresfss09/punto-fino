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
      <div className="bg-[#121815] border border-[#222a26] rounded-[4px] p-5 sm:p-6 shadow-subtle">
        <label className="font-serif italic text-white text-xl block mb-3 flex items-center gap-2">
          <CalendarIcon size={18} className="text-gold-400" />
          <span>Selecciona la Fecha</span>
        </label>
        <input
          type="date"
          value={selectedDate}
          min={getTodayDate()}
          max={getMaxDate()}
          onChange={(e) => onSelectDate(e.target.value)}
          className="w-full bg-[#101513] border border-[#26302a] focus:border-gold-400 rounded-[4px] text-white px-4 py-3 font-mono text-base focus:outline-none transition-all"
        />
      </div>

      {selectedDate && (
        <div className="bg-[#121815] border border-[#222a26] rounded-[4px] p-5 sm:p-6 shadow-subtle">
          <label className="font-serif italic text-white text-xl block mb-4 flex items-center gap-2">
            <Clock size={18} className="text-gold-400" />
            <span>Horarios Disponibles</span>
          </label>
          
          {isLoading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 animate-pulse">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-11 bg-[#1a1f1d] border border-[#222a26] rounded-[4px]" />
              ))}
            </div>
          ) : effectiveSlots.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-[#2b3530] rounded-[4px]">
              <p className="text-white font-serif italic text-lg">No hay horarios disponibles para esta fecha</p>
              <p className="text-[#808080] text-xs font-sans mt-1">Por favor elige otro día en el calendario</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedSlots).map(([period, periodSlots]) => {
                if (periodSlots.length === 0) return null;
                return (
                  <div key={period}>
                    <h4 className="text-gold-400 font-sans font-medium uppercase tracking-wider text-[11px] mb-3 pb-1 border-b border-[#1f2723]">
                      {period}
                    </h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                      {periodSlots.map(slot => (
                        <button
                          key={slot}
                          onClick={() => onSelectSlot(slot)}
                          className={`py-2.5 px-2 rounded-[4px] font-mono text-xs font-medium border transition-all cursor-pointer ${
                            selectedSlot === slot
                              ? 'bg-gold-400 text-[#0e1311] border-gold-400 shadow-sm font-semibold'
                              : 'bg-[#101513] text-[#dfdbca] border-[#26302a] hover:border-gold-400/50 hover:text-white'
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

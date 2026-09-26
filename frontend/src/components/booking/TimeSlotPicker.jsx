import React from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import BrutalCard from '../ui/BrutalCard';
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
      <BrutalCard variant="default" className="p-4 sm:p-6">
        <label className="font-display text-white text-lg uppercase block mb-3 flex items-center gap-2">
          <CalendarIcon size={18} className="text-[#d4af37]" /> Fecha
        </label>
        <input
          type="date"
          value={selectedDate}
          min={getTodayDate()}
          max={getMaxDate()}
          onChange={(e) => onSelectDate(e.target.value)}
          className="brutal-input w-full font-mono text-lg py-4"
        />
      </BrutalCard>

      {selectedDate && (
        <BrutalCard variant="default" className="p-4 sm:p-6">
          <label className="font-display text-white text-lg uppercase block mb-4 flex items-center gap-2">
            <Clock size={18} className="text-[#d4af37]" /> Horas disponibles
          </label>
          
          {isLoading ? (
            <div className="grid grid-cols-3 gap-3 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-12 bg-[#333] border-2 border-[#1a1a1a]" />
              ))}
            </div>
          ) : effectiveSlots.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-[#333]">
              <p className="text-[#a0a0a0] font-bold uppercase">No hay horarios disponibles</p>
              <p className="text-[#a0a0a0] text-sm mt-1">Intenta con otra fecha</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedSlots).map(([period, periodSlots]) => {
                if (periodSlots.length === 0) return null;
                return (
                  <div key={period}>
                    <h4 className="text-[#a0a0a0] font-bold uppercase tracking-wider text-xs mb-3 border-b-2 border-dashed border-[#333] pb-1">
                      {period}
                    </h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {periodSlots.map(slot => (
                        <button
                          key={slot}
                          onClick={() => onSelectSlot(slot)}
                          className={`py-3 px-1 border-2 font-mono-price text-sm font-bold transition-all ${
                            selectedSlot === slot
                              ? 'bg-[#d4af37] text-[#0a0a0a] border-[#d4af37] shadow-[2px_2px_0_#0a0a0a] scale-[1.02]'
                              : 'bg-[#111111] text-white border-[#333] hover:border-[#d4af37]'
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
        </BrutalCard>
      )}
    </div>
  );
}

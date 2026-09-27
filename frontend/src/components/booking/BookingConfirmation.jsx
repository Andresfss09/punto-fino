import React from 'react';
import { Scissors, User, Calendar, Clock, Check, Edit2, Mail, Phone, MapPin } from 'lucide-react';
import { formatTime, formatPrice } from '../../utils/formatters';

export default function BookingConfirmation({ 
  bookingData, 
  onConfirm, 
  onBack, 
  isSubmitting 
}) {
  const { 
    selectedServices, 
    selectedBarber, 
    selectedDate, 
    selectedSlot, 
    totalPrice, 
    totalDuration, 
    paymentMethod, 
    setPaymentMethod, 
    notes, 
    setNotes,
    clientData, 
    setClientData,
  } = bookingData;

  const paymentMethods = [
    { id: 'efectivo', label: 'Efectivo en Sede' },
    { id: 'nequi', label: 'Nequi' },
    { id: 'daviplata', label: 'Daviplata' },
    { id: 'transferencia', label: 'Transferencia Bancaria' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Client Data Form */}
      <div className="bg-[#111111] border border-[#262626] rounded-none p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#222222]">
          <div className="p-2 border border-[#333333] bg-black text-white">
            <User size={16} />
          </div>
          <div>
            <h3 className="font-display font-medium text-base text-white uppercase tracking-[2px]">
              DATOS DE CONTACTO
            </h3>
            <p className="text-xs text-[#888888] font-sans mt-0.5">
              Sin registro obligatorio. Te notificaremos los detalles de tu cita de forma inmediata.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nombre completo */}
          <div>
            <label className="block text-xs font-display uppercase tracking-[2px] text-[#888888] mb-1.5">
              Nombre Completo *
            </label>
            <div className="relative">
              <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666666]" />
              <input
                type="text"
                name="name"
                value={clientData?.name || ''}
                onChange={handleInputChange}
                placeholder="Ej: Andrés Silva"
                required
                className="w-full bg-black border border-[#333333] focus:border-white rounded-none text-white pl-10 pr-4 py-2.5 text-xs font-sans focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Correo Electrónico */}
          <div>
            <label className="block text-xs font-display uppercase tracking-[2px] text-[#888888] mb-1.5">
              Correo Electrónico *
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666666]" />
              <input
                type="email"
                name="email"
                value={clientData?.email || ''}
                onChange={handleInputChange}
                placeholder="ejemplo@correo.com"
                required
                className="w-full bg-black border border-[#333333] focus:border-white rounded-none text-white pl-10 pr-4 py-2.5 text-xs font-sans focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Teléfono / WhatsApp */}
          <div>
            <label className="block text-xs font-display uppercase tracking-[2px] text-[#888888] mb-1.5">
              WhatsApp / Teléfono *
            </label>
            <div className="relative">
              <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666666]" />
              <input
                type="tel"
                name="phone"
                value={clientData?.phone || ''}
                onChange={handleInputChange}
                placeholder="Ej: 3122398964"
                required
                className="w-full bg-black border border-[#333333] focus:border-white rounded-none text-white pl-10 pr-4 py-2.5 text-xs font-sans focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Dirección o Sector */}
          <div>
            <label className="block text-xs font-display uppercase tracking-[2px] text-[#888888] mb-1.5">
              Ciudad / Sector
            </label>
            <div className="relative">
              <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666666]" />
              <input
                type="text"
                name="address"
                value={clientData?.address || ''}
                onChange={handleInputChange}
                placeholder="Ej: Villacolombia, Cali"
                className="w-full bg-black border border-[#333333] focus:border-white rounded-none text-white pl-10 pr-4 py-2.5 text-xs font-sans focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Booking Summary Card */}
      <div className="bg-[#111111] border border-[#262626] rounded-none p-6">
        <h3 className="font-display font-medium text-base text-white uppercase tracking-[2px] mb-4 pb-3 border-b border-[#222222]">
          RESUMEN DE TU CITA
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-1.5 border border-[#333333] bg-black text-white shrink-0 mt-0.5">
                <Scissors size={14} />
              </div>
              <div>
                <p className="text-[10px] font-display uppercase tracking-[2px] text-[#888888]">EXPERIENCIA(S)</p>
                <div className="mt-1 space-y-1">
                  {selectedServices.map(s => (
                    <div key={s._id} className="flex items-baseline justify-between gap-4 text-xs">
                      <span className="text-white font-medium">{s.name}</span>
                      <span className="font-mono text-[#aaaaaa] shrink-0">${s.price?.toLocaleString('es-CO')} COP</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <div className="p-1.5 border border-[#333333] bg-black text-white shrink-0">
                <User size={14} />
              </div>
              <div>
                <p className="text-[10px] font-display uppercase tracking-[2px] text-[#888888]">MAESTRO BARBERO</p>
                <p className="text-xs text-white uppercase font-display font-medium mt-0.5">
                  {selectedBarber?._id === 'any' ? 'Cualquier Maestro Disponible' : (selectedBarber?.user?.name || selectedBarber?.name)}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-1.5 border border-[#333333] bg-black text-white shrink-0">
                <Calendar size={14} />
              </div>
              <div>
                <p className="text-[10px] font-display uppercase tracking-[2px] text-[#888888]">FECHA Y HORA</p>
                <p className="text-xs text-white font-mono mt-0.5">
                  {selectedDate} · {formatTime(selectedSlot)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <div className="p-1.5 border border-[#333333] bg-black text-white shrink-0">
                <MapPin size={14} />
              </div>
              <div>
                <p className="text-[10px] font-display uppercase tracking-[2px] text-[#888888]">SEDE</p>
                <p className="text-xs text-white mt-0.5">
                  Cra 12 #53-51, Villacolombia, Cali
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-6 pt-5 border-t border-[#222222]">
          <label className="block text-xs font-display uppercase tracking-[2px] text-[#888888] mb-3">
            MÉTODO DE PAGO PREFERIDO
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {paymentMethods.map(pm => (
              <button
                key={pm.id}
                type="button"
                onClick={() => setPaymentMethod(pm.id)}
                className={`py-2.5 px-3 text-[11px] font-display uppercase tracking-[1px] rounded-none border transition-all cursor-pointer ${
                  paymentMethod === pm.id
                    ? 'bg-white text-black border-white font-medium'
                    : 'bg-black text-[#888888] border-[#2b2b2b] hover:border-white/60 hover:text-white'
                }`}
              >
                {pm.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="mt-5">
          <label className="block text-xs font-display uppercase tracking-[2px] text-[#888888] mb-1.5">
            INDICACIONES ADICIONALES (OPCIONAL)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="¿Alguna preferencia sobre el corte, barba o indicación para el barbero?"
            className="w-full bg-black border border-[#333333] focus:border-white rounded-none text-white p-3 text-xs font-sans focus:outline-none transition-all placeholder:text-[#555555]"
          />
        </div>

        {/* Total Row */}
        <div className="mt-6 pt-4 border-t border-[#222222] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-display uppercase tracking-[2px] text-[#888888]">TOTAL DEL SERVICIO</span>
            <span className="text-xs text-[#666666] font-mono">Duración aproximada: {totalDuration} min</span>
          </div>
          <span className="font-mono text-xl sm:text-2xl text-white font-medium">
            {formatPrice(totalPrice)} <span className="text-xs text-[#888888]">COP</span>
          </span>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="w-full sm:w-auto border border-[#333333] hover:border-white text-white font-display text-xs uppercase tracking-[2px] py-3.5 px-6 rounded-none transition-all cursor-pointer"
        >
          MODIFICAR DATOS
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-white hover:bg-[#e0e0e0] text-black font-display text-xs uppercase tracking-[2px] font-medium py-3.5 px-8 rounded-none transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              CONFIRMANDO...
            </span>
          ) : (
            <>
              <span>CONFIRMAR RESERVA</span>
              <Check size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

import React from 'react';
import { Scissors, User, Calendar, Clock, Check, Edit2, Mail, Phone, MapPin, Sparkles, ShoppingBag, Plus } from 'lucide-react';
import { formatTime, formatPrice } from '../../utils/formatters';

const BEVERAGES = [
  { id: 'Jugo Hit ($5.000)', name: 'JUGO HIT', category: 'NEVERA', price: 5000, initials: 'JH' },
  { id: 'Cerveza Águila Latón ($6.000)', name: 'CERVEZA AGUILA LATON', category: 'NEVERA', price: 6000, initials: 'CA' },
  { id: 'Agua ($3.000)', name: 'AGUA', category: 'NEVERA', price: 3000, initials: 'AG' },
];

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
    selectedBeverage,
    setSelectedBeverage,
  } = bookingData;

  const paymentMethods = [
    { id: 'efectivo', label: 'Efectivo en el Atelier' },
    { id: 'nequi', label: 'Nequi' },
    { id: 'daviplata', label: 'Daviplata' },
    { id: 'transferencia', label: 'Transferencia Bancaria' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBeverageToggle = (bevId) => {
    if (selectedBeverage === bevId) {
      setSelectedBeverage('Sin bebida');
    } else {
      setSelectedBeverage(bevId);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Formulario de Datos del Cliente */}
      <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-none p-6">
        <div className="flex items-center justify-between border-b border-[#1e1e1e] pb-4 mb-5">
          <div>
            <h3 className="font-sans font-medium uppercase tracking-[0.2em] text-sm text-white">Datos de Quien Reserva</h3>
            <p className="text-xs text-[#888888] font-sans mt-0.5">
              Sin necesidad de crear cuenta previa. Te enviaremos la confirmación directa.
            </p>
          </div>
          <span className="px-2 py-0.5 border border-[#222222] bg-[#141414] text-[10px] font-sans font-medium uppercase tracking-[0.16em] text-[#888888] hidden sm:inline-block">
            Paso Obligatorio
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nombre */}
          <div>
            <label className="block text-[11px] font-sans uppercase tracking-[0.16em] text-[#888888] mb-1.5 font-medium">
              Nombre Completo <span className="text-white">*</span>
            </label>
            <div className="relative">
              <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666666]" />
              <input
                type="text"
                name="name"
                value={clientData?.name || ''}
                onChange={handleInputChange}
                placeholder="Ej: Nicolás Gómez"
                required
                className="w-full bg-[#000000] border border-[#222222] focus:border-white rounded-none text-white pl-10 pr-4 py-2.5 text-xs font-sans focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Correo Electrónico */}
          <div>
            <label className="block text-[11px] font-sans uppercase tracking-[0.16em] text-[#888888] mb-1.5 font-medium">
              Correo Electrónico <span className="text-white">*</span>
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666666]" />
              <input
                type="email"
                name="email"
                value={clientData?.email || ''}
                onChange={handleInputChange}
                placeholder="Ej: nicolas@gmail.com"
                required
                className="w-full bg-[#000000] border border-[#222222] focus:border-white rounded-none text-white pl-10 pr-4 py-2.5 text-xs font-mono focus:outline-none transition-colors"
              />
            </div>
            <span className="text-[10px] text-[#666666] font-mono mt-1 block">
              Recibirás el comprobante con tu código de reserva
            </span>
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-[11px] font-sans uppercase tracking-[0.16em] text-[#888888] mb-1.5 font-medium">
              Teléfono / WhatsApp <span className="text-white">*</span>
            </label>
            <div className="relative">
              <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666666]" />
              <input
                type="tel"
                name="phone"
                value={clientData?.phone || ''}
                onChange={handleInputChange}
                placeholder="Ej: 315 890 1234"
                required
                className="w-full bg-[#000000] border border-[#222222] focus:border-white rounded-none text-white pl-10 pr-4 py-2.5 text-xs font-mono focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-[11px] font-sans uppercase tracking-[0.16em] text-[#888888] mb-1.5 font-medium">
              Dirección de Residencia <span className="text-white">*</span>
            </label>
            <div className="relative">
              <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666666]" />
              <input
                type="text"
                name="address"
                value={clientData?.address || ''}
                onChange={handleInputChange}
                placeholder="Ej: Cra. 12 #53-51, Cali"
                required
                className="w-full bg-[#000000] border border-[#222222] focus:border-white rounded-none text-white pl-10 pr-4 py-2.5 text-xs font-sans focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Resumen de la Cita */}
      <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-none p-6">
        <h3 className="font-sans font-medium uppercase tracking-[0.2em] text-sm text-white mb-6 border-b border-[#1e1e1e] pb-4 flex items-center justify-between">
          <span>Resumen de la Cita</span>
          <span className="px-2 py-0.5 border border-[#222222] bg-[#141414] text-[10px] font-sans font-medium uppercase tracking-[0.16em] text-[#888888]">
            Punto Fino
          </span>
        </h3>
        
        {/* Timeline Details */}
        <div className="space-y-3 font-sans text-xs">
          <div className="p-3.5 bg-[#000000] border border-[#1e1e1e] rounded-none flex justify-between items-center">
            <span className="text-[#888888] flex items-center gap-2 uppercase tracking-wider text-[11px]">
              <Scissors size={14} className="text-[#888888]" /> Servicios:
            </span>
            <span className="font-sans font-medium text-xs text-white uppercase tracking-wider">
              {selectedServices.map(s => s.name).join(' + ')}
            </span>
          </div>

          <div className="p-3.5 bg-[#000000] border border-[#1e1e1e] rounded-none flex justify-between items-center">
            <span className="text-[#888888] flex items-center gap-2 uppercase tracking-wider text-[11px]">
              <User size={14} className="text-[#888888]" /> Barbero:
            </span>
            <span className="font-sans font-medium text-xs text-white uppercase tracking-wider">
              {selectedBarber?.user?.name || 'Cualquiera disponible'}
            </span>
          </div>

          <div className="p-3.5 bg-[#000000] border border-[#1e1e1e] rounded-none flex justify-between items-center">
            <span className="text-[#888888] flex items-center gap-2 uppercase tracking-wider text-[11px]">
              <Calendar size={14} className="text-[#888888]" /> Fecha y Horario:
            </span>
            <span className="font-mono text-xs text-white capitalize">
              {selectedDate ? new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' }) : ''} · {formatTime(selectedSlot)}
            </span>
          </div>

          <div className="p-3.5 bg-[#000000] border border-[#1e1e1e] rounded-none flex justify-between items-center">
            <span className="text-[#888888] flex items-center gap-2 uppercase tracking-wider text-[11px]">
              <Clock size={14} className="text-[#888888]" /> Duración:
            </span>
            <span className="font-mono text-xs text-white">{totalDuration} MIN</span>
          </div>

          {selectedBeverage && selectedBeverage !== 'Sin bebida' && (
            <div className="p-3.5 bg-[#000000] border border-[#1e1e1e] rounded-none flex justify-between items-center">
              <span className="text-[#888888] flex items-center gap-2 uppercase tracking-wider text-[11px]">
                <ShoppingBag size={14} className="text-[#888888]" /> Bebida Nevera:
              </span>
              <span className="font-sans font-medium text-xs text-white uppercase tracking-wider">
                {selectedBeverage}
              </span>
            </div>
          )}
        </div>
        
        {/* Total Price Pill */}
        <div className="mt-6 pt-5 border-t border-[#1e1e1e] flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.2em] font-sans text-[#888888] font-medium">
            Total a Pagar:
          </span>
          <span className="font-mono text-lg font-bold text-white">
            {formatPrice(totalPrice)} COP
          </span>
        </div>
      </div>

      {/* Lo que usamos contigo (Sección de Bebidas Nevera en Cita) */}
      <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-none p-6">
        <div className="flex items-start gap-3.5 border-b border-[#1e1e1e] pb-4 mb-5">
          <div className="w-10 h-10 rounded-none bg-[#141414] border border-[#222222] flex items-center justify-center shrink-0 text-white">
            <ShoppingBag size={18} />
          </div>
          <div>
            <h4 className="font-sans font-medium uppercase tracking-[0.2em] text-sm text-white">
              Bebidas para tu cita
            </h4>
            <p className="font-sans text-xs text-[#888888] mt-0.5">
              Añádelas a tu reserva y recógelas en tu visita
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {BEVERAGES.map((bev) => {
            const isSelected = selectedBeverage === bev.id;
            return (
              <div
                key={bev.id}
                className={`p-4 rounded-none border transition-colors flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#141414] border-white'
                    : 'bg-[#000000] border-[#1e1e1e] hover:border-[#333333]'
                }`}
              >
                {/* Initials Box */}
                <div className="w-full aspect-[4/3] bg-[#050505] border border-[#1e1e1e] rounded-none flex items-center justify-center mb-3">
                  <span className="font-mono text-2xl font-medium text-white tracking-widest">
                    {bev.initials}
                  </span>
                </div>

                <div className="space-y-1 mb-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#666666] block">
                    {bev.category}
                  </span>
                  <p className="font-sans font-medium uppercase tracking-[0.16em] text-xs text-white leading-snug">
                    {bev.name}
                  </p>
                  
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-mono font-medium text-xs text-white">
                      ${bev.price.toLocaleString('es-CO')}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-none text-[9px] font-mono uppercase tracking-wider bg-[#141414] text-[#888888] border border-[#222222]">
                      DISPONIBLE
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleBeverageToggle(bev.id)}
                  className={`w-full py-2 rounded-none text-xs font-sans uppercase tracking-[0.16em] font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-white text-black border border-white'
                      : 'border border-[#222222] bg-[#141414] hover:bg-white hover:text-black text-white'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check size={13} strokeWidth={2.5} />
                      <span>Agregado</span>
                    </>
                  ) : (
                    <>
                      <Plus size={13} strokeWidth={2.5} />
                      <span>Agregar</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {selectedBeverage && selectedBeverage !== 'Sin bebida' && (
          <div className="mt-4 pt-3 border-t border-[#1e1e1e] flex justify-between items-center">
            <span className="text-xs text-[#888888]">Bebida seleccionada: <strong className="text-white font-mono uppercase text-xs">{selectedBeverage}</strong></span>
            <button
              type="button"
              onClick={() => setSelectedBeverage('Sin bebida')}
              className="text-[11px] text-rose-400 hover:text-rose-300 font-mono uppercase cursor-pointer"
            >
              [ Quitar ]
            </button>
          </div>
        )}
      </div>

      {/* Forma de Pago */}
      <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-none p-6">
        <h4 className="font-sans font-medium uppercase tracking-[0.2em] text-sm text-white mb-4">Forma de Pago</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {paymentMethods.map(method => (
            <label 
              key={method.id}
              className={`cursor-pointer flex items-center justify-center py-3 px-3 rounded-none text-xs font-sans uppercase tracking-[0.14em] transition-colors border text-center ${
                paymentMethod === method.id
                  ? 'bg-white text-black border-white font-medium'
                  : 'bg-[#000000] text-[#888888] border-[#222222] hover:border-white/50 hover:text-white'
              }`}
            >
              <input 
                type="radio" 
                name="paymentMethod" 
                value={method.id}
                checked={paymentMethod === method.id}
                onChange={() => setPaymentMethod(method.id)}
                className="hidden" 
              />
              {method.label}
            </label>
          ))}
        </div>
      </div>

      {/* Notas Adicionales */}
      <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-none p-6">
        <h4 className="font-sans font-medium uppercase tracking-[0.2em] text-sm text-white mb-3 flex items-center gap-2">
          <Edit2 size={14} className="text-[#888888]" /> Notas o Indicaciones Especiales
        </h4>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ej: Degradado medio, navaja..."
          className="w-full bg-[#000000] border border-[#222222] focus:border-white rounded-none text-white p-3 text-xs font-sans h-20 resize-none focus:outline-none transition-colors placeholder:text-[#555555]"
          maxLength={300}
        />
        <div className="text-right mt-1">
          <span className="text-[#666666] font-mono text-[11px]">{notes.length}/300</span>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button 
          onClick={onBack}
          className="btn-ferrari-outline text-xs uppercase tracking-[0.2em] py-3.5 px-6 w-full sm:w-auto text-center cursor-pointer rounded-none"
          disabled={isSubmitting}
        >
          Atrás
        </button>
        <button 
          onClick={onConfirm}
          className="btn-ferrari-primary text-xs uppercase tracking-[0.2em] py-3.5 px-8 w-full flex-1 flex items-center justify-center gap-2 cursor-pointer rounded-none"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Check size={16} strokeWidth={2.5} />
              Confirmar Cita en Punto Fino
            </>
          )}
        </button>
      </div>
    </div>
  );
}

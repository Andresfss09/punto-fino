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
      <div className="bg-[#121815] border border-[#222a26] rounded-[4px] p-6 shadow-subtle">
        <div className="flex items-center justify-between border-b border-[#1f2723] pb-4 mb-5">
          <div>
            <h3 className="font-serif italic text-2xl text-white">Datos de Quien Reserva</h3>
            <p className="text-xs text-[#8e9b94] font-sans mt-0.5">
              Sin necesidad de crear cuenta previa. Te enviaremos la confirmación directa.
            </p>
          </div>
          <span className="editorial-tag bg-[#161d19] border-[#2b3530] text-gold-400 font-sans hidden sm:inline-block">
            Paso Obligatorio
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nombre */}
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-[#dfdbca] mb-1.5 font-medium">
              Nombre Completo <span className="text-gold-400">*</span>
            </label>
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#808080]" />
              <input
                type="text"
                name="name"
                value={clientData?.name || ''}
                onChange={handleInputChange}
                placeholder="Ej: Nicolás Gómez"
                required
                className="w-full bg-[#101513] border border-[#26302a] focus:border-gold-400 rounded-[4px] text-white pl-10 pr-4 py-2.5 text-xs font-sans focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Correo Electrónico */}
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-[#dfdbca] mb-1.5 font-medium">
              Correo Electrónico <span className="text-gold-400">*</span>
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#808080]" />
              <input
                type="email"
                name="email"
                value={clientData?.email || ''}
                onChange={handleInputChange}
                placeholder="Ej: nicolas@gmail.com"
                required
                className="w-full bg-[#101513] border border-[#26302a] focus:border-gold-400 rounded-[4px] text-white pl-10 pr-4 py-2.5 text-xs font-sans focus:outline-none transition-all"
              />
            </div>
            <span className="text-[10px] text-[#808080] font-sans mt-1 block">
              Recibirás el comprobante con tu código de reserva
            </span>
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-[#dfdbca] mb-1.5 font-medium">
              Teléfono / WhatsApp <span className="text-gold-400">*</span>
            </label>
            <div className="relative">
              <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#808080]" />
              <input
                type="tel"
                name="phone"
                value={clientData?.phone || ''}
                onChange={handleInputChange}
                placeholder="Ej: 315 890 1234"
                required
                className="w-full bg-[#101513] border border-[#26302a] focus:border-gold-400 rounded-[4px] text-white pl-10 pr-4 py-2.5 text-xs font-sans focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-[#dfdbca] mb-1.5 font-medium">
              Dirección de Residencia <span className="text-gold-400">*</span>
            </label>
            <div className="relative">
              <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#808080]" />
              <input
                type="text"
                name="address"
                value={clientData?.address || ''}
                onChange={handleInputChange}
                placeholder="Ej: Cra. 12 #53-51, Cali"
                required
                className="w-full bg-[#101513] border border-[#26302a] focus:border-gold-400 rounded-[4px] text-white pl-10 pr-4 py-2.5 text-xs font-sans focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Resumen de la Cita */}
      <div className="bg-[#121815] border border-[#222a26] rounded-[4px] p-6 shadow-subtle">
        <h3 className="font-serif italic text-2xl text-white mb-6 border-b border-[#1f2723] pb-4 flex items-center justify-between">
          <span>Resumen de la Cita</span>
          <span className="editorial-tag bg-[#161d19] border-[#2b3530] text-gold-400 font-sans">
            Atelier Punto Fino
          </span>
        </h3>
        
        {/* Timeline Details */}
        <div className="space-y-3.5 font-sans text-xs">
          <div className="p-3.5 bg-[#101513] border border-[#1f2723] rounded-[4px] flex justify-between items-center">
            <span className="text-[#808080] flex items-center gap-2">
              <Scissors size={14} className="text-gold-400" /> Servicios Seleccionados:
            </span>
            <span className="font-serif italic text-sm text-white font-medium">
              {selectedServices.map(s => s.name).join(' + ')}
            </span>
          </div>

          <div className="p-3.5 bg-[#101513] border border-[#1f2723] rounded-[4px] flex justify-between items-center">
            <span className="text-[#808080] flex items-center gap-2">
              <User size={14} className="text-gold-400" /> Maestro Barbero:
            </span>
            <span className="font-serif italic text-sm text-gold-400 font-medium">
              {selectedBarber?.user?.name || 'Cualquiera disponible'}
            </span>
          </div>

          <div className="p-3.5 bg-[#101513] border border-[#1f2723] rounded-[4px] flex justify-between items-center">
            <span className="text-[#808080] flex items-center gap-2">
              <Calendar size={14} className="text-gold-400" /> Fecha y Horario:
            </span>
            <span className="font-mono text-white capitalize">
              {selectedDate ? new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' }) : ''} · {formatTime(selectedSlot)}
            </span>
          </div>

          <div className="p-3.5 bg-[#101513] border border-[#1f2723] rounded-[4px] flex justify-between items-center">
            <span className="text-[#808080] flex items-center gap-2">
              <Clock size={14} className="text-gold-400" /> Duración Estimada:
            </span>
            <span className="text-white font-medium">{totalDuration} minutos</span>
          </div>

          {selectedBeverage && selectedBeverage !== 'Sin bebida' && (
            <div className="p-3.5 bg-[#101513] border border-gold-400/30 rounded-[4px] flex justify-between items-center">
              <span className="text-[#808080] flex items-center gap-2">
                <ShoppingBag size={14} className="text-gold-400" /> Bebida Agregada (Nevera):
              </span>
              <span className="font-serif italic text-sm text-gold-400 font-medium">
                {selectedBeverage}
              </span>
            </div>
          )}
        </div>
        
        {/* Total Price Pill */}
        <div className="mt-6 pt-5 border-t border-[#1f2723] flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider font-sans text-[#dfdbca] font-semibold">
            Inversión Total:
          </span>
          <span className="price-pill text-sm font-semibold">
            {formatPrice(totalPrice)} COP
          </span>
        </div>
      </div>

      {/* Lo que usamos contigo (Sección de Bebidas Nevera en Cita) */}
      <div className="bg-[#121815] border border-[#222a26] rounded-[4px] p-6 shadow-subtle">
        <div className="flex items-start gap-3.5 border-b border-[#1f2723] pb-4 mb-5">
          <div className="w-10 h-10 rounded-[4px] bg-[#161d19] border border-[#26302a] flex items-center justify-center shrink-0 text-gold-400">
            <ShoppingBag size={20} />
          </div>
          <div>
            <h4 className="font-serif italic text-xl sm:text-2xl text-gold-400 leading-tight">
              Lo que usamos contigo
            </h4>
            <p className="font-sans text-xs text-[#8e9b94] mt-0.5">
              Añádelos a tu reserva y recógelos en tu cita
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {BEVERAGES.map((bev) => {
            const isSelected = selectedBeverage === bev.id;
            return (
              <div
                key={bev.id}
                className={`p-4 rounded-[4px] border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#19231d] border-gold-400 shadow-sm'
                    : 'bg-[#101513] border-[#222a26] hover:border-[#38443e]'
                }`}
              >
                {/* Initials Box */}
                <div className="w-full aspect-[4/3] bg-[#0e1311] border border-[#222a26] rounded-[4px] flex items-center justify-center mb-3">
                  <span className="font-serif italic text-3xl font-bold text-white tracking-widest">
                    {bev.initials}
                  </span>
                </div>

                <div className="space-y-1 mb-3">
                  <span className="font-sans text-[10px] uppercase tracking-widest text-[#808080] font-medium block">
                    {bev.category}
                  </span>
                  <p className="font-serif italic text-base text-gold-400 font-normal leading-snug">
                    {bev.name}
                  </p>
                  
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-mono font-bold text-sm text-gold-400">
                      ${bev.price.toLocaleString('es-CO')}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-[3px] text-[9px] font-sans uppercase tracking-wider bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                      Disponible
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleBeverageToggle(bev.id)}
                  className={`w-full py-2 rounded-[4px] text-xs font-sans uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-600'
                      : 'bg-gold-400 hover:bg-gold-300 text-[#0e1311]'
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
                      <span>+ Agregar</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {selectedBeverage && selectedBeverage !== 'Sin bebida' && (
          <div className="mt-4 pt-3 border-t border-[#1f2723] flex justify-between items-center">
            <span className="text-xs text-[#8e9b94]">Bebida seleccionada: <strong className="text-gold-400 font-serif italic">{selectedBeverage}</strong></span>
            <button
              type="button"
              onClick={() => setSelectedBeverage('Sin bebida')}
              className="text-[11px] text-rose-400 hover:text-rose-300 underline underline-offset-2 cursor-pointer font-sans"
            >
              Quitar bebida
            </button>
          </div>
        )}
      </div>

      {/* Forma de Pago */}
      <div className="bg-[#121815] border border-[#222a26] rounded-[4px] p-6 shadow-subtle">
        <h4 className="font-serif italic text-xl text-white mb-4">Forma de Pago</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {paymentMethods.map(method => (
            <label 
              key={method.id}
              className={`cursor-pointer flex items-center justify-center py-3 px-3 rounded-[4px] text-xs font-sans transition-all border text-center ${
                paymentMethod === method.id
                  ? 'bg-gold-400 text-[#0e1311] border-gold-400 font-semibold shadow-sm'
                  : 'bg-[#101513] text-[#dfdbca] border-[#26302a] hover:border-gold-400/50'
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
      <div className="bg-[#121815] border border-[#222a26] rounded-[4px] p-6 shadow-subtle">
        <h4 className="font-serif italic text-xl text-white mb-3 flex items-center gap-2">
          <Edit2 size={16} className="text-gold-400" /> Notas o Indicaciones Especiales
        </h4>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ej: Prefiero degradado medio en navaja, toalla caliente y perfilado fino de cejas..."
          className="w-full bg-[#101513] border border-[#26302a] focus:border-gold-400 rounded-[4px] text-white p-3 text-xs font-sans h-20 resize-none focus:outline-none transition-all placeholder:text-[#808080]"
          maxLength={300}
        />
        <div className="text-right mt-1">
          <span className="text-[#808080] font-mono text-[11px]">{notes.length}/300</span>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button 
          onClick={onBack}
          className="btn-secondary text-xs uppercase tracking-wider py-3 px-6 w-full sm:w-auto text-center cursor-pointer"
          disabled={isSubmitting}
        >
          Atrás
        </button>
        <button 
          onClick={onConfirm}
          className="btn-primary text-xs uppercase tracking-wider py-3.5 px-8 w-full flex-1 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-[#0e1311] border-t-transparent rounded-full animate-spin" />
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

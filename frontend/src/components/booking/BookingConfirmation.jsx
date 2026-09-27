import React from 'react';
import { Scissors, User, Calendar, Clock, Check, Edit2, Mail, Phone, MapPin, Sparkles } from 'lucide-react';
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
    { id: 'efectivo', label: 'Efectivo en el Atelier' },
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
      {/* Formulario de Datos del Cliente */}
      <div className="bg-[#121815] border border-[#222a26] rounded-[4px] p-6 shadow-subtle">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#1f2723]">
          <div className="p-2 bg-[#161d19] border border-[#2b3530] rounded-[4px] text-gold-400">
            <User size={18} />
          </div>
          <div>
            <h3 className="font-serif italic text-2xl text-white">
              Datos del Cliente
            </h3>
            <p className="text-xs text-[#808080] font-sans mt-0.5">
              No requieres cuenta previa. Te notificaremos la cita a tu correo y WhatsApp.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nombre completo */}
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
                placeholder="Ej: Andrés Silva"
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
                placeholder="ejemplo@correo.com"
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
        <div className="space-y-4 font-sans text-xs">
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
              {new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-CO', {
                weekday: 'short', day: 'numeric', month: 'short'
              })} · {formatTime(selectedSlot)}
            </span>
          </div>

          <div className="p-3.5 bg-[#101513] border border-[#1f2723] rounded-[4px] flex justify-between items-center">
            <span className="text-[#808080] flex items-center gap-2">
              <Clock size={14} className="text-gold-400" /> Duración Estimada:
            </span>
            <span className="text-white font-medium">{totalDuration} minutos</span>
          </div>
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

      {/* Método de Pago */}
      <div className="bg-[#121815] border border-[#222a26] rounded-[4px] p-6 shadow-subtle">
        <h4 className="font-serif italic text-xl text-white mb-4">Forma de Pago</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {paymentMethods.map(method => (
            <label 
              key={method.id}
              className={`cursor-pointer flex items-center justify-center py-3 px-3 rounded-[4px] text-xs font-sans transition-all border text-center ${
                paymentMethod === method.id
                  ? 'bg-gold-400 text-[#0e1311] border-gold-400 font-semibold'
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
          className="btn-secondary text-xs uppercase tracking-wider py-3 px-6 w-full sm:w-auto text-center"
          disabled={isSubmitting}
        >
          Atrás
        </button>
        <button 
          onClick={onConfirm}
          className="btn-primary text-xs uppercase tracking-wider py-3.5 px-8 w-full flex-1 flex items-center justify-center gap-2"
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

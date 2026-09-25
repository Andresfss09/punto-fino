import React from 'react';
import { Scissors, User, Calendar, Clock, Check, Edit2, Mail, Phone, MapPin } from 'lucide-react';
import BrutalCard from '../ui/BrutalCard';
import { formatTime } from '../../utils/formatters';

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
    { id: 'efectivo', label: 'Efectivo' },
    { id: 'nequi', label: 'Nequi' },
    { id: 'daviplata', label: 'Daviplata' },
    { id: 'transferencia', label: 'Transferencia' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Formulario de Datos del Cliente */}
      <BrutalCard variant="gold" className="p-6">
        <div className="flex items-center gap-3 mb-5 border-b-2 border-[#d4af37] pb-3">
          <div className="p-2.5 bg-black border-2 border-gold-500 rounded-lg text-gold-500 shadow-brutal-gold-sm">
            <User size={20} />
          </div>
          <div>
            <h3 className="font-display text-2xl uppercase text-white tracking-wide">
              Datos del Cliente
            </h3>
            <p className="text-xs text-gold-400 font-mono">
              No necesitas crear cuenta previa. Te enviaremos la confirmación a tu correo.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nombre completo */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-200 mb-1.5">
              Nombre Completo <span className="text-gold-500">*</span>
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="name"
                value={clientData?.name || ''}
                onChange={handleInputChange}
                placeholder="Ej: Andrés Silva"
                required
                className="brutal-input pl-9 w-full bg-[#111111] text-white text-sm"
              />
            </div>
          </div>

          {/* Correo Electrónico */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-200 mb-1.5">
              Correo Electrónico <span className="text-gold-500">*</span>
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={clientData?.email || ''}
                onChange={handleInputChange}
                placeholder="ejemplo@correo.com"
                required
                className="brutal-input pl-9 w-full bg-[#111111] text-white text-sm"
              />
            </div>
            <span className="text-[10px] text-gray-400 font-sans mt-0.5 block">
              Recibirás el código y detalles de tu reserva
            </span>
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-200 mb-1.5">
              Teléfono / WhatsApp <span className="text-gold-500">*</span>
            </label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={clientData?.phone || ''}
                onChange={handleInputChange}
                placeholder="Ej: 315 890 1234"
                required
                className="brutal-input pl-9 w-full bg-[#111111] text-white text-sm"
              />
            </div>
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-200 mb-1.5">
              Dirección de Residencia <span className="text-gold-500">*</span>
            </label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="address"
                value={clientData?.address || ''}
                onChange={handleInputChange}
                placeholder="Ej: Cra. 12 #53-51, Cali"
                required
                className="brutal-input pl-9 w-full bg-[#111111] text-white text-sm"
              />
            </div>
          </div>
        </div>
      </BrutalCard>
      <BrutalCard variant="gold" className="p-6">
        <h3 className="font-display text-2xl uppercase mb-6 text-white border-b-2 border-[#d4af37] pb-4">
          Resumen de la cita
        </h3>
        
        {/* Timeline */}
        <div className="relative pl-6 space-y-6 border-l-2 border-dashed border-[#333] mb-8">
          
          <div className="relative">
            <div className="absolute -left-[35px] top-1 w-6 h-6 rounded-full bg-[#111111] border-2 border-[#d4af37] flex items-center justify-center">
              <Scissors size={12} className="text-[#d4af37] rotate-45" />
            </div>
            <div>
              <p className="text-[#a0a0a0] font-bold text-xs uppercase tracking-wider mb-1">Servicios</p>
              <div className="space-y-2">
                {selectedServices.map((s, i) => (
                  <div key={i} className="flex justify-between items-center text-white">
                    <span className="font-medium">{s.name}</span>
                    <span className="font-mono-price text-[#d4af37]">${s.price.toLocaleString('es-CO')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -left-[35px] top-1 w-6 h-6 rounded-full bg-[#111111] border-2 border-[#d4af37] flex items-center justify-center">
              <User size={12} className="text-[#d4af37]" />
            </div>
            <div>
              <p className="text-[#a0a0a0] font-bold text-xs uppercase tracking-wider mb-1">Barbero</p>
              <p className="text-white font-medium uppercase">{selectedBarber?.user?.name}</p>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -left-[35px] top-1 w-6 h-6 rounded-full bg-[#111111] border-2 border-[#d4af37] flex items-center justify-center">
              <Calendar size={12} className="text-[#d4af37]" />
            </div>
            <div>
              <p className="text-[#a0a0a0] font-bold text-xs uppercase tracking-wider mb-1">Fecha y Hora</p>
              <p className="text-white font-medium capitalize">
                {new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-CO', {
                  weekday: 'long', day: 'numeric', month: 'long'
                })} · {formatTime(selectedSlot)}
              </p>
            </div>
          </div>
        </div>
        
        {/* Total */}
        <div className="pt-4 border-t-2 border-[#333] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#a0a0a0] text-sm font-bold uppercase tracking-wider">
            <Clock size={16} /> {totalDuration} min
          </div>
          <div className="text-right">
            <p className="text-[#a0a0a0] font-bold text-xs uppercase tracking-wider mb-1">Total a pagar</p>
            <p className="text-3xl font-mono-price font-bold text-[#d4af37]">
              ${totalPrice.toLocaleString('es-CO')}
            </p>
          </div>
        </div>
      </BrutalCard>

      <BrutalCard variant="default">
        <h4 className="font-display text-lg text-white uppercase mb-4">Método de pago</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {paymentMethods.map(method => (
            <label 
              key={method.id}
              className={`cursor-pointer flex items-center justify-center py-3 px-2 border-2 font-bold text-sm uppercase transition-all ${
                paymentMethod === method.id
                  ? 'bg-[#d4af37] text-[#0a0a0a] border-[#d4af37] shadow-[2px_2px_0_#0a0a0a]'
                  : 'bg-[#111111] text-[#a0a0a0] border-[#333] hover:border-[#d4af37]'
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
      </BrutalCard>

      <BrutalCard variant="default">
        <h4 className="font-display text-lg text-white uppercase mb-4 flex items-center gap-2">
          <Edit2 size={18} /> Notas adicionales
        </h4>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ej: Quiero un degradado bajo con diseño..."
          className="brutal-input w-full h-24 resize-none"
          maxLength={300}
        />
        <div className="text-right mt-1">
          <span className="text-[#a0a0a0] font-mono text-xs">{notes.length}/300</span>
        </div>
      </BrutalCard>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button 
          onClick={onBack}
          className="brutal-btn-outline px-6 py-4 w-full sm:w-auto text-center"
          disabled={isSubmitting}
        >
          Volver
        </button>
        <button 
          onClick={onConfirm}
          className="brutal-btn-primary px-6 py-4 w-full flex-1 flex items-center justify-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Check size={20} strokeWidth={3} />
              Confirmar Reserva
            </>
          )}
        </button>
      </div>
    </div>
  );
}

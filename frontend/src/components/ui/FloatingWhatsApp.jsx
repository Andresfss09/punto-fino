import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = '3122398964';
  const whatsappUrl = `https://wa.me/57${phoneNumber}?text=Hola,%20me%20gustar%C3%ADa%20agendar%20una%20cita%20en%20Punto%20Fino%20(Cra.%2012%20%2353-51,%20Villacolombia)`;

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center group">
      {/* Floating Pill on Desktop */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 bg-[#121815] hover:bg-[#16201b] border border-[#2b3630] hover:border-[#25D366]/60 text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105"
        aria-label="Contactar por WhatsApp a Punto Fino"
      >
        {/* Pulsing indicator */}
        <div className="relative flex items-center justify-center">
          <div className="w-3.5 h-3.5 bg-[#25D366] rounded-full animate-ping absolute opacity-75" />
          <div className="w-3 h-3 bg-[#25D366] rounded-full relative z-10" />
        </div>

        {/* WhatsApp Icon */}
        <MessageCircle size={20} className="text-[#25D366]" />

        {/* Label and Phone */}
        <div className="flex flex-col text-left pr-1">
          <span className="font-sans text-[10px] uppercase tracking-widest text-[#808080] leading-none">
            WhatsApp Oficial
          </span>
          <span className="font-mono text-xs font-semibold text-white group-hover:text-[#25D366] transition-colors mt-0.5">
            312 239 8964
          </span>
        </div>
      </a>
    </div>
  );
}

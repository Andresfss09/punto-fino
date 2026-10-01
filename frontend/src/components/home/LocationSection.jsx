import React from 'react';
import { MapPin, Phone, MessageCircle, Clock, Calendar, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function LocationSection() {
  const address = 'Cali, Valle del Cauca, Colombia';
  const phone = '+57 312 239 8964';
  const whatsappUrl = 'https://wa.me/573122398964?text=Hola,%20me%20gustar%C3%ADa%20agendar%20una%20cita%20en%20Triadix%20Barber%20Studio';

  return (
    <section id="ubicacion" className="py-24 bg-[#000000] border-b border-[#1e1e1e] text-white scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#1e1e1e] pb-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-[#cfa53b]"></span>
              <span className="font-sans text-[11px] uppercase tracking-[0.28em] text-[#cfa53b] font-medium">
                06 · DÓNDE ESTAMOS & CONTACTO
              </span>
            </div>
            <h2 className="display-hero text-2xl sm:text-3xl lg:text-4xl text-white font-medium leading-tight">
              Ubicación & Contacto
            </h2>
          </div>
          <p className="font-sans text-xs sm:text-sm text-[#aaaaaa] max-w-md mt-4 md:mt-0 leading-relaxed">
            Te esperamos en Cali para brindarte la mejor atención en corte y barba. Reserva tu cita online para atenderte puntual y sin filas.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Info Card (7 cols) */}
          <div className="lg:col-span-7 bg-[#0a0a0a] border border-[#1e1e1e] rounded-none p-6 sm:p-8 flex flex-col justify-between space-y-8">
            {/* Address Banner */}
            <div className="space-y-5">
              <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#cfa53b] font-medium block">
                Nuestra Sede
              </span>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-none bg-[#141414] border border-[#222222] flex items-center justify-center text-[#cfa53b] shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <h3 className="font-sans text-xl sm:text-2xl text-white font-medium tracking-wide">
                    Barbería Triadix
                  </h3>
                  <p className="font-sans text-sm text-[#cccccc] font-medium mt-1">
                    Cali, Valle del Cauca · Colombia
                  </p>
                  <p className="font-sans text-xs text-[#888888] mt-2 leading-relaxed max-w-md">
                    Espacio cómodo, climatizado, con buena música y excelente atención. Agenda con anticipación para asegurar tu cupo con tu barbero favorito.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="#reservar"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById('reservar');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-white hover:bg-[#e5e5e5] text-black font-sans font-medium uppercase tracking-[0.18em] text-xs px-5 py-3 rounded-none inline-flex items-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
                >
                  <Calendar size={13} />
                  <span>Agendar Cita en Línea</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            </div>

            {/* Direct Contact Strip */}
            <div className="pt-6 border-t border-[#1e1e1e] space-y-4">
              <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#888888] font-medium block">
                Canales de Atención Directa
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#111111] hover:bg-[#161616] border border-[#222222] hover:border-white/30 rounded-none p-4 flex items-center gap-3.5 transition-all group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full border border-white/20 bg-transparent flex items-center justify-center text-white shrink-0 group-hover:border-[#25D366] transition-colors">
                    <MessageCircle size={16} />
                  </div>
                  <div>
                    <span className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#888888] block">
                      WhatsApp Barbería
                    </span>
                    <span className="font-mono text-xs sm:text-sm font-medium text-white group-hover:text-[#cfa53b] transition-colors">
                      +57 312 239 8964
                    </span>
                  </div>
                </a>

                {/* Telephone */}
                <a
                  href="tel:+573122398964"
                  className="bg-[#111111] hover:bg-[#161616] border border-[#222222] hover:border-white/30 rounded-none p-4 flex items-center gap-3.5 transition-all group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full border border-white/20 bg-transparent flex items-center justify-center text-white shrink-0 group-hover:border-white transition-colors">
                    <Phone size={15} />
                  </div>
                  <div>
                    <span className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#888888] block">
                      Llamadas
                    </span>
                    <span className="font-mono text-xs sm:text-sm font-medium text-white group-hover:text-[#cfa53b] transition-colors">
                      312 239 8964
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Schedule & Atmosphere Card (5 cols) */}
          <div className="lg:col-span-5 bg-[#0a0a0a] border border-[#1e1e1e] rounded-none p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-5">
                <Clock size={15} className="text-[#cfa53b]" />
                <h4 className="font-sans text-xs uppercase tracking-[0.2em] font-medium text-white">Horarios de Atención</h4>
              </div>
              <div className="divide-y divide-[#1e1e1e] font-sans text-xs">
                <div className="py-3 flex justify-between items-center">
                  <span className="text-[#888888]">Lunes</span>
                  <span className="font-mono text-white font-medium bg-[#141414] px-2.5 py-1 rounded-none border border-[#222222]">
                    08:00 — 20:30
                  </span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="text-[#888888]">Martes a Sábado</span>
                  <span className="font-mono text-white font-medium bg-[#141414] px-2.5 py-1 rounded-none border border-[#222222]">
                    09:00 — 20:30
                  </span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="text-[#888888]">Domingos</span>
                  <span className="font-mono text-[#cfa53b] font-medium bg-[#141414] px-2.5 py-1 rounded-none border border-[#cfa53b]/30">
                    09:00 — 16:00
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 text-[11px] font-sans text-[#888888]">
                <ShieldCheck size={14} className="text-[#cfa53b]" />
                <span>Atención puntual y sin filas al reservar tu cita online.</span>
              </div>
            </div>

            {/* Visual Photo Frame */}
            <div className="relative rounded-none overflow-hidden border border-[#222222] aspect-[16/9] bg-[#000000] group">
              <img
                src="https://images.unsplash.com/photo-1512690459411-b9245aed614b?auto=format&fit=crop&w=900&q=80"
                alt="Barbería Triadix Cali"
                className="w-full h-full object-cover filter brightness-70 contrast-110 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col items-center justify-end p-5 text-center">
                <span className="font-sans text-xs uppercase tracking-[0.2em] text-[#cfa53b] font-medium mb-1 flex items-center gap-1.5">
                  <Sparkles size={12} />
                  Triadix
                </span>
                <span className="font-sans text-sm uppercase tracking-[0.16em] text-white font-semibold">
                  Barbería Moderna · Cali
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

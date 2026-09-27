import React from 'react';
import { MapPin, Phone, MessageCircle, Clock, Navigation, ExternalLink, ArrowRight } from 'lucide-react';

export default function LocationSection() {
  const address = 'Cra. 12 #53-51, Villacolombia, Cali, Valle del Cauca';
  const phone = '+57 312 239 8964';
  const mapsUrl = 'https://maps.google.com/?q=Cra.+12+%2353-51,+Villacolombia,+Cali';
  const whatsappUrl = 'https://wa.me/573122398964?text=Hola,%20me%20gustar%C3%ADa%20agendar%20una%20cita%20en%20Punto%20Fino%20(Cra.%2012%20%2353-51)';

  return (
    <section id="ubicacion" className="py-24 bg-[#000000] border-b border-[#1e1e1e] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#1e1e1e] pb-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="eyebrow text-gold-400">
                Sede & Contacto
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#666666]">
                Villacolombia · Cali
              </span>
            </div>
            <h2 className="display-hero text-2xl sm:text-3xl lg:text-4xl text-white font-medium leading-tight">
              Ubicación & Atención
            </h2>
          </div>
          <p className="font-sans text-xs sm:text-sm text-[#888888] max-w-md mt-4 md:mt-0 leading-relaxed">
            Un espacio sobrio y de alta precisión diseñado para tu calma y distinción. Visítanos o comunícate con nosotros.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Info Card (7 cols) */}
          <div className="lg:col-span-7 bg-[#0a0a0a] border border-[#1e1e1e] rounded-none p-6 sm:p-8 flex flex-col justify-between space-y-8">
            {/* Address Banner */}
            <div className="space-y-5">
              <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#888888] font-medium block">
                Dirección del Atelier
              </span>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-none bg-[#141414] border border-[#222222] flex items-center justify-center text-white shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <h3 className="font-sans text-xl sm:text-2xl text-white font-medium tracking-wide">
                    Cra. 12 #53-51
                  </h3>
                  <p className="font-sans text-sm text-gold-400 font-medium mt-1">
                    Barrio Villacolombia · Cali, Valle del Cauca
                  </p>
                  <p className="font-sans text-xs text-[#888888] mt-2 leading-relaxed max-w-md">
                    Fácil acceso vehicular y peatonal. Atención exclusiva con cita previa para garantizar puntualidad absoluta.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ferrari-outline text-xs !py-2.5 !px-4"
                >
                  <Navigation size={13} />
                  <span>Cómo Llegar (Google Maps)</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Direct Contact Strip */}
            <div className="pt-6 border-t border-[#1e1e1e] space-y-4">
              <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#888888] font-medium block">
                Líneas de Atención
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#111111] hover:bg-[#161616] border border-[#222222] hover:border-white/30 rounded-none p-4 flex items-center gap-3.5 transition-all group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full border border-white/20 bg-transparent flex items-center justify-center text-white shrink-0 group-hover:border-white transition-colors">
                    <MessageCircle size={16} />
                  </div>
                  <div>
                    <span className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#888888] block">
                      WhatsApp Oficial
                    </span>
                    <span className="font-mono text-xs sm:text-sm font-medium text-white group-hover:text-gold-400 transition-colors">
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
                      Línea Telefónica
                    </span>
                    <span className="font-mono text-xs sm:text-sm font-medium text-white group-hover:text-gold-400 transition-colors">
                      312 239 8964
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Schedule & Map Preview Card (5 cols) */}
          <div className="lg:col-span-5 bg-[#0a0a0a] border border-[#1e1e1e] rounded-none p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-5">
                <Clock size={15} className="text-white" />
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
                  <span className="font-mono text-gold-400 font-medium bg-[#141414] px-2.5 py-1 rounded-none border border-gold-400/30">
                    09:00 — 16:00
                  </span>
                </div>
              </div>
              <p className="font-mono text-[11px] text-[#666666] mt-4">
                * Para evitar tiempos de espera, agenda previamente en línea.
              </p>
            </div>

            {/* Visual Location Frame / Map Link Card */}
            <div className="relative rounded-none overflow-hidden border border-[#222222] aspect-[16/9] bg-[#000000] group">
              <img
                src="https://images.unsplash.com/photo-1524813686514-a57563d77d61?auto=format&fit=crop&w=800&q=80"
                alt="Mapa Punto Fino Villacolombia"
                className="w-full h-full object-cover filter brightness-70 contrast-110 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4 text-center">
                <div className="btn-circle-arrow mb-3 bg-white text-black border-white">
                  <MapPin size={16} />
                </div>
                <span className="font-sans text-sm uppercase tracking-[0.16em] text-white font-medium">
                  Cra. 12 #53-51, Villacolombia
                </span>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-xs font-mono text-gold-400 hover:text-white underline underline-offset-4 flex items-center gap-1.5 transition-colors"
                >
                  Abrir en Google Maps <ExternalLink size={11} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

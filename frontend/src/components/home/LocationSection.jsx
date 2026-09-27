import React from 'react';
import { MapPin, Phone, MessageCircle, Clock, Coffee, Navigation, ExternalLink } from 'lucide-react';

export default function LocationSection() {
  const address = 'Cra. 12 #53-51, Villacolombia, Cali, Valle del Cauca';
  const phone = '+57 312 239 8964';
  const mapsUrl = 'https://maps.google.com/?q=Cra.+12+%2353-51,+Villacolombia,+Cali';
  const whatsappUrl = 'https://wa.me/573122398964?text=Hola,%20me%20gustar%C3%ADa%20agendar%20una%20cita%20en%20Punto%20Fino%20(Cra.%2012%20%2353-51)';

  return (
    <section id="ubicacion" className="py-24 bg-[#0c100e] border-b border-[#1f2723] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#1f2723] pb-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="editorial-tag bg-[#161d19] border-[#2b3630] text-gold-400">
                Sede & Contacto Directo
              </span>
              <span className="font-sans text-[11px] uppercase tracking-wider text-[#808080]">
                Villacolombia · Cali
              </span>
            </div>
            <h2 className="font-serif italic text-4xl sm:text-5xl text-white font-normal leading-tight">
              Ubicación & Línea de Atención
            </h2>
          </div>
          <p className="font-sans text-xs sm:text-sm text-[#b3b3b3] max-w-md mt-4 md:mt-0 leading-relaxed">
            Un espacio sobrio y acogedor diseñado para tu calma y distinción. Encuéntranos fácilmente o comunícate vía WhatsApp para cualquier inquietud.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Info Card (7 cols) */}
          <div className="lg:col-span-7 bg-[#121815] border border-[#222a26] rounded-[4px] p-6 sm:p-8 flex flex-col justify-between space-y-8 shadow-subtle">
            {/* Address Banner */}
            <div className="space-y-4">
              <span className="font-sans text-xs uppercase tracking-widest text-[#808080] font-medium block">
                Dirección Oficial del Atelier
              </span>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-[4px] bg-[#161d19] border border-[#2b3630] flex items-center justify-center text-gold-400 shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-serif italic text-2xl sm:text-3xl text-white font-normal">
                    Cra. 12 #53-51
                  </h3>
                  <p className="font-sans text-sm text-gold-400 font-medium mt-1">
                    Barrio Villacolombia · Cali, Valle del Cauca
                  </p>
                  <p className="font-sans text-xs text-[#b3b3b3] mt-2">
                    Fácil acceso, zona tranquila y atención personalizada con cita previa confirmada.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="price-pill hover:bg-white text-xs inline-flex items-center gap-2"
                >
                  <Navigation size={13} />
                  <span>Cómo Llegar (Google Maps)</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Direct WhatsApp & Telephone Strip */}
            <div className="pt-6 border-t border-[#1f2723] space-y-4">
              <span className="font-sans text-xs uppercase tracking-widest text-[#808080] font-medium block">
                Canal de Comunicación Directo
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* WhatsApp Button */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#19231d] hover:bg-[#202d25] border border-[#25D366]/50 rounded-[4px] p-4 flex items-center gap-3.5 group transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center text-[#25D366] shrink-0 group-hover:scale-105 transition-transform">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <span className="font-sans text-[10px] uppercase tracking-wider text-[#808080] block">
                      WhatsApp Oficial
                    </span>
                    <span className="font-mono text-sm font-bold text-white group-hover:text-[#25D366] transition-colors">
                      +57 312 239 8964
                    </span>
                  </div>
                </a>

                {/* Telephone Call Button */}
                <a
                  href="tel:+573122398964"
                  className="bg-[#161d19] hover:bg-[#1a221d] border border-[#2b3630] rounded-[4px] p-4 flex items-center gap-3.5 group transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400 shrink-0 group-hover:scale-105 transition-transform">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="font-sans text-[10px] uppercase tracking-wider text-[#808080] block">
                      Llamada Telefónica
                    </span>
                    <span className="font-mono text-sm font-bold text-white group-hover:text-gold-300 transition-colors">
                      312 239 8964
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* Bar & Courtesy Drinks Callout */}
            <div className="pt-6 border-t border-[#1f2723] flex items-center gap-4 bg-[#101513] p-4 rounded-[4px] border border-[#26302a]">
              <div className="w-10 h-10 rounded-[4px] bg-[#161d19] border border-gold-400/40 flex items-center justify-center text-gold-400 shrink-0">
                <Coffee size={20} />
              </div>
              <div className="text-xs">
                <span className="font-serif italic text-base text-white block">
                  Servicio de Bar & Café de Especialidad
                </span>
                <p className="font-sans text-[#b3b3b3] mt-0.5">
                  En cada corte o experiencia tienes incluida una bebida de cortesía: café espresso recién molido, agua con gas o cerveza bien fría.
                </p>
              </div>
            </div>
          </div>

          {/* Schedule & Map Preview Card (5 cols) */}
          <div className="lg:col-span-5 bg-[#121815] border border-[#222a26] rounded-[4px] p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-subtle">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock size={16} className="text-gold-400" />
                <h4 className="font-serif italic text-xl text-white">Horarios Oficiales Weibook</h4>
              </div>
              <div className="divide-y divide-[#1f2723] font-sans text-xs">
                <div className="py-3 flex justify-between items-center">
                  <span className="text-[#b3b3b3]">Lunes</span>
                  <span className="font-mono text-white font-medium bg-[#161d19] px-2.5 py-1 rounded-[3px] border border-[#26302a]">
                    08:00 — 20:30
                  </span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="text-[#b3b3b3]">Martes a Sábado</span>
                  <span className="font-mono text-white font-medium bg-[#161d19] px-2.5 py-1 rounded-[3px] border border-[#26302a]">
                    09:00 — 20:30
                  </span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="text-[#b3b3b3]">Domingos</span>
                  <span className="font-mono text-gold-400 font-medium bg-[#161d19] px-2.5 py-1 rounded-[3px] border border-gold-400/30">
                    09:00 — 16:00
                  </span>
                </div>
              </div>
              <p className="font-sans text-[11px] text-[#808080] mt-3">
                * Para evitar tiempos de espera, sugerimos agendar tu espacio con anticipación en línea o por WhatsApp.
              </p>
            </div>

            {/* Visual Location Frame / Map Link Card */}
            <div className="relative rounded-[4px] overflow-hidden border border-[#26302a] aspect-[16/9] bg-[#0d1210] group">
              <img
                src="https://images.unsplash.com/photo-1524813686514-a57563d77d61?auto=format&fit=crop&w=800&q=80"
                alt="Mapa y alrededores Punto Fino"
                className="w-full h-full object-cover filter brightness-75 contrast-110 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-[#0e1311]/60 flex flex-col items-center justify-center p-4 text-center">
                <div className="w-10 h-10 bg-gold-400 text-[#0e1311] rounded-full flex items-center justify-center shadow-lg mb-2">
                  <MapPin size={20} />
                </div>
                <span className="font-serif italic text-lg text-white font-normal">
                  Cra. 12 #53-51, Villacolombia
                </span>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-xs font-sans text-gold-400 hover:text-white underline underline-offset-4 flex items-center gap-1"
                >
                  Abrir Mapa Interactivo <ExternalLink size={11} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

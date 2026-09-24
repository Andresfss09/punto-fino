import React from 'react';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#111111] border-t-3 border-[#d4af37] pt-12 md:pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-12">
          {/* Column 1 - Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Steel House Barberia's"
                className="w-12 h-12 object-contain rounded-full border-2 border-gold-500 shadow-brutal-gold-sm"
              />
              <div>
                <h3 className="font-display font-bold text-2xl text-white tracking-wider">
                  Steel House
                </h3>
                <span className="text-xs text-gold-500 tracking-[0.2em] font-semibold uppercase block">
                  BARBERIA'S 👑
                </span>
              </div>
            </div>
            <p className="text-[#a0a0a0] leading-relaxed max-w-sm text-sm">
              <span className="text-white font-medium">Barbería de Experiencia.</span> Más que un corte de cabello, construimos presencia. Cada experiencia está diseñada para cuidar tu imagen, tu tiempo y tu estilo de vida.
            </p>
          </div>

          {/* Column 2 - Schedule */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-lg text-white uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-gold-500 rounded-full"></span> Horario de Atención
            </h3>
            <ul className="space-y-2.5 text-[#a0a0a0] text-sm">
              <li className="flex justify-between max-w-[240px] pb-1 border-b border-white/5">
                <span>Lunes - Sábado</span>
                <span className="font-mono text-white font-semibold">9:00 - 20:00</span>
              </li>
              <li className="flex justify-between max-w-[240px] pb-1 border-b border-white/5">
                <span>Domingo</span>
                <span className="font-mono text-gold-400 font-semibold">10:00 - 17:00</span>
              </li>
              <li className="text-xs text-gray-500 pt-1">
                Atención preferencial con reserva previa
              </li>
            </ul>
          </div>

          {/* Column 3 - Contact & Location */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-lg text-white uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-gold-500 rounded-full"></span> Ubicación & Contacto
            </h3>
            <ul className="space-y-3 text-[#a0a0a0] text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                <span>Cra. 16 #33F-31, B/ Atanasio Girardot, Cali, Valle</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#d4af37] shrink-0" />
                <a href="tel:+573158965266" className="font-mono hover:text-gold-400 transition-colors">
                  +57 315 896 5266
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-[#d4af37] shrink-0" />
                <a
                  href="https://wa.me/573158965266?text=Hola,%20me%20gustar%C3%ADa%20agendar%20una%20cita%20en%20Steel%20House"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-400 text-gold-500 underline font-medium transition-colors"
                >
                  WhatsApp Directo (+57 315 8965266)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-2 border-[#333] pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#888]">
          <p>© {new Date().getFullYear()} Steel House Barberia's. Todos los derechos reservados · Cali, Colombia.</p>
          <p className="flex items-center gap-1.5 font-mono">
            ESTILO · PRECISIÓN · PRESENCIA 👑
          </p>
        </div>
      </div>
    </footer>
  );
}

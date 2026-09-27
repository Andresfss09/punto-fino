import React from 'react';
import { Phone, MapPin, MessageSquare, Clock, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer id="ubicacion" className="bg-[#080808] border-t border-[#222222] pt-16 pb-12 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 pb-14 border-b border-[#222222]">
          {/* Column 1 - Brand */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Punto Fino"
                className="w-10 h-10 object-contain invert contrast-150"
              />
              <div>
                <h3 className="font-display font-medium text-lg uppercase tracking-[3px] text-white leading-tight">
                  PUNTO FINO
                </h3>
                <span className="text-[9px] text-[#888888] tracking-[3px] uppercase font-display block mt-0.5">
                  CALI · ATELIER
                </span>
              </div>
            </div>
            <p className="text-[#888888] text-xs font-sans leading-relaxed max-w-sm">
              Visagismo masculino, técnicas milimétricas de tijera japonesa, rituales de barba con vapor ozono y atención de autor en Villacolombia.
            </p>
          </div>

          {/* Column 2 - Links */}
          <div className="space-y-3">
            <h4 className="font-display text-xs uppercase tracking-[2px] text-white font-medium">
              EXPLORAR
            </h4>
            <ul className="space-y-2 text-xs font-display">
              <li>
                <a href="#servicios" className="text-[#888888] hover:text-white uppercase tracking-[1.5px] transition-colors">
                  CARTA DE SERVICIOS
                </a>
              </li>
              <li>
                <a href="#barberos" className="text-[#888888] hover:text-white uppercase tracking-[1.5px] transition-colors">
                  MAESTROS BARBEROS
                </a>
              </li>
              <li>
                <a href="#testimonios" className="text-[#888888] hover:text-white uppercase tracking-[1.5px] transition-colors">
                  RESEÑAS VERIFICADAS
                </a>
              </li>
              <li>
                <a href="#reservar" className="text-white hover:text-white/80 uppercase tracking-[1.5px] transition-colors border-b border-white/40 pb-0.5">
                  AGENDAR CITA
                </a>
              </li>
              <li>
                <Link to="/login" className="text-[#888888] hover:text-white uppercase tracking-[1.5px] transition-colors">
                  ACCESO CLIENTES & STAFF
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Horarios Reales Weibook */}
          <div className="space-y-3">
            <h4 className="font-display text-xs uppercase tracking-[2px] text-white font-medium flex items-center gap-1.5">
              <Clock size={13} className="text-white" /> HORARIOS DE ATENCIÓN
            </h4>
            <ul className="space-y-2 text-xs font-sans text-[#888888]">
              <li className="flex justify-between max-w-[240px] pb-1 border-b border-[#1a1a1a]">
                <span>Lunes:</span>
                <span className="font-mono text-white">08:00 - 20:30</span>
              </li>
              <li className="flex justify-between max-w-[240px] pb-1 border-b border-[#1a1a1a]">
                <span>Martes a Sábado:</span>
                <span className="font-mono text-white">09:00 - 20:30</span>
              </li>
              <li className="flex justify-between max-w-[240px] pb-1 border-b border-[#1a1a1a]">
                <span>Domingos:</span>
                <span className="font-mono text-white">09:00 - 16:00</span>
              </li>
              <li className="text-[10px] font-display uppercase tracking-[1.5px] text-[#666666] pt-1">
                Atención con cita programada
              </li>
            </ul>
          </div>

          {/* Column 4 - Contacto & Ubicación Real */}
          <div className="space-y-3">
            <h4 className="font-display text-xs uppercase tracking-[2px] text-white font-medium flex items-center gap-1.5">
              <MapPin size={13} className="text-white" /> SEDE & CONTACTO
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-[#888888]">
              <li>
                <span className="text-white block font-display uppercase tracking-[1px] text-[11px]">Sede Villacolombia</span>
                <span>Cra 12 #53-51, Cali, Valle del Cauca</span>
              </li>
              <li>
                <a 
                  href="tel:+573122398964" 
                  className="font-mono text-white hover:text-white/80 transition-colors flex items-center gap-2"
                >
                  <Phone size={12} /> +57 312 239 8964
                </a>
              </li>
              <li className="pt-1">
                <a
                  href="https://wa.me/573122398964?text=Hola,%20quisiera%20agendar%20una%20cita%20en%20Punto%20Fino"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display text-xs uppercase tracking-[2px] text-white hover:text-white/80 underline underline-offset-4 flex items-center gap-1.5 transition-colors"
                >
                  <MessageSquare size={13} /> WhatsApp Directo
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-display uppercase tracking-[1.5px] text-[#666666]">
          <p>© {new Date().getFullYear()} PUNTO FINO. TODOS LOS DERECHOS RESERVADOS · CALI, COLOMBIA.</p>
          <div className="flex items-center gap-3">
            <span className="text-[#888888]">
              VISAGISMO · CORTE DE AUTOR · RITUALES
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

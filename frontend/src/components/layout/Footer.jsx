import React from 'react';
import { Phone, MapPin, MessageCircle, Clock, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#0c100e] border-t border-[#1f2723] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 pb-14 border-b border-[#1f2723]">
          {/* Column 1 - Brand & Philosophy */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Punto Fino Barbería"
                className="w-11 h-11 object-contain rounded-full border border-gold-400/40"
              />
              <div>
                <h3 className="font-serif italic text-2xl text-white leading-tight">
                  Punto Fino
                </h3>
                <span className="text-[10px] text-gold-400 tracking-[0.25em] font-medium uppercase block">
                  Barbería de Autor · Cali
                </span>
              </div>
            </div>
            <p className="text-[#b3b3b3] text-xs leading-relaxed max-w-sm">
              Atelier dedicado al visagismo, corte clásico y cuidado masculino integral. No perseguimos modas efímeras; esculpimos tu presencia.
            </p>
          </div>

          {/* Column 2 - Navigation */}
          <div className="space-y-3">
            <h4 className="font-sans text-xs uppercase tracking-widest text-white font-medium">
              Explorar
            </h4>
            <ul className="space-y-2 text-xs font-sans">
              <li>
                <a href="#servicios" className="text-[#b3b3b3] hover:text-white transition-colors">
                  Carta de Servicios
                </a>
              </li>
              <li>
                <a href="#barberos" className="text-[#b3b3b3] hover:text-white transition-colors">
                  Maestros del Atelier
                </a>
              </li>
              <li>
                <a href="#reservar" className="text-gold-400 hover:text-gold-300 transition-colors">
                  Agendar Cita en Línea
                </a>
              </li>
              <li>
                <Link to="/login" className="text-[#b3b3b3] hover:text-white transition-colors">
                  Portal de Clientes & Barberos
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Schedule */}
          <div className="space-y-3">
            <h4 className="font-sans text-xs uppercase tracking-widest text-white font-medium flex items-center gap-1.5">
              <Clock size={13} className="text-gold-400" /> Horario de Atención
            </h4>
            <ul className="space-y-2 text-xs font-sans text-[#b3b3b3]">
              <li className="flex justify-between max-w-[220px] pb-1 border-b border-[#1f2723]">
                <span>Lunes a Sábado</span>
                <span className="font-mono text-white">9:00 - 20:00</span>
              </li>
              <li className="flex justify-between max-w-[220px] pb-1 border-b border-[#1f2723]">
                <span>Domingos & Festivos</span>
                <span className="font-mono text-gold-400">10:00 - 17:00</span>
              </li>
              <li className="text-[11px] text-[#808080] pt-1">
                Atención con cita previa confirmada
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact & Location */}
          <div className="space-y-3">
            <h4 className="font-sans text-xs uppercase tracking-widest text-white font-medium flex items-center gap-1.5">
              <MapPin size={13} className="text-gold-400" /> Ubicación & Citas
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-[#b3b3b3]">
              <li>
                <span className="text-white block font-medium">Sede Atanasio Girardot</span>
                <span>Cra. 16 #33F-31, Cali, Valle del Cauca</span>
              </li>
              <li>
                <a 
                  href="tel:+573158965266" 
                  className="font-mono hover:text-gold-400 transition-colors flex items-center gap-2"
                >
                  <Phone size={13} className="text-gold-400" /> +57 315 896 5266
                </a>
              </li>
              <li className="pt-1">
                <a
                  href="https://wa.me/573158965266?text=Hola,%20me%20gustar%C3%ADa%20agendar%20una%20cita%20en%20Punto%20Fino"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-serif italic text-gold-400 hover:text-white underline underline-offset-4 flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle size={14} /> WhatsApp Directo Atelier
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-sans text-[#808080]">
          <p>© {new Date().getFullYear()} Punto Fino Barbería. Todos los derechos reservados · Cali, Colombia.</p>
          <div className="flex items-center gap-3">
            <span className="font-serif italic text-white/80">
              Precisión · Presencia · Distinción
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

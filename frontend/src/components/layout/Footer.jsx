import React from 'react';
import { Phone, MapPin, MessageCircle, Clock } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const GOOGLE_MAPS_OFFICIAL_URL = 'https://www.google.com/maps/place/barberia+punto+fino/@3.4484441,-76.500278,17z/data=!3m1!4b1!4m6!3m5!1s0x8e30a7f8b6322dcd:0x647a1acfdd8317f4!8m2!3d3.4484387!4d-76.4977031!16s%2Fg%2F11z5s1m3vz?entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D';

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `#${targetId}`);
      }
    } else {
      navigate(`/#${targetId}`);
    }
  };

  return (
    <footer className="bg-[#000000] border-t border-[#1e1e1e] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 pb-14 border-b border-[#1e1e1e]">
          {/* Column 1 - Brand & Philosophy */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Punto Fino Barbería"
                className="w-10 h-10 object-contain rounded-none border border-[#222222]"
              />
              <div>
                <h3 className="font-sans text-base font-medium tracking-[0.2em] uppercase text-white leading-tight">
                  Punto Fino
                </h3>
                <span className="text-[10px] text-gold-400 tracking-[0.22em] font-medium uppercase block mt-0.5">
                  Barbería de Autor · Cali
                </span>
              </div>
            </div>
            <p className="text-[#888888] text-xs leading-relaxed max-w-sm font-sans">
              Atelier dedicado al visagismo, corte clásico y cuidado masculino integral. Esculpimos tu presencia con rigor y precisión milimétrica.
            </p>
          </div>

          {/* Column 2 - Navigation */}
          <div className="space-y-3">
            <h4 className="font-sans text-[11px] uppercase tracking-[0.22em] text-white font-medium">
              Explorar
            </h4>
            <ul className="space-y-2 text-xs font-sans">
              <li>
                <a
                  href="#servicios"
                  onClick={(e) => handleNavClick(e, 'servicios')}
                  className="text-[#888888] hover:text-white transition-colors uppercase tracking-wider text-[11px] cursor-pointer"
                >
                  Carta de Servicios
                </a>
              </li>
              <li>
                <a
                  href="#barberos"
                  onClick={(e) => handleNavClick(e, 'barberos')}
                  className="text-[#888888] hover:text-white transition-colors uppercase tracking-wider text-[11px] cursor-pointer"
                >
                  Maestros del Atelier
                </a>
              </li>
              <li>
                <a
                  href="#reservar"
                  onClick={(e) => handleNavClick(e, 'reservar')}
                  className="text-gold-400 hover:text-gold-300 transition-colors uppercase tracking-wider text-[11px] cursor-pointer"
                >
                  Agendar Cita en Línea
                </a>
              </li>
              <li>
                <Link to="/login" className="text-[#888888] hover:text-white transition-colors uppercase tracking-wider text-[11px]">
                  Portal de Clientes & Barberos
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Schedule */}
          <div className="space-y-3">
            <h4 className="font-sans text-[11px] uppercase tracking-[0.22em] text-white font-medium flex items-center gap-1.5">
              <Clock size={13} className="text-gold-400" /> Horario Oficial
            </h4>
            <ul className="space-y-2 text-xs font-sans text-[#888888]">
              <li className="flex justify-between max-w-[240px] pb-1 border-b border-[#1e1e1e]">
                <span>Lunes</span>
                <span className="font-mono text-white">08:00 - 20:30</span>
              </li>
              <li className="flex justify-between max-w-[240px] pb-1 border-b border-[#1e1e1e]">
                <span>Martes a Sábado</span>
                <span className="font-mono text-white">09:00 - 20:30</span>
              </li>
              <li className="flex justify-between max-w-[240px] pb-1 border-b border-[#1e1e1e]">
                <span>Domingos</span>
                <span className="font-mono text-gold-400">09:00 - 16:00</span>
              </li>
              <li className="text-[10px] text-[#666666] pt-1 uppercase tracking-wider">
                Atención con cita previa
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact & Location */}
          <div className="space-y-3">
            <h4 className="font-sans text-[11px] uppercase tracking-[0.22em] text-white font-medium flex items-center gap-1.5">
              <MapPin size={13} className="text-gold-400" /> Ubicación & Citas
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-[#888888]">
              <li>
                <span className="text-white block font-medium uppercase tracking-wider text-[11px]">Sede Villacolombia</span>
                <a
                  href={GOOGLE_MAPS_OFFICIAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-400 transition-colors inline-block"
                >
                  Cra. 12 #53-51, Villacolombia, Cali, Valle del Cauca
                </a>
              </li>
              <li>
                <a 
                  href="tel:+573122398964" 
                  className="font-mono hover:text-gold-400 transition-colors flex items-center gap-2 text-white"
                >
                  <Phone size={13} className="text-gold-400" /> +57 312 239 8964
                </a>
              </li>
              <li className="pt-1">
                <a
                  href="https://wa.me/573122398964?text=Hola,%20me%20gustar%C3%ADa%20agendar%20una%20cita%20en%20Punto%20Fino"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-gold-400 hover:text-white underline underline-offset-4 flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle size={14} /> WhatsApp Directo Atelier
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-sans text-[#666666]">
          <p className="font-mono text-[11px]">© {new Date().getFullYear()} PUNTO FINO BARBERÍA. TODOS LOS DERECHOS RESERVADOS · CALI, COLOMBIA.</p>
          <div className="flex items-center gap-3">
            <span className="font-sans uppercase tracking-[0.2em] text-[10px] text-[#888888]">
              Precisión · Presencia · Distinción
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

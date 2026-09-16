import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#111111] border-t-3 border-[#d4af37] pt-12 md:pt-16 pb-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-12">
          {/* Column 1 */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-2xl text-white tracking-wider uppercase">Punto Fino</h3>
            <p className="text-[#a0a0a0] leading-relaxed max-w-sm">
              La experiencia definitiva en barbería. Estilo, precisión y actitud en cada corte. Tu imagen es nuestro legado.
            </p>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-lg text-white uppercase tracking-widest">Horario</h3>
            <ul className="space-y-2 text-[#a0a0a0]">
              <li className="flex justify-between max-w-[200px]">
                <span>Lunes - Viernes</span>
                <span className="font-mono">9:00 - 20:00</span>
              </li>
              <li className="flex justify-between max-w-[200px]">
                <span>Sábado</span>
                <span className="font-mono">9:00 - 18:00</span>
              </li>
              <li className="flex justify-between max-w-[200px] text-[#333]">
                <span>Domingo</span>
                <span className="font-mono uppercase text-xs self-center border border-[#333] px-1">Cerrado</span>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-lg text-white uppercase tracking-widest">Contacto</h3>
            <ul className="space-y-3 text-[#a0a0a0]">
              <li className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#d4af37]" />
                <span>Calle 123 #45-67, Bogotá</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#d4af37]" />
                <span className="font-mono">+57 300 123 4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#d4af37]" />
                <span>contacto@puntofino.com</span>
              </li>
            </ul>
            <div className="pt-2 flex gap-4">
              <a href="#" className="p-2 border-2 border-[#333] hover:border-[#d4af37] hover:text-[#d4af37] transition-colors cursor-pointer bg-[#0a0a0a] text-sm flex items-center justify-center font-mono w-9 h-9">
                IG
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-2 border-[#333] pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#666]">
          <p>© {new Date().getFullYear()} Punto Fino. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Hecho con <span className="text-xl">✂️</span> en Colombia
          </p>
        </div>
      </div>
    </footer>
  );
}

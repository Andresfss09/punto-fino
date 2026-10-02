import React, { useState } from 'react';
import { User, Star, Image as ImageIcon, Camera, Scissors, Check } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import PageTransition from '../../components/ui/PageTransition';
import toast from 'react-hot-toast';

const PREDEFINED_SPECIALTIES = ['Corte Clásico', 'Degradado', 'Diseño de Barba', 'Ritual Toalla Caliente', 'Perfilado', 'Mascarilla Facial', 'Coloración'];

export default function BarberProfile() {
  const { user } = useAuth();
  const [specialties, setSpecialties] = useState(['Corte Clásico', 'Degradado', 'Diseño de Barba']);
  const [bio, setBio] = useState('Maestro barbero especializado en técnicas tradicionales con navaja, degradados milimétricos y cuidado integral de barba.');
  const [portfolio, setPortfolio] = useState([]);

  const toggleSpecialty = (sp) => {
    if (specialties.includes(sp)) {
      setSpecialties(specialties.filter(s => s !== sp));
    } else {
      setSpecialties([...specialties, sp]);
    }
  };

  const handleSaveBio = () => {
    toast.success('Perfil profesional actualizado correctamente');
  };

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-20 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-[#2b292d]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#71d083] shadow-[0_0_6px_#71d083]" />
              <span className="font-mono text-[10px] text-[#71d083] uppercase tracking-wider">
                Configuración · Credenciales de Barbero
              </span>
            </div>
            <h1 className="font-sans font-semibold tracking-[-0.025em] text-2xl sm:text-3xl text-[#eeeef0]">
              Perfil de <span className="text-[#71d083]">Maestro Barbero</span>
            </h1>
            <p className="text-[#888888] text-xs font-sans mt-1">
              Personaliza tu presentación, especialidades y portafolio de cortes.
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-[#121113] border border-[#2b292d] rounded-[6px] p-6 flex flex-col sm:flex-row items-center justify-between gap-6 relative shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-[6px] bg-[#1a191b] border border-[#2b292d] flex items-center justify-center font-mono text-2xl text-[#71d083] font-semibold overflow-hidden">
                {user?.name?.charAt(0) || 'B'}
              </div>
              <label 
                className="absolute -bottom-2 -right-2 bg-[#71d083] text-[#04040b] p-1.5 rounded-[4px] cursor-pointer transition-transform hover:scale-105 shadow-sm"
                title="Cambiar foto de perfil"
              >
                <Camera size={13} />
                <input type="file" className="hidden" accept="image/*" />
              </label>
            </div>
            
            <div className="text-center sm:text-left">
              <h2 className="font-sans font-semibold tracking-[-0.015em] text-lg text-[#eeeef0]">{user?.name || 'Maestro Barbero'}</h2>
              <p className="text-[#71d083] font-mono text-xs uppercase tracking-wider mt-0.5">Barbero Titular · Triadix</p>
              <p className="text-[#888888] text-xs font-mono mt-1">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#1a191b] border border-[#2b292d] px-3.5 py-1.5 rounded-[2px]">
            <Star size={13} className="text-[#71d083] fill-[#71d083]" />
            <span className="font-mono font-medium text-[#eeeef0] text-sm">4.9</span>
            <span className="text-[#888888] text-xs font-mono">(128 reseñas)</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#121113] border border-[#2b292d] rounded-[6px] p-4 text-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
            <p className="text-[#888888] font-mono text-[10px] uppercase tracking-wider mb-1">Clientes Atendidos</p>
            <p className="font-mono text-2xl font-semibold text-[#eeeef0]">450+</p>
          </div>
          <div className="bg-[#121113] border border-[#2b292d] rounded-[6px] p-4 text-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
            <p className="text-[#888888] font-mono text-[10px] uppercase tracking-wider mb-1">Reseñas 5 Estrellas</p>
            <p className="font-mono text-2xl font-semibold text-[#71d083]">128</p>
          </div>
          <div className="bg-[#121113] border border-[#2b292d] rounded-[6px] p-4 text-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
            <p className="text-[#888888] font-mono text-[10px] uppercase tracking-wider mb-1">Puntualidad</p>
            <p className="font-mono text-2xl font-semibold text-[#71d083]">99%</p>
          </div>
        </div>

        {/* Bio & Specialties */}
        <div className="bg-[#121113] border border-[#2b292d] rounded-[6px] overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
          <div className="p-4 sm:p-5 bg-[#1a191b] border-b border-[#2b292d] flex items-center gap-2">
            <Scissors size={15} className="text-[#71d083]" />
            <h3 className="font-sans font-medium text-xs sm:text-sm text-[#eeeef0]">Información Profesional</h3>
          </div>
          <div className="p-5 sm:p-6 space-y-5">
            <div>
              <label className="block text-[#888888] font-mono text-[10px] uppercase tracking-wider mb-1.5">
                Biografía y Presentación
              </label>
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={300}
                className="w-full bg-[#232225] border border-[#2b292d] text-[#eeeef0] focus:border-[#71d083] rounded-[6px] p-3 text-xs leading-relaxed h-28 resize-none outline-none transition-colors font-sans"
                placeholder="Describe tu trayectoria, técnica y atención al cliente..."
              />
              <div className="text-right text-[10px] text-[#666] font-mono mt-1">{bio.length}/300 caracteres</div>
            </div>

            <div>
              <label className="block text-[#888888] font-mono text-[10px] uppercase tracking-wider mb-2.5">
                Especialidades en el Salón
              </label>
              <div className="flex flex-wrap gap-2">
                {PREDEFINED_SPECIALTIES.map(sp => {
                  const isSelected = specialties.includes(sp);
                  return (
                    <button
                      key={sp}
                      type="button"
                      onClick={() => toggleSpecialty(sp)}
                      className={`px-3 py-1.5 rounded-[2px] text-xs font-mono uppercase tracking-wider transition-all cursor-pointer border ${
                        isSelected 
                          ? 'bg-[#1b2a1e] text-[#71d083] border-[#2d5736] font-semibold' 
                          : 'bg-[#1a191b] text-[#888888] hover:text-[#eeeef0] border-[#2b292d] hover:border-[#366740]/60'
                      }`}
                    >
                      {sp}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-[#2b292d] flex justify-end">
              <button 
                onClick={handleSaveBio} 
                className="btn-depot-primary text-xs !py-2.5 !px-6"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>

        {/* Portfolio */}
        <div className="bg-[#121113] border border-[#2b292d] rounded-[6px] overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
          <div className="p-4 sm:p-5 bg-[#1a191b] border-b border-[#2b292d] flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ImageIcon size={15} className="text-[#71d083]" />
              <h3 className="font-sans font-medium text-xs sm:text-sm text-[#eeeef0]">Galería de Trabajos</h3>
            </div>
            <label className="btn-depot-outline text-[11px] !py-1.5 !px-3 cursor-pointer inline-flex items-center gap-1.5">
              + Subir Fotografía
              <input type="file" className="hidden" accept="image/*" />
            </label>
          </div>
          <div className="p-6">
            <div className="text-center py-10 border border-[#2b292d] rounded-[6px] bg-[#1a191b]/40">
              <ImageIcon size={32} className="mx-auto mb-2 text-[#444444]" />
              <p className="font-sans font-medium text-xs text-[#eeeef0] mb-0.5">Sin imágenes publicadas</p>
              <p className="text-[#888888] text-xs font-sans">Sube fotos de tus mejores cortes para inspirar a tus clientes.</p>
            </div>
          </div>
        </div>

      </div>
    </PageTransition>
  );
}

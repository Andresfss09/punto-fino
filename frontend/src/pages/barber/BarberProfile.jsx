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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-[#1e1e1e]">
          <div>
            <span className="eyebrow text-gold-400 block mb-1">Cuenta & Configuración</span>
            <h1 className="font-sans font-medium uppercase tracking-[0.16em] text-2xl sm:text-3xl text-white">
              Perfil de <span className="text-gold-400">Maestro Barbero</span>
            </h1>
            <p className="text-[#888888] text-xs font-sans mt-1">
              Personaliza tu presentación, especialidades y portafolio de cortes.
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-none p-6 flex flex-col sm:flex-row items-center justify-between gap-6 relative">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-none bg-[#141414] border border-[#262626] flex items-center justify-center font-mono text-2xl text-white font-medium overflow-hidden">
                {user?.name?.charAt(0) || 'B'}
              </div>
              <label 
                className="absolute -bottom-2 -right-2 bg-white text-black p-1.5 rounded-none cursor-pointer transition-transform hover:scale-105"
                title="Cambiar foto de perfil"
              >
                <Camera size={13} />
                <input type="file" className="hidden" accept="image/*" />
              </label>
            </div>
            
            <div className="text-center sm:text-left">
              <h2 className="font-sans font-medium uppercase tracking-[0.14em] text-lg text-white">{user?.name || 'Maestro Barbero'}</h2>
              <p className="text-gold-400 font-sans text-xs uppercase tracking-[0.16em] mt-0.5">Barbero Titular · Punto Fino</p>
              <p className="text-[#888888] text-xs font-mono mt-1">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#141414] border border-[#222222] px-3.5 py-1.5 rounded-none">
            <Star size={13} className="text-gold-400 fill-gold-400" />
            <span className="font-mono font-medium text-white text-sm">4.9</span>
            <span className="text-[#888888] text-xs font-mono">(128 reseñas)</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-none p-4 text-center">
            <p className="text-[#888888] font-sans text-[11px] uppercase tracking-[0.16em] mb-1">Clientes Atendidos</p>
            <p className="font-mono text-2xl font-medium text-white">450+</p>
          </div>
          <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-none p-4 text-center">
            <p className="text-[#888888] font-sans text-[11px] uppercase tracking-[0.16em] mb-1">Reseñas 5 Estrellas</p>
            <p className="font-mono text-2xl font-medium text-gold-400">128</p>
          </div>
          <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-none p-4 text-center">
            <p className="text-[#888888] font-sans text-[11px] uppercase tracking-[0.16em] mb-1">Puntualidad</p>
            <p className="font-mono text-2xl font-medium text-emerald-400">99%</p>
          </div>
        </div>

        {/* Bio & Specialties */}
        <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-none overflow-hidden">
          <div className="p-4 sm:p-5 bg-[#0e0e0e] border-b border-[#1e1e1e] flex items-center gap-2">
            <Scissors size={15} className="text-white" />
            <h3 className="font-sans font-medium uppercase tracking-[0.16em] text-xs sm:text-sm text-white">Información Profesional</h3>
          </div>
          <div className="p-5 sm:p-6 space-y-5">
            <div>
              <label className="block text-[#888888] font-sans text-[11px] uppercase tracking-[0.16em] mb-1.5">
                Biografía y Presentación
              </label>
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={300}
                className="w-full bg-[#141414] border border-[#222222] text-white focus:border-white/50 rounded-none p-3 text-xs leading-relaxed h-28 resize-none outline-none transition-colors font-sans"
                placeholder="Describe tu trayectoria, técnica y atención al cliente..."
              />
              <div className="text-right text-[10px] text-[#666] font-mono mt-1">{bio.length}/300 caracteres</div>
            </div>

            <div>
              <label className="block text-[#888888] font-sans text-[11px] uppercase tracking-[0.16em] mb-2.5">
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
                      className={`px-3 py-1.5 rounded-none text-xs font-sans uppercase tracking-[0.16em] transition-all cursor-pointer border ${
                        isSelected 
                          ? 'bg-white text-black border-white font-medium' 
                          : 'bg-[#141414] text-[#888888] hover:text-white border-[#222222] hover:border-white/40'
                      }`}
                    >
                      {sp}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-[#1e1e1e] flex justify-end">
              <button 
                onClick={handleSaveBio} 
                className="btn-ferrari-primary text-xs !py-2.5 !px-6"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>

        {/* Portfolio */}
        <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-none overflow-hidden">
          <div className="p-4 sm:p-5 bg-[#0e0e0e] border-b border-[#1e1e1e] flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ImageIcon size={15} className="text-white" />
              <h3 className="font-sans font-medium uppercase tracking-[0.16em] text-xs sm:text-sm text-white">Galería de Trabajos</h3>
            </div>
            <label className="btn-ferrari-outline text-[11px] !py-1.5 !px-3 cursor-pointer inline-flex items-center gap-1.5">
              + Subir Fotografía
              <input type="file" className="hidden" accept="image/*" />
            </label>
          </div>
          <div className="p-6">
            <div className="text-center py-10 border border-[#1e1e1e] rounded-none bg-[#111111]/40">
              <ImageIcon size={32} className="mx-auto mb-2 text-[#444444]" />
              <p className="font-sans font-medium uppercase tracking-[0.16em] text-xs text-white mb-0.5">Sin imágenes publicadas</p>
              <p className="text-[#888888] text-xs font-sans">Sube fotos de tus mejores cortes para inspirar a tus clientes.</p>
            </div>
          </div>
        </div>

      </div>
    </PageTransition>
  );
}

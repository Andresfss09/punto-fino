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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-[#1f2723]">
          <div>
            <span className="editorial-tag text-gold-400 block mb-1">Cuenta & Configuración</span>
            <h1 className="font-serif italic text-3xl sm:text-4xl text-white">
              Perfil de <span className="text-gold-400">Maestro Barbero</span>
            </h1>
            <p className="text-[#8e9b94] text-xs font-sans mt-1">
              Personaliza tu presentación, especialidades y portafolio de cortes
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-[#121815] border border-[#1f2723] rounded-[4px] p-6 flex flex-col sm:flex-row items-center justify-between gap-6 relative">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative">
              <div className="w-24 h-24 rounded-[4px] bg-[#161d19] border border-gold-400/40 flex items-center justify-center font-serif italic text-3xl text-gold-400 font-bold overflow-hidden shadow-sm">
                {user?.name?.charAt(0) || 'B'}
              </div>
              <label 
                className="absolute -bottom-2 -right-2 bg-gold-400 hover:bg-gold-300 text-[#0e1311] p-2 rounded-[4px] cursor-pointer transition-transform hover:scale-105 shadow-sm"
                title="Cambiar foto de perfil"
              >
                <Camera size={14} />
                <input type="file" className="hidden" accept="image/*" />
              </label>
            </div>
            
            <div className="text-center sm:text-left">
              <h2 className="font-serif italic text-2xl text-white">{user?.name || 'Maestro Barbero'}</h2>
              <p className="text-gold-400 font-sans text-xs uppercase tracking-wider mt-0.5">Barbero Titular • Punto Fino</p>
              <p className="text-[#8e9b94] text-xs font-mono mt-1">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#161d19] border border-gold-400/40 px-3.5 py-1.5 rounded-[4px]">
            <Star size={15} className="text-gold-400 fill-gold-400" />
            <span className="font-mono font-bold text-white text-sm">4.9</span>
            <span className="text-[#8e9b94] text-xs font-sans">(128 reseñas)</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#121815] border border-[#1f2723] rounded-[4px] p-4 text-center">
            <p className="text-[#8e9b94] font-sans text-[11px] uppercase tracking-wider mb-1">Clientes Atendidos</p>
            <p className="font-mono text-2xl font-bold text-white">450+</p>
          </div>
          <div className="bg-[#121815] border border-[#1f2723] rounded-[4px] p-4 text-center">
            <p className="text-[#8e9b94] font-sans text-[11px] uppercase tracking-wider mb-1">Reseñas 5 Estrellas</p>
            <p className="font-mono text-2xl font-bold text-gold-400">128</p>
          </div>
          <div className="bg-[#121815] border border-[#1f2723] rounded-[4px] p-4 text-center">
            <p className="text-[#8e9b94] font-sans text-[11px] uppercase tracking-wider mb-1">Puntualidad</p>
            <p className="font-mono text-2xl font-bold text-emerald-400">99%</p>
          </div>
        </div>

        {/* Bio & Specialties */}
        <div className="bg-[#121815] border border-[#1f2723] rounded-[4px] overflow-hidden">
          <div className="p-4 sm:p-5 bg-[#161d19]/60 border-b border-[#1f2723] flex items-center gap-2">
            <Scissors size={16} className="text-gold-400" />
            <h3 className="font-serif italic text-lg text-white">Información Profesional</h3>
          </div>
          <div className="p-5 sm:p-6 space-y-5">
            <div>
              <label className="block text-[#8e9b94] font-sans text-[11px] uppercase tracking-wider mb-1.5">
                Biografía y Presentación
              </label>
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={300}
                className="w-full bg-[#0e1311] border border-[#222a26] text-white focus:border-gold-400/50 rounded-[4px] p-3 text-xs leading-relaxed h-28 resize-none outline-none transition-colors"
                placeholder="Describe tu trayectoria, técnica y atención al cliente..."
              />
              <div className="text-right text-[10px] text-[#666] font-mono mt-1">{bio.length}/300 caracteres</div>
            </div>

            <div>
              <label className="block text-[#8e9b94] font-sans text-[11px] uppercase tracking-wider mb-2.5">
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
                      className={`px-3 py-1.5 rounded-[4px] text-xs font-sans uppercase tracking-wider transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-gold-400 text-[#0e1311] font-semibold shadow-sm' 
                          : 'bg-[#161d19] text-[#b3b3b3] hover:text-white border border-[#222a26]'
                      }`}
                    >
                      {sp}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-[#1f2723] flex justify-end">
              <button 
                onClick={handleSaveBio} 
                className="bg-gold-400 hover:bg-gold-300 text-[#0e1311] font-sans font-semibold text-xs tracking-wider uppercase px-6 py-2.5 rounded-[4px] transition-all cursor-pointer shadow-sm"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>

        {/* Portfolio */}
        <div className="bg-[#121815] border border-[#1f2723] rounded-[4px] overflow-hidden">
          <div className="p-4 sm:p-5 bg-[#161d19]/60 border-b border-[#1f2723] flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ImageIcon size={16} className="text-gold-400" />
              <h3 className="font-serif italic text-lg text-white">Galería de Trabajos</h3>
            </div>
            <label className="bg-[#161d19] hover:bg-[#1f2723] text-gold-400 border border-gold-400/30 px-3 py-1.5 text-xs font-sans uppercase tracking-wider rounded-[4px] cursor-pointer inline-flex items-center gap-1.5 transition-colors">
              + Subir Fotografía
              <input type="file" className="hidden" accept="image/*" />
            </label>
          </div>
          <div className="p-6">
            <div className="text-center py-10 border border-dashed border-[#222a26] rounded-[4px] bg-[#161d19]/20">
              <ImageIcon size={36} className="mx-auto mb-2 text-[#444]" />
              <p className="font-serif italic text-base text-white mb-0.5">Sin imágenes publicadas</p>
              <p className="text-[#8e9b94] text-xs font-sans">Sube fotos de tus mejores cortes para inspirar a tus clientes.</p>
            </div>
          </div>
        </div>

      </div>
    </PageTransition>
  );
}

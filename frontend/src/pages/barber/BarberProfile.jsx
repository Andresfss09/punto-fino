import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Star, Image as ImageIcon, Camera, Trash2, Scissors } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import BrutalCard from '../../components/ui/BrutalCard';
import Button from '../../components/ui/Button';
import PageTransition from '../../components/ui/PageTransition';
import toast from 'react-hot-toast';

const PREDEFINED_SPECIALTIES = ['Corte Clásico', 'Degradado', 'Diseño', 'Barba', 'Cejas', 'Mascarilla', 'Coloración'];

export default function BarberProfile() {
  const { user } = useAuth();
  const [specialties, setSpecialties] = useState(['Corte Clásico', 'Degradado', 'Barba']);
  const [bio, setBio] = useState('Barbero con 5 años de experiencia. Especialista en degradados y diseño de barbas.');
  const [portfolio, setPortfolio] = useState([]);

  const toggleSpecialty = (sp) => {
    if (specialties.includes(sp)) {
      setSpecialties(specialties.filter(s => s !== sp));
    } else {
      setSpecialties([...specialties, sp]);
    }
  };

  const handleSaveBio = () => {
    toast.success('Perfil actualizado exitosamente');
  };

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-8">
        <h1 className="text-3xl font-display font-bold uppercase tracking-wider text-gold-500">Perfil de Barbero</h1>

        {/* Header Section */}
        <BrutalCard className="flex flex-col sm:flex-row items-center gap-6 relative">
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-dark-500 border-2 border-gold-500 px-3 py-1 shadow-brutal-sm rounded-full">
            <Star size={16} className="text-gold-500 fill-gold-500" />
            <span className="font-mono-price font-bold">4.9</span>
          </div>
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-dark-300 border-2 border-[#333] shadow-brutal-sm overflow-hidden flex items-center justify-center">
              <User size={50} className="text-gray-500" />
            </div>
            <label className="absolute bottom-0 right-0 bg-gold-500 text-dark-500 p-2 rounded-full cursor-pointer border-2 border-dark-500 shadow-brutal-sm hover:scale-105 transition-transform">
              <Camera size={18} />
              <input type="file" className="hidden" accept="image/*" />
            </label>
          </div>
          <div className="text-center sm:text-left mt-2 sm:mt-0">
            <h2 className="text-2xl font-bold">{user?.name || 'Barbero'}</h2>
            <p className="text-gray-400 font-mono-price">@barbero_pro</p>
          </div>
        </BrutalCard>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <BrutalCard padding={false} className="p-4 text-center">
            <p className="text-sm text-gray-400 uppercase tracking-wider">Clientes</p>
            <p className="text-2xl font-mono-price font-bold mt-1">450+</p>
          </BrutalCard>
          <BrutalCard padding={false} className="p-4 text-center">
            <p className="text-sm text-gray-400 uppercase tracking-wider">Reseñas</p>
            <p className="text-2xl font-mono-price font-bold mt-1">128</p>
          </BrutalCard>
          <BrutalCard padding={false} className="p-4 text-center border-gold-500 text-gold-500">
            <p className="text-sm uppercase tracking-wider">Ingresos</p>
            <p className="text-2xl font-mono-price font-bold mt-1">$1.2M</p>
          </BrutalCard>
        </div>

        {/* Bio & Specialties */}
        <BrutalCard padding={false} className="overflow-hidden">
          <div className="p-4 sm:p-6 bg-dark-300 border-b-2 border-[#333]">
            <h3 className="font-bold flex items-center gap-2 uppercase tracking-wide"><Scissors size={18} className="text-gold-500"/> Información Profesional</h3>
          </div>
          <div className="p-4 sm:p-6 space-y-6">
            <div>
              <label className="block text-sm uppercase font-bold text-gray-400 mb-2">Biografía</label>
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={300}
                className="w-full bg-dark-200 border-2 border-[#333] focus:border-gold-500 focus:shadow-[4px_4px_0_#d4af37] text-white p-4 h-32 resize-none outline-none transition-all"
                placeholder="Cuéntale a tus clientes sobre ti..."
              />
              <div className="text-right text-xs text-gray-500 mt-1 font-mono-price">{bio.length}/300</div>
            </div>

            <div>
              <label className="block text-sm uppercase font-bold text-gray-400 mb-3">Especialidades</label>
              <div className="flex flex-wrap gap-2">
                {PREDEFINED_SPECIALTIES.map(sp => {
                  const isSelected = specialties.includes(sp);
                  return (
                    <button
                      key={sp}
                      onClick={() => toggleSpecialty(sp)}
                      className={`brutal-badge cursor-pointer px-3 py-1.5 transition-all ${
                        isSelected 
                        ? 'bg-gold-500 text-dark-500 border-dark-500 shadow-[2px_2px_0_#0a0a0a]' 
                        : 'bg-dark-200 text-gray-400 border-[#333] hover:border-gray-500'
                      }`}
                    >
                      {sp}
                    </button>
                  );
                })}
              </div>
            </div>

            <Button onClick={handleSaveBio} className="w-full brutal-btn-primary">Guardar Cambios</Button>
          </div>
        </BrutalCard>

        {/* Portfolio */}
        <BrutalCard padding={false}>
           <div className="p-4 sm:p-6 bg-dark-300 border-b-2 border-[#333] flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2 uppercase tracking-wide"><ImageIcon size={18} className="text-gold-500"/> Portafolio</h3>
            <label className="brutal-btn-outline px-4 py-1 text-xs cursor-pointer inline-block">
              + Subir Foto
              <input type="file" className="hidden" accept="image/*" />
            </label>
          </div>
          <div className="p-4 sm:p-6">
            {portfolio.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed border-[#333] rounded-[4px]">
                <ImageIcon size={40} className="mx-auto mb-2 opacity-50" />
                <p>No has subido fotos a tu portafolio</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {/* Images would go here */}
              </div>
            )}
          </div>
        </BrutalCard>
      </div>
    </PageTransition>
  );
}

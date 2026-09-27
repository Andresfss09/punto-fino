import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Bell, Camera, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import PageTransition from '../../components/ui/PageTransition';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Mínimo 6 caracteres'),
  newPassword: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string().min(6, 'Mínimo 6 caracteres'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export default function ClientProfile() {
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState(user?.avatar || null);

  const { register: passReg, handleSubmit: handlePassSubmit, reset, formState: { errors: passErrors } } = useForm({
    resolver: zodResolver(passwordSchema)
  });

  const onPasswordChange = async (data) => {
    try {
      await authService.changePassword(data);
      toast.success('Contraseña actualizada exitosamente');
      setShowPassword(false);
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al cambiar contraseña');
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
      toast.success('Foto de perfil actualizada');
    }
  };

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-20 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-[#1f2723]">
          <div>
            <span className="editorial-tag text-gold-400 block mb-1">Cuenta & Preferencias</span>
            <h1 className="font-serif italic text-3xl sm:text-4xl text-white">
              Mi <span className="text-gold-400">Perfil</span>
            </h1>
            <p className="text-[#8e9b94] text-xs font-sans mt-1">
              Información personal, seguridad y preferencias de notificación
            </p>
          </div>
        </div>

        {/* User Card */}
        <div className="bg-[#121815] border border-[#1f2723] rounded-[4px] p-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-[4px] bg-[#161d19] border border-gold-400/40 overflow-hidden flex items-center justify-center font-serif italic text-3xl text-gold-400 font-bold shadow-sm">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0) || 'C'
              )}
            </div>
            <label 
              className="absolute -bottom-2 -right-2 bg-gold-400 hover:bg-gold-300 text-[#0e1311] p-1.5 rounded-[4px] cursor-pointer transition-transform hover:scale-105 shadow-sm"
              title="Cambiar fotografía"
            >
              <Camera size={14} />
              <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
            </label>
          </div>
          
          <div className="text-center sm:text-left">
            <h2 className="font-serif italic text-2xl text-white">{user?.name || 'Cliente'}</h2>
            <div className="flex items-center gap-2 justify-center sm:justify-start mt-1">
              <span className="editorial-tag text-gold-400 bg-[#161d19] border border-gold-400/30 px-2 py-0.5 rounded-[2px]">
                Cliente Distinguido
              </span>
              <span className="text-[#8e9b94] text-xs font-mono">Punto Fino Club</span>
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="bg-[#121815] border border-[#1f2723] rounded-[4px] overflow-hidden">
          <div className="p-4 sm:p-5 bg-[#161d19]/60 border-b border-[#1f2723] flex items-center gap-2">
            <User size={16} className="text-gold-400" />
            <h3 className="font-serif italic text-lg text-white">Información Personal</h3>
          </div>
          <div className="p-5 sm:p-6 space-y-4">
            <div>
              <label className="text-[#8e9b94] font-sans text-[11px] uppercase tracking-wider mb-1 block">Nombre Completo</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
                <input 
                  value={user?.name || ''} 
                  readOnly 
                  className="w-full bg-[#0e1311] border border-[#222a26] text-[#dfdbca] rounded-[4px] pl-9 pr-3 py-2 text-xs outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="text-[#8e9b94] font-sans text-[11px] uppercase tracking-wider mb-1 block">Correo Electrónico</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
                <input 
                  value={user?.email || ''} 
                  readOnly 
                  className="w-full bg-[#0e1311] border border-[#222a26] text-[#dfdbca] rounded-[4px] pl-9 pr-3 py-2 text-xs outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="text-[#8e9b94] font-sans text-[11px] uppercase tracking-wider mb-1 block">Teléfono de Contacto</label>
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
                <input 
                  value={user?.phone || '+57 300 000 0000'} 
                  readOnly 
                  className="w-full bg-[#0e1311] border border-[#222a26] text-[#dfdbca] rounded-[4px] pl-9 pr-3 py-2 text-xs outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-[#121815] border border-[#1f2723] rounded-[4px] overflow-hidden">
          <div 
            className="p-4 sm:p-5 bg-[#161d19]/60 flex justify-between items-center cursor-pointer hover:bg-[#161d19] transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            <div className="flex items-center gap-2">
              <Lock size={16} className="text-gold-400" />
              <h3 className="font-serif italic text-lg text-white">Seguridad de la Cuenta</h3>
            </div>
            {showPassword ? <ChevronUp size={18} className="text-gold-400" /> : <ChevronDown size={18} className="text-[#8e9b94]" />}
          </div>

          {showPassword && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="p-5 sm:p-6 border-t border-[#1f2723]">
              <form onSubmit={handlePassSubmit(onPasswordChange)} className="space-y-4">
                <div>
                  <label className="text-[#8e9b94] font-sans text-[11px] uppercase tracking-wider mb-1 block">Contraseña Actual</label>
                  <input 
                    type="password" 
                    {...passReg('currentPassword')} 
                    placeholder="Ingresa tu contraseña actual"
                    className="w-full bg-[#0e1311] border border-[#222a26] text-white focus:border-gold-400/50 rounded-[4px] px-3 py-2 text-xs outline-none transition-colors"
                  />
                  {passErrors.currentPassword && <p className="text-rose-400 text-xs mt-1">{passErrors.currentPassword.message}</p>}
                </div>

                <div>
                  <label className="text-[#8e9b94] font-sans text-[11px] uppercase tracking-wider mb-1 block">Nueva Contraseña</label>
                  <input 
                    type="password" 
                    {...passReg('newPassword')} 
                    placeholder="Mínimo 6 caracteres"
                    className="w-full bg-[#0e1311] border border-[#222a26] text-white focus:border-gold-400/50 rounded-[4px] px-3 py-2 text-xs outline-none transition-colors"
                  />
                  {passErrors.newPassword && <p className="text-rose-400 text-xs mt-1">{passErrors.newPassword.message}</p>}
                </div>

                <div>
                  <label className="text-[#8e9b94] font-sans text-[11px] uppercase tracking-wider mb-1 block">Confirmar Nueva Contraseña</label>
                  <input 
                    type="password" 
                    {...passReg('confirmPassword')} 
                    placeholder="Repite la nueva contraseña"
                    className="w-full bg-[#0e1311] border border-[#222a26] text-white focus:border-gold-400/50 rounded-[4px] px-3 py-2 text-xs outline-none transition-colors"
                  />
                  {passErrors.confirmPassword && <p className="text-rose-400 text-xs mt-1">{passErrors.confirmPassword.message}</p>}
                </div>

                <div className="pt-2 flex justify-end">
                  <button 
                    type="submit" 
                    className="bg-gold-400 hover:bg-gold-300 text-[#0e1311] font-sans font-semibold text-xs uppercase tracking-wider px-5 py-2.5 rounded-[4px] transition-all cursor-pointer shadow-sm"
                  >
                    Actualizar Contraseña
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>

        {/* Notifications */}
        <div className="bg-[#121815] border border-[#1f2723] rounded-[4px] overflow-hidden">
          <div className="p-4 sm:p-5 bg-[#161d19]/60 border-b border-[#1f2723] flex items-center gap-2">
            <Bell size={16} className="text-gold-400" />
            <h3 className="font-serif italic text-lg text-white">Preferencias de Notificación</h3>
          </div>
          <div className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-xs font-sans font-medium">Confirmaciones por Correo</p>
                <p className="text-[#8e9b94] text-[11px]">Recibe recibos y recordatorios de tus citas</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-10 h-5 bg-[#0e1311] border border-[#222a26] rounded-[4px] peer peer-checked:bg-gold-400/30 peer-checked:border-gold-400 transition-colors"></div>
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-gold-400 rounded-[2px] transition-transform peer-checked:translate-x-5"></div>
              </label>
            </div>
            
            <div className="border-t border-[#1f2723]"></div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-xs font-sans font-medium">Recordatorios por WhatsApp</p>
                <p className="text-[#8e9b94] text-[11px]">Notificación directa 2 horas antes de tu corte</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-10 h-5 bg-[#0e1311] border border-[#222a26] rounded-[4px] peer peer-checked:bg-gold-400/30 peer-checked:border-gold-400 transition-colors"></div>
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-gold-400 rounded-[2px] transition-transform peer-checked:translate-x-5"></div>
              </label>
            </div>
          </div>
        </div>

      </div>
    </PageTransition>
  );
}

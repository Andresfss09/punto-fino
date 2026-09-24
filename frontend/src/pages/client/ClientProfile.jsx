import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Bell, Camera, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import BrutalCard from '../../components/ui/BrutalCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
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

  const { register: passReg, handleSubmit: handlePassSubmit, formState: { errors: passErrors } } = useForm({
    resolver: zodResolver(passwordSchema)
  });

  const onPasswordChange = async (data) => {
    try {
      await authService.changePassword(data);
      toast.success('Contraseña actualizada');
      setShowPassword(false);
    } catch (error) {
      toast.error('Error al cambiar contraseña');
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Fake upload for now
      setAvatar(URL.createObjectURL(file));
      toast.success('Avatar actualizado (Simulado)');
    }
  };

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
        <h1 className="text-3xl font-display font-bold uppercase tracking-wider text-gold-500">Mi Perfil</h1>

        <BrutalCard className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-dark-300 border-2 border-[#333] shadow-brutal-sm overflow-hidden">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <User size={40} />
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-gold-500 text-dark-500 p-2 rounded-full cursor-pointer border-2 border-dark-500 shadow-brutal-sm hover:scale-105 transition-transform">
              <Camera size={16} />
              <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
            </label>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold">{user?.name || 'Cliente'}</h2>
            <p className="text-gray-400 font-mono-price text-sm">Cliente VIP</p>
          </div>
        </BrutalCard>

        <BrutalCard padding={false} className="overflow-hidden">
          <div className="p-4 sm:p-6 bg-dark-300 border-b-2 border-[#333]">
            <h3 className="font-bold flex items-center gap-2 uppercase tracking-wide"><User size={18} className="text-gold-500"/> Información Personal</h3>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            <Input label="Nombre" value={user?.name || ''} readOnly icon={User} className="opacity-75 bg-dark-200 cursor-not-allowed" />
            <Input label="Email" value={user?.email || ''} readOnly icon={Mail} className="opacity-75 bg-dark-200 cursor-not-allowed" />
            <Input label="Teléfono" value={user?.phone || '+57 300 000 0000'} readOnly icon={Phone} className="opacity-75 bg-dark-200 cursor-not-allowed" />
          </div>
        </BrutalCard>

        <BrutalCard padding={false}>
          <div 
            className="p-4 sm:p-6 bg-dark-300 flex justify-between items-center cursor-pointer hover:bg-dark-200 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            <h3 className="font-bold flex items-center gap-2 uppercase tracking-wide"><Lock size={18} className="text-gold-500"/> Seguridad</h3>
            {showPassword ? <ChevronUp /> : <ChevronDown />}
          </div>
          {showPassword && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="p-4 sm:p-6 border-t-2 border-[#333]">
              <form onSubmit={handlePassSubmit(onPasswordChange)} className="space-y-4">
                <Input type="password" label="Contraseña Actual" {...passReg('currentPassword')} error={passErrors.currentPassword?.message} />
                <Input type="password" label="Nueva Contraseña" {...passReg('newPassword')} error={passErrors.newPassword?.message} />
                <Input type="password" label="Confirmar Contraseña" {...passReg('confirmPassword')} error={passErrors.confirmPassword?.message} />
                <Button type="submit" className="w-full brutal-btn-primary">Actualizar Contraseña</Button>
              </form>
            </motion.div>
          )}
        </BrutalCard>

        <BrutalCard padding={false}>
          <div className="p-4 sm:p-6 bg-dark-300 border-b-2 border-[#333]">
            <h3 className="font-bold flex items-center gap-2 uppercase tracking-wide"><Bell size={18} className="text-gold-500"/> Notificaciones</h3>
          </div>
          <div className="p-4 sm:p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">Notificaciones por Email</p>
                <p className="text-sm text-gray-400">Recordatorios de citas y promos</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-dark-200 border-2 border-[#333] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#333] after:border-[#333] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold-500 peer-checked:after:bg-dark-500"></div>
              </label>
            </div>
            <div className="brutal-divider"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">Notificaciones por WhatsApp</p>
                <p className="text-sm text-gray-400">Mensajes de confirmación</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-dark-200 border-2 border-[#333] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#333] after:border-[#333] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold-500 peer-checked:after:bg-dark-500"></div>
              </label>
            </div>
          </div>
        </BrutalCard>
      </div>
    </PageTransition>
  );
}

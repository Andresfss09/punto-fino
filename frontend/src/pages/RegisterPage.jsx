import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import useAuthStore from '../store/useAuthStore';
import Input from '../components/ui/Input';

const registerSchema = z.object({
  name: z.string().min(2, 'Nombre mínimo 2 caracteres').max(50, 'Nombre máximo 50 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().length(10, 'El teléfono debe tener 10 dígitos'),
  password: z.string().min(6, 'Contraseña mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await authService.register({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: 'cliente',
      });
      setAuth(response.user, response.token);
      toast.success('¡Cuenta creada! Bienvenido a Punto Fino');
      navigate('/cliente');
    } catch (error) {
      toast.error(error.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-20 text-white">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-block group mb-3">
            <img
              src="/logo.png"
              alt="Punto Fino"
              className="w-14 h-14 object-contain invert contrast-150 mx-auto transition-transform group-hover:scale-105"
            />
          </Link>
          <h1 className="font-display font-medium text-2xl uppercase tracking-[3px] text-white">
            PUNTO FINO
          </h1>
          <p className="text-[#888888] mt-1 text-[10px] uppercase tracking-[3px] font-display">
            REGISTRO DE CLIENTE · CALI
          </p>
        </div>

        <div className="bg-[#111111] border border-[#262626] rounded-none p-7">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Nombre completo"
              placeholder="Juan Pérez"
              icon={User}
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="tu@email.com"
              icon={Mail}
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Teléfono / WhatsApp"
              placeholder="3122398964"
              icon={Phone}
              maxLength={10}
              error={errors.phone?.message}
              {...register('phone')}
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="Mínimo 6 caracteres"
              icon={Lock}
              error={errors.password?.message}
              {...register('password')}
            />
            <Input
              label="Confirmar contraseña"
              type="password"
              placeholder="Repite la contraseña"
              icon={Lock}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-[#e0e0e0] text-black font-display font-medium text-xs uppercase tracking-[2px] py-3.5 rounded-none transition-all cursor-pointer mt-4"
            >
              {loading ? 'CREANDO CUENTA...' : 'CREAR CUENTA'}
            </button>
          </form>

          <p className="text-center text-[#888888] text-xs font-sans mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-white hover:underline uppercase tracking-wider font-display text-[11px] ml-1">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
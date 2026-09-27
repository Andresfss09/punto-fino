import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import useAuthStore from '../store/useAuthStore';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

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
    <div className="min-h-screen bg-[#000000] flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-block group mb-4">
            <img
              src="/logo.png"
              alt="Punto Fino Barbería"
              className="w-20 h-20 object-contain rounded-none border border-[#1e1e1e] shadow-md mx-auto group-hover:scale-105 transition-transform"
            />
          </Link>
          <h1 className="font-sans font-medium uppercase tracking-[0.2em] text-2xl text-white">Registro de Cliente</h1>
          <p className="text-[#888888] mt-1.5 text-xs uppercase tracking-[0.25em] font-sans">
            Punto Fino · Barbería de Autor
          </p>
        </div>

        <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-none p-7">
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
              placeholder="3001234567"
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
              placeholder="Repite tu contraseña"
              icon={Lock}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-ferrari-primary text-xs uppercase tracking-[0.2em] py-3.5 mt-2 rounded-none cursor-pointer"
            >
              {loading ? 'Creando cuenta...' : 'Crear Cuenta de Cliente'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#1e1e1e] text-center">
            <p className="text-[#888888] text-xs font-sans">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-white hover:text-[#888888] font-medium transition-colors underline underline-offset-4">
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
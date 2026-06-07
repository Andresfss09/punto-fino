import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, Scissors } from 'lucide-react';
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
      toast.success('¡Cuenta creada! Bienvenido a Punto Fino 🔥');
      navigate('/cliente');
    } catch (error) {
      toast.error(error.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-400 flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-gold-500 to-gold-700 rounded-2xl mb-4 shadow-lg shadow-gold-500/30">
            <Scissors size={24} className="text-black rotate-45" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Crea tu cuenta</h1>
          <p className="text-gray-400 mt-1 text-sm">Únete a la comunidad Punto Fino</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Nombre completo"
              placeholder="Juan Pérez"
              icon={User}
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              icon={Mail}
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Teléfono"
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

            <Button type="submit" loading={loading} className="w-full mt-2">
              Crear cuenta gratis
            </Button>
          </form>

          <p className="text-center text-gray-400 mt-6 text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">
              Inicia sesión
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
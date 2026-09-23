import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Scissors, Eye, EyeOff, Shield, User, Crown } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import useAuthStore from '../store/useAuthStore';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

const roles = [
  {
    id: 'cliente',
    label: 'Cliente',
    description: 'Reserva y gestiona tus citas',
    icon: User,
    color: 'from-blue-500 to-blue-700',
    border: 'border-blue-500',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    emoji: '💈',
  },
  {
    id: 'barbero',
    label: 'Barbero',
    description: 'Gestiona tu agenda y clientes',
    icon: Scissors,
    color: 'from-gold-500 to-gold-700',
    border: 'border-gold-500',
    bg: 'bg-gold-500/10',
    text: 'text-gold-400',
    emoji: '✂️',
  },
  {
    id: 'admin',
    label: 'Administrador',
    description: 'Control total de la plataforma',
    icon: Crown,
    color: 'from-purple-500 to-purple-700',
    border: 'border-purple-500',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    emoji: '👑',
  },
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    reset();
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await authService.login(data);
      const userRole = response.user.role;

      if (userRole !== selectedRole) {
        toast.error(`Esta cuenta no es de tipo "${roles.find(r => r.id === selectedRole)?.label}". Tu rol es: ${userRole}`);
        setLoading(false);
        return;
      }

      setAuth(response.user, response.token);
      toast.success(`¡Bienvenido, ${response.user.name.split(' ')[0]}!`);

      if (userRole === 'admin') navigate('/admin');
      else if (userRole === 'barbero') navigate('/barber');
      else navigate('/cliente');
    } catch (error) {
      toast.error(error.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  const activeRole = roles.find((r) => r.id === selectedRole);

  return (
    <div className="min-h-screen bg-dark-400 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-700 rounded-2xl mb-4 shadow-lg shadow-gold-500/30">
            <Scissors size={28} className="text-black rotate-45" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Punto Fino</h1>
          <p className="text-gray-500 mt-1 text-sm">Barbería Premium · Cali</p>
        </motion.div>

        <AnimatePresence mode="wait">

          {/* PASO 1: Seleccionar rol */}
          {!selectedRole && (
            <motion.div
              key="role-selector"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-2xl font-bold text-white text-center mb-2">¿Cómo ingresas?</h2>
              <p className="text-gray-400 text-center text-sm mb-8">Selecciona tu tipo de cuenta</p>

              <div className="space-y-3">
                {roles.map((role, index) => {
                  const Icon = role.icon;
                  return (
                    <motion.button
                      key={role.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleRoleSelect(role.id)}
                      className={`w-full flex items-center gap-4 p-5 rounded-2xl border border-white/10 bg-dark-100 hover:border-white/20 hover:bg-dark-50 transition-all duration-200 group`}
                    >
                      <div className={`w-14 h-14 bg-gradient-to-br ${role.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform`}>
                        <span className="text-2xl">{role.emoji}</span>
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-white font-semibold text-lg">{role.label}</p>
                        <p className="text-gray-400 text-sm">{role.description}</p>
                      </div>
                      <div className="text-gray-600 group-hover:text-gray-400 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 18l6-6-6-6"/>
                        </svg>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <p className="text-center text-gray-500 mt-8 text-sm">
                ¿No tienes cuenta?{' '}
                <Link to="/register" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">
                  Regístrate gratis
                </Link>
              </p>
            </motion.div>
          )}

          {/* PASO 2: Formulario de login según rol */}
          {selectedRole && (
            <motion.div
              key="login-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Header del rol seleccionado */}
              <div className={`${activeRole.bg} border ${activeRole.border}/30 rounded-2xl p-5 mb-8 flex items-center gap-4`}>
                <div className={`w-14 h-14 bg-gradient-to-br ${activeRole.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  <span className="text-2xl">{activeRole.emoji}</span>
                </div>
                <div>
                  <p className={`${activeRole.text} text-xs font-medium tracking-widest uppercase`}>
                    Acceso
                  </p>
                  <p className="text-white font-bold text-xl">{activeRole.label}</p>
                  <p className="text-gray-400 text-sm">{activeRole.description}</p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white mb-1">Iniciar sesión</h2>
              <p className="text-gray-400 text-sm mb-6">Ingresa tus credenciales de {activeRole.label.toLowerCase()}</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder={`email@ejemplo.com`}
                  icon={Mail}
                  error={errors.email?.message}
                  {...register('email')}
                />

                <div>
                  <label className="label">Contraseña</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Tu contraseña"
                      className={`input-field pl-11 pr-11 ${errors.password ? '!border-red-500/70 focus:!border-red-500 focus:!ring-red-500/20' : ''}`}
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors z-10 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.password.message}</p>}
                </div>

                <div className="flex justify-end">
                  <Link to="/forgot-password" className="text-sm text-gold-400 hover:text-gold-300 transition-colors">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <Button
                  type="submit"
                  loading={loading}
                  className={`w-full bg-gradient-to-r ${activeRole.color} text-${selectedRole === 'barbero' ? 'black' : 'white'} font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-all shadow-lg`}
                >
                  Ingresar como {activeRole.label}
                </Button>
              </form>

              <button
                onClick={() => setSelectedRole(null)}
                className="w-full mt-4 py-3 text-gray-500 hover:text-gray-300 text-sm transition-colors flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Cambiar tipo de cuenta
              </button>

              {selectedRole === 'cliente' && (
                <p className="text-center text-gray-500 mt-4 text-sm">
                  ¿No tienes cuenta?{' '}
                  <Link to="/register" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">
                    Regístrate gratis
                  </Link>
                </p>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
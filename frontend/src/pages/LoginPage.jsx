import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Scissors, Eye, EyeOff, User, Crown, ArrowLeft } from 'lucide-react';
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
    description: 'Reserva y gestiona tus citas personales',
    icon: User,
    color: 'from-amber-600 to-amber-800',
    border: 'border-[#333d38]',
    bg: 'bg-[#121815]',
    text: 'text-gold-400',
    emoji: '💈',
  },
  {
    id: 'barbero',
    label: 'Maestro Barbero',
    description: 'Controla tu agenda diaria y clientes',
    icon: Scissors,
    color: 'from-gold-500 to-gold-700',
    border: 'border-gold-400/40',
    bg: 'bg-[#121815]',
    text: 'text-gold-400',
    emoji: '✂️',
  },
  {
    id: 'admin',
    label: 'Administrador',
    description: 'Gestión total, nómina y métricas del atelier',
    icon: Crown,
    color: 'from-zinc-700 to-zinc-900',
    border: 'border-[#333d38]',
    bg: 'bg-[#121815]',
    text: 'text-[#dfdbca]',
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
      toast.success(`¡Bienvenido a Punto Fino, ${response.user.name.split(' ')[0]}!`);

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
    <div className="min-h-screen bg-[#0e1311] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        {/* Logo Brand */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-block group mb-3">
            <img
              src="/logo.png"
              alt="Punto Fino Barbería"
              className="w-16 h-16 object-contain rounded-full border border-gold-400/40 mx-auto group-hover:scale-105 transition-transform"
            />
          </Link>
          <h1 className="font-serif italic text-4xl text-white tracking-tight leading-none">
            Punto Fino
          </h1>
          <p className="text-gold-400 mt-1.5 text-xs tracking-[0.25em] uppercase font-sans font-medium">
            Barbería de Autor · Cali
          </p>
        </motion.div>

        <AnimatePresence mode="wait">

          {/* PASO 1: Seleccionar rol */}
          {!selectedRole && (
            <motion.div
              key="role-selector"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <div className="text-center mb-6">
                <h2 className="font-serif italic text-2xl text-white">Portal de Acceso</h2>
                <p className="text-[#808080] font-sans text-xs mt-1">Selecciona el perfil con el que deseas ingresar</p>
              </div>

              <div className="space-y-3">
                {roles.map((role, index) => {
                  return (
                    <motion.button
                      key={role.id}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 }}
                      onClick={() => handleRoleSelect(role.id)}
                      className="w-full flex items-center gap-4 p-4 rounded-[4px] border border-[#222a26] bg-[#121815] hover:border-gold-400/60 hover:bg-[#151c18] transition-all duration-200 group text-left cursor-pointer"
                    >
                      <div className="w-11 h-11 bg-[#161d19] border border-[#2b3530] rounded-[4px] flex items-center justify-center flex-shrink-0 text-xl group-hover:border-gold-400/50 transition-colors">
                        {role.emoji}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-serif italic text-lg leading-tight group-hover:text-gold-300 transition-colors">
                          {role.label}
                        </p>
                        <p className="text-[#808080] text-xs font-sans mt-0.5">{role.description}</p>
                      </div>
                      <div className="text-[#808080] group-hover:text-gold-400 transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 18l6-6-6-6"/>
                        </svg>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <p className="text-center text-[#808080] mt-8 text-xs font-sans">
                ¿Aún no tienes cuenta?{' '}
                <Link to="/register" className="text-gold-400 hover:text-white font-medium transition-colors underline underline-offset-4">
                  Crear cuenta de cliente
                </Link>
              </p>
            </motion.div>
          )}

          {/* PASO 2: Formulario de login según rol */}
          {selectedRole && (
            <motion.div
              key="login-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              {/* Header del rol seleccionado */}
              <div className="bg-[#121815] border border-[#222a26] rounded-[4px] p-4 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#161d19] border border-[#2b3530] rounded-[4px] flex items-center justify-center text-lg">
                    {activeRole.emoji}
                  </div>
                  <div>
                    <span className="editorial-tag bg-[#161d19] border-[#2b3530] text-gold-400 mb-1">
                      {activeRole.label}
                    </span>
                    <p className="font-serif italic text-white text-lg leading-tight mt-0.5">Ingresar al Atelier</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRole(null)}
                  className="text-xs font-sans text-[#808080] hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft size={13} /> Cambiar
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Correo Electrónico"
                  type="email"
                  placeholder="ejemplo@puntofino.com"
                  icon={Mail}
                  error={errors.email?.message}
                  {...register('email')}
                />

                <div>
                  <label className="label">Contraseña</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#808080] pointer-events-none z-10">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Tu contraseña secreta"
                      className={`input-field pl-10 pr-10 text-xs ${errors.password ? '!border-red-500/70 focus:!border-red-500' : ''}`}
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#808080] hover:text-white transition-colors z-10 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.password.message}</p>}
                </div>

                <div className="flex justify-end">
                  <Link to="/forgot-password" className="text-xs font-sans text-gold-400 hover:text-white transition-colors">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary text-xs uppercase tracking-wider py-3.5"
                >
                  {loading ? 'Accediendo...' : `Iniciar Sesión (${activeRole.label})`}
                </button>
              </form>

              {selectedRole === 'cliente' && (
                <p className="text-center text-[#808080] mt-6 text-xs font-sans">
                  ¿No tienes cuenta?{' '}
                  <Link to="/register" className="text-gold-400 hover:text-white font-medium transition-colors underline underline-offset-4">
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
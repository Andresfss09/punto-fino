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
    id: 'barbero',
    label: 'Barbero',
    description: 'Controla tu agenda diaria y citas',
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
    description: 'Gestión total, nómina y métricas de la barbería',
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
      toast.success(`¡Bienvenido a Triadix, ${response.user.name.split(' ')[0]}!`);

      if (userRole === 'admin') navigate('/admin');
      else if (userRole === 'barbero') navigate('/barber');
      else navigate('/');
    } catch (error) {
      toast.error(error.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  const activeRole = roles.find((r) => r.id === selectedRole);

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        {/* Logo Brand */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-block group mb-4">
            <img
              src="/logo.png"
              alt="Barbería Triadix"
              className="w-20 h-20 object-contain rounded-none border border-[#1e1e1e] p-2 bg-[#0d0d0d] shadow-md mx-auto group-hover:scale-105 transition-transform"
            />
          </Link>
          <h1 className="font-sans font-medium uppercase tracking-[0.2em] text-2xl text-white">
            Triadix
          </h1>
          <p className="text-[#888888] mt-1.5 text-xs tracking-[0.25em] uppercase font-sans">
            Barbería · Cali
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
                <h2 className="font-sans font-medium uppercase tracking-[0.16em] text-lg text-white">Portal de Acceso</h2>
                <p className="text-[#888888] font-sans text-xs mt-1">Acceso exclusivo para el personal de la barbería</p>
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
                      className="w-full flex items-center gap-4 p-4 rounded-none border border-[#1e1e1e] bg-[#0a0a0a] hover:border-white/40 hover:bg-[#141414] transition-all duration-200 group text-left cursor-pointer"
                    >
                      <div className="w-11 h-11 bg-[#141414] border border-[#222222] rounded-none flex items-center justify-center flex-shrink-0 text-xl group-hover:border-white/30 transition-colors">
                        {role.emoji}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-sans font-medium uppercase tracking-[0.16em] text-xs leading-tight group-hover:text-white transition-colors">
                          {role.label}
                        </p>
                        <p className="text-[#888888] text-xs font-sans mt-1">{role.description}</p>
                      </div>
                      <div className="text-[#666666] group-hover:text-white transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 18l6-6-6-6"/>
                        </svg>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <p className="text-center text-[#888888] mt-8 text-xs font-sans">
                ¿Deseas agendar un servicio?{' '}
                <Link to="/#reservar" className="text-white hover:text-[#888888] font-medium transition-colors underline underline-offset-4">
                  Reservar cita sin cuenta
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
              <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-none p-4 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#141414] border border-[#222222] rounded-none flex items-center justify-center text-lg">
                    {activeRole.emoji}
                  </div>
                  <div>
                    <span className="px-2 py-0.5 border border-[#222222] bg-[#141414] text-[10px] font-sans font-medium uppercase tracking-[0.16em] text-[#888888] mb-1 inline-block">
                      {activeRole.label}
                    </span>
                    <p className="font-sans font-medium uppercase tracking-[0.16em] text-white text-xs leading-tight mt-0.5">Ingresar al Sistema</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRole(null)}
                  className="text-xs font-sans text-[#888888] hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft size={13} /> Cambiar
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Correo Electrónico"
                  type="email"
                  placeholder="ejemplo@triadix.co"
                  icon={Mail}
                  error={errors.email?.message}
                  {...register('email')}
                />

                <div>
                  <label className="label">Contraseña</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888888] pointer-events-none z-10">
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
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#888888] hover:text-white transition-colors z-10 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.password.message}</p>}
                </div>

                <div className="flex justify-end">
                  <Link to="/forgot-password" className="text-xs font-sans text-[#888888] hover:text-white transition-colors">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-ferrari-primary text-xs uppercase tracking-[0.2em] py-3.5 rounded-none cursor-pointer"
                >
                  {loading ? 'Accediendo...' : `Iniciar Sesión (${activeRole.label})`}
                </button>
              </form>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
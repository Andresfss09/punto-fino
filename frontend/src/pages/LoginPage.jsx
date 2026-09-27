import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Scissors, Eye, EyeOff, User, Crown, ArrowLeft, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import useAuthStore from '../store/useAuthStore';
import Input from '../components/ui/Input';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

const roles = [
  {
    id: 'cliente',
    label: 'Cliente',
    description: 'Gestiona tus citas y consulta tu historial',
    icon: User,
  },
  {
    id: 'barbero',
    label: 'Maestro Barbero',
    description: 'Control de agenda diaria y citas asignadas',
    icon: Scissors,
  },
  {
    id: 'admin',
    label: 'Administrador',
    description: 'Control total, métricas y gestión de personal',
    icon: Crown,
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
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-20 text-white">
      <div className="w-full max-w-md">

        {/* Brand Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <Link to="/" className="inline-block group mb-3">
            <img
              src="/logo.png"
              alt="Punto Fino"
              className="w-14 h-14 object-contain invert contrast-150 mx-auto transition-transform group-hover:scale-105"
            />
          </Link>
          <h1 className="font-display font-medium text-2xl text-white uppercase tracking-[3px] leading-tight">
            PUNTO FINO
          </h1>
          <p className="text-[#888888] mt-1 text-[10px] tracking-[3px] uppercase font-display">
            PORTAL OFICIAL · CALI
          </p>
        </motion.div>

        <AnimatePresence mode="wait">

          {/* PASO 1: Seleccionar rol */}
          {!selectedRole && (
            <motion.div
              key="role-selector"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="text-center mb-6">
                <span className="text-[10px] uppercase font-display tracking-[2px] text-[#888888] block mb-1">
                  SELECCIONA TU PERFIL
                </span>
                <h2 className="font-display font-medium text-lg uppercase tracking-[2px] text-white">
                  ACCESO A PLATAFORMA
                </h2>
              </div>

              <div className="space-y-3">
                {roles.map((role, index) => {
                  const Icon = role.icon;
                  return (
                    <motion.button
                      key={role.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleRoleSelect(role.id)}
                      className="w-full flex items-center gap-4 p-4 rounded-none border border-[#262626] bg-[#111111] hover:border-white hover:bg-[#161616] transition-all group text-left cursor-pointer"
                    >
                      <div className="w-10 h-10 bg-black border border-[#333333] rounded-none flex items-center justify-center shrink-0 group-hover:border-white transition-colors">
                        <Icon size={18} className="text-[#888888] group-hover:text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-display font-medium text-xs uppercase tracking-[1.5px] leading-tight group-hover:text-white">
                          {role.label}
                        </p>
                        <p className="text-[#888888] text-[11px] font-sans mt-0.5">{role.description}</p>
                      </div>
                      <div className="text-[#666666] group-hover:text-white transition-colors">
                        <ArrowRight size={15} />
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <p className="text-center text-[#888888] mt-8 text-xs font-sans">
                ¿Aún no tienes cuenta?{' '}
                <Link to="/register" className="text-white hover:underline uppercase tracking-wider font-display text-[11px] ml-1">
                  Crear cuenta
                </Link>
              </p>
            </motion.div>
          )}

          {/* PASO 2: Formulario de login */}
          {selectedRole && (
            <motion.div
              key="login-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* Header del rol */}
              <div className="bg-[#111111] border border-[#262626] rounded-none p-4 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-black border border-[#333333] rounded-none flex items-center justify-center text-white">
                    <activeRole.icon size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-display uppercase tracking-[2px] text-[#888888] block">
                      PERFIL SELECCIONADO
                    </span>
                    <p className="font-display font-medium text-white text-xs uppercase tracking-[1.5px] mt-0.5">
                      {activeRole.label}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRole(null)}
                  className="text-[11px] font-display uppercase tracking-wider text-[#888888] hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft size={12} /> CAMBIAR
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-xs font-display uppercase tracking-[2px] text-[#888888] mb-1.5">
                    CORREO ELECTRÓNICO
                  </label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666666]" />
                    <input
                      type="email"
                      placeholder="ejemplo@puntofino.com"
                      className="w-full bg-[#111111] border border-[#262626] focus:border-white text-white pl-10 pr-4 py-3 rounded-none text-xs font-mono focus:outline-none transition-all placeholder:text-[#555555]"
                      {...register('email')}
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-display uppercase tracking-[2px] text-[#888888] mb-1.5">
                    CONTRASEÑA
                  </label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666666]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="w-full bg-[#111111] border border-[#262626] focus:border-white text-white pl-10 pr-10 py-3 rounded-none text-xs font-mono focus:outline-none transition-all placeholder:text-[#555555]"
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#666666] hover:text-white transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white hover:bg-[#e0e0e0] text-black font-display font-medium text-xs uppercase tracking-[2px] py-3.5 rounded-none transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? 'ACCEDIENDO...' : `INGRESAR COMO ${activeRole.label.toUpperCase()}`}
                </button>
              </form>

              {selectedRole === 'cliente' && (
                <p className="text-center text-[#888888] mt-6 text-xs font-sans">
                  ¿No tienes cuenta?{' '}
                  <Link to="/register" className="text-white hover:underline uppercase tracking-wider font-display text-[11px] ml-1">
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
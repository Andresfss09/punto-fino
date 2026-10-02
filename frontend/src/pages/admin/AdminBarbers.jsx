import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Plus, Check, X, Phone, Mail, Scissors, AlertCircle, CheckCircle2 } from 'lucide-react';
import PageTransition from '../../components/ui/PageTransition';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function AdminBarbers() {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModal, setCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    password: false,
  });

  // Strict Validation Rules
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{3,50}$/;
  const isNameValid = nameRegex.test(form.name.trim());

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isEmailValid = emailRegex.test(form.email.trim());

  const phoneRegex = /^\d{10}$/;
  const isPhoneValid = phoneRegex.test(form.phone);

  const isPasswordValid = form.password.length >= 6;

  const isFormValid = isNameValid && isEmailValid && isPhoneValid && isPasswordValid;

  const fetchBarbers = () => {
    setLoading(true);
    api.get('/barbers')
      .then((res) => setBarbers(res.barbers || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBarbers(); }, []);

  const resetForm = () => {
    setForm({ name: '', email: '', phone: '', password: '' });
    setTouched({ name: false, email: false, phone: false, password: false });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true, password: true });

    if (!isNameValid) {
      toast.error('Nombre inválido: solo letras y espacios (mínimo 3 caracteres)');
      return;
    }
    if (!isEmailValid) {
      toast.error('Correo inválido: ingresa un formato de email estándar');
      return;
    }
    if (!isPhoneValid) {
      toast.error('Teléfono inválido: debe contener exactamente 10 dígitos numéricos');
      return;
    }
    if (!isPasswordValid) {
      toast.error('Contraseña inválida: mínimo 6 caracteres');
      return;
    }

    setCreating(true);
    try {
      await api.post('/auth/register', { 
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone,
        password: form.password,
        role: 'barbero' 
      });
      toast.success(`Barbero ${form.name.trim()} creado exitosamente`);
      setCreateModal(false);
      resetForm();
      fetchBarbers();
    } catch (error) {
      toast.error(error.message || 'Error al crear barbero');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleAvailable = async (barberId, currentStatus) => {
    try {
      await api.put(`/barbers/${barberId}/availability`, { isAvailable: !currentStatus });
      toast.success(currentStatus ? 'Barbero desactivado' : 'Barbero activado');
      fetchBarbers();
    } catch (error) {
      toast.error('Error al actualizar estado');
    }
  };

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-20">

        {/* Header — Depot Terminal Console Style */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-6 border-b border-[#2b292d]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#71d083] shadow-[0_0_8px_#71d083]"></span>
              <span className="text-[11px] font-mono uppercase tracking-[0.025em] text-[#71d083]">EQUIPO & STAFF DE CORTE</span>
            </div>
            <h1 className="font-sans font-semibold tracking-[-0.025em] text-2xl sm:text-3xl text-[#e5e5e5]">
              Gestión de <span className="text-[#71d083]">Barberos</span>
            </h1>
            <p className="text-[#7c7a85] text-xs font-sans mt-1">
              {barbers.length} barberos profesionales registrados y operativos en Triadix.
            </p>
          </div>
          <button
            onClick={() => { resetForm(); setCreateModal(true); }}
            className="btn-depot-primary"
          >
            <Plus size={15} />
            <span>Nuevo Barbero</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#71d083] border-t-transparent"></div>
          </div>
        ) : barbers.length === 0 ? (
          <div className="bg-[#121113] border border-[#2b292d] rounded-[6px] p-16 text-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
            <Scissors size={36} className="text-[#7c7a85] mx-auto mb-3" />
            <p className="font-sans font-medium uppercase tracking-[-0.025em] text-sm text-[#e5e5e5] mb-1">
              No hay barberos registrados
            </p>
            <p className="text-[#7c7a85] text-xs font-sans mb-5">
              Crea el primer perfil para que esté disponible en la agenda y reservas.
            </p>
            <button
              onClick={() => { resetForm(); setCreateModal(true); }}
              className="btn-depot-primary inline-flex items-center gap-2"
            >
              <Plus size={14} />
              Crear Barbero
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {barbers.map((barber) => (
              <div
                key={barber._id}
                className="bg-[#121113] border border-[#2b292d] hover:border-[#3c393f] transition-all rounded-[6px] p-6 flex flex-col justify-between shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
              >
                <div>
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-[#1a191b] border border-[#2b292d] rounded-[6px] flex items-center justify-center flex-shrink-0 text-[#71d083] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
                        <span className="font-mono text-base font-semibold">
                          {barber.user?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-sans font-medium text-sm text-[#e5e5e5] leading-tight tracking-[-0.025em]">
                          {barber.user?.name}
                        </p>
                        <p className="text-[#7c7a85] text-xs font-sans mt-0.5 tracking-[0.025em]">
                          Maestro Barbero
                        </p>
                      </div>
                    </div>
                    <span className={barber.isAvailable ? 'tag-depot-green' : 'tag-depot-danger'}>
                      {barber.isAvailable ? '● Activo' : '○ Inactivo'}
                    </span>
                  </div>

                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-2 text-[#7c7a85] text-xs">
                      <Mail size={13} className="text-[#b5b2bc]" />
                      <span className="truncate">{barber.user?.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#7c7a85] text-xs">
                      <Phone size={13} className="text-[#b5b2bc]" />
                      <span className="font-mono text-[#eeeef0]">{barber.user?.phone}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < Math.floor(barber.rating?.average || 0)
                          ? 'text-[#71d083] fill-[#71d083]'
                          : 'text-[#2b292d] fill-transparent'}
                      />
                    ))}
                    <span className="text-[#7c7a85] font-mono text-xs ml-1.5">
                      {barber.rating?.average || 0} ({barber.rating?.count || 0} reseñas)
                    </span>
                  </div>

                  {barber.specialties?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {barber.specialties.map((spec) => (
                        <span key={spec} className="tag-depot-neutral">
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-[#2b292d] mb-5 bg-[#1a191b]/50 rounded-[4px] px-2">
                    <div className="text-center">
                      <p className="font-mono font-medium text-[#e5e5e5] text-base">{barber.totalClients || 0}</p>
                      <p className="text-[#7c7a85] text-[10px] uppercase font-sans tracking-[0.025em]">Clientes atendidos</p>
                    </div>
                    <div className="text-center border-l border-[#2b292d]">
                      <p className="font-mono font-medium text-[#71d083] text-base">{barber.rating?.average || 0}</p>
                      <p className="text-[#7c7a85] text-[10px] uppercase font-sans tracking-[0.025em]">Calificación</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleAvailable(barber._id, barber.isAvailable)}
                  className={`w-full flex items-center justify-center gap-2 py-2 rounded-[6px] text-xs font-sans tracking-[0.025em] border transition-all cursor-pointer ${
                    barber.isAvailable
                      ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30'
                      : 'bg-[#1b2a1e] hover:bg-[#243d29] text-[#71d083] border-[#2d5736]'
                  }`}
                >
                  {barber.isAvailable
                    ? <><X size={13} /> Desactivar barbero</>
                    : <><Check size={13} /> Activar barbero</>
                  }
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Create Modal with Strict Validations */}
        <Modal
          isOpen={createModal}
          onClose={() => { setCreateModal(false); resetForm(); }}
          title="CREAR NUEVO BARBERO"
        >
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="p-3 bg-[#1a191b] border border-[#2b292d] rounded-[6px] text-[#7c7a85] text-xs leading-relaxed flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#71d083] mt-1.5 flex-shrink-0"></span>
              <span>
                Ingresa los datos obligatorios. Todos los campos están sujetos a parámetros estrictos de validación antes del registro.
              </span>
            </div>
            
            <div className="space-y-4 mb-6">
              {/* Field 1: Nombre Completo */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[#b5b2bc] font-sans text-[11px] uppercase tracking-[0.025em] block font-medium">
                    Nombre Completo <span className="text-[#71d083]">*</span>
                  </label>
                  {form.name && (
                    <span className="text-[10px] font-mono text-[#7c7a85]">
                      {form.name.length}/50
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ej: Nicolás Gómez"
                    value={form.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      // Restrict input: letters and spaces only
                      if (val === '' || /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]*$/.test(val)) {
                        setForm({ ...form, name: val });
                      }
                    }}
                    onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
                    className={`input-depot ${
                      touched.name && !isNameValid 
                        ? '!border-rose-500/70 focus:!border-rose-500' 
                        : touched.name && isNameValid 
                        ? '!border-[#2d5736]' 
                        : ''
                    }`}
                    maxLength={50}
                    required
                  />
                  {touched.name && isNameValid && (
                    <CheckCircle2 className="w-4 h-4 text-[#71d083] absolute right-3 top-3 pointer-events-none" />
                  )}
                </div>
                {touched.name && !isNameValid && (
                  <p className="text-rose-400 text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    Solo se permiten letras y espacios (mínimo 3 caracteres).
                  </p>
                )}
              </div>

              {/* Field 2: Correo Electrónico */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[#b5b2bc] font-sans text-[11px] uppercase tracking-[0.025em] block font-medium">
                    Correo Electrónico <span className="text-[#71d083]">*</span>
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="barbero@triadix.co"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value.trim() })}
                    onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                    className={`input-depot ${
                      touched.email && !isEmailValid 
                        ? '!border-rose-500/70 focus:!border-rose-500' 
                        : touched.email && isEmailValid 
                        ? '!border-[#2d5736]' 
                        : ''
                    }`}
                    required
                  />
                  {touched.email && isEmailValid && (
                    <CheckCircle2 className="w-4 h-4 text-[#71d083] absolute right-3 top-3 pointer-events-none" />
                  )}
                </div>
                {touched.email && !isEmailValid && (
                  <p className="text-rose-400 text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    Formato de correo no válido (ej: barbero@triadix.co).
                  </p>
                )}
              </div>

              {/* Field 3: Teléfono */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[#b5b2bc] font-sans text-[11px] uppercase tracking-[0.025em] block font-medium">
                    Teléfono Móvil (10 dígitos) <span className="text-[#71d083]">*</span>
                  </label>
                  <span className={`text-[10px] font-mono ${form.phone.length === 10 ? 'text-[#71d083]' : 'text-[#7c7a85]'}`}>
                    {form.phone.length}/10 dígitos
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="3001234567"
                    maxLength={10}
                    value={form.phone}
                    onChange={(e) => {
                      // Filter strictly digits only
                      const cleanDigits = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setForm({ ...form, phone: cleanDigits });
                    }}
                    onBlur={() => setTouched(prev => ({ ...prev, phone: true }))}
                    className={`input-depot font-mono ${
                      touched.phone && !isPhoneValid 
                        ? '!border-rose-500/70 focus:!border-rose-500' 
                        : touched.phone && isPhoneValid 
                        ? '!border-[#2d5736]' 
                        : ''
                    }`}
                    required
                  />
                  {touched.phone && isPhoneValid && (
                    <CheckCircle2 className="w-4 h-4 text-[#71d083] absolute right-3 top-3 pointer-events-none" />
                  )}
                </div>
                {touched.phone && !isPhoneValid && (
                  <p className="text-rose-400 text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    El teléfono debe tener estrictamente 10 dígitos numéricos (faltan {10 - form.phone.length}).
                  </p>
                )}
              </div>

              {/* Field 4: Contraseña */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[#b5b2bc] font-sans text-[11px] uppercase tracking-[0.025em] block font-medium">
                    Contraseña Temporal <span className="text-[#71d083]">*</span>
                  </label>
                  <span className={`text-[10px] font-mono ${form.password.length >= 6 ? 'text-[#71d083]' : 'text-[#7c7a85]'}`}>
                    {form.password.length >= 6 ? 'Válida' : `${form.password.length}/6 mín`}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                    className={`input-depot ${
                      touched.password && !isPasswordValid 
                        ? '!border-rose-500/70 focus:!border-rose-500' 
                        : touched.password && isPasswordValid 
                        ? '!border-[#2d5736]' 
                        : ''
                    }`}
                    required
                  />
                  {touched.password && isPasswordValid && (
                    <CheckCircle2 className="w-4 h-4 text-[#71d083] absolute right-3 top-3 pointer-events-none" />
                  )}
                </div>
                {touched.password && !isPasswordValid && (
                  <p className="text-rose-400 text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    La contraseña debe contener al menos 6 caracteres.
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2 border-t border-[#2b292d]">
              <button
                type="button"
                className="btn-depot-outline flex-1"
                onClick={() => { setCreateModal(false); resetForm(); }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-depot-primary flex-1"
                disabled={creating || !isFormValid}
              >
                {creating
                  ? <div className="w-4 h-4 border-2 border-[#04040b] border-t-transparent rounded-full animate-spin" />
                  : 'Crear Barbero'
                }
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </PageTransition>
  );
}
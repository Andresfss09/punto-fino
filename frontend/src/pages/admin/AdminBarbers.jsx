import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Plus, Check, X, Phone, Mail, Scissors } from 'lucide-react';
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
    name: '', email: '', phone: '', password: '',
  });

  const fetchBarbers = () => {
    setLoading(true);
    api.get('/barbers')
      .then((res) => setBarbers(res.barbers || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBarbers(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.password) {
      toast.error('Todos los campos son requeridos');
      return;
    }
    if (form.phone.length !== 10) {
      toast.error('El teléfono debe tener 10 dígitos');
      return;
    }
    if (form.password.length < 6) {
      toast.error('La contraseña debe tener mínimo 6 caracteres');
      return;
    }
    setCreating(true);
    try {
      await api.post('/auth/register', { ...form, role: 'barbero' });
      toast.success(`Barbero ${form.name} creado exitosamente`);
      setCreateModal(false);
      setForm({ name: '', email: '', phone: '', password: '' });
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

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-6 border-b border-[#1f2723]">
          <div>
            <span className="editorial-tag text-gold-400 block mb-1">Equipo & Maestros</span>
            <h1 className="font-serif italic text-3xl sm:text-4xl text-white">
              Gestión de <span className="text-gold-400">Barberos</span>
            </h1>
            <p className="text-[#8e9b94] text-xs font-sans mt-1">
              {barbers.length} barberos profesionales registrados en la plataforma
            </p>
          </div>
          <button
            onClick={() => setCreateModal(true)}
            className="bg-gold-400 hover:bg-gold-300 text-[#0e1311] font-sans font-semibold text-xs tracking-wider uppercase px-4 py-2.5 rounded-[4px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Plus size={16} />
            Nuevo Barbero
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-400"></div>
          </div>
        ) : barbers.length === 0 ? (
          <div className="bg-[#121815] border border-[#1f2723] rounded-[4px] p-16 text-center">
            <Scissors size={40} className="text-gold-400/40 mx-auto mb-3" />
            <p className="font-serif italic text-xl text-white mb-1">No hay barberos registrados</p>
            <p className="text-[#8e9b94] text-xs font-sans mb-5">Crea el primer perfil para que esté disponible en reservas.</p>
            <button
              onClick={() => setCreateModal(true)}
              className="bg-gold-400 hover:bg-gold-300 text-[#0e1311] font-sans font-semibold text-xs tracking-wider uppercase px-5 py-2.5 rounded-[4px] inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} />
              Crear Barbero
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {barbers.map((barber) => (
              <div
                key={barber._id}
                className="bg-[#121815] border border-[#1f2723] hover:border-[#2b3530] transition-colors rounded-[4px] p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#161d19] border border-gold-400/40 rounded-[4px] flex items-center justify-center flex-shrink-0">
                        <span className="font-serif italic text-xl text-gold-400 font-bold">
                          {barber.user?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-serif italic text-lg text-white leading-tight">{barber.user?.name}</p>
                        <p className="text-[#8e9b94] text-xs font-sans mt-0.5">Maestro Barbero</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-[4px] text-[10px] font-sans uppercase tracking-wider border ${
                      barber.isAvailable
                        ? 'bg-emerald-950/50 text-emerald-400 border-emerald-800/40'
                        : 'bg-rose-950/50 text-rose-400 border-rose-800/40'
                    }`}>
                      {barber.isAvailable ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>

                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-2 text-[#8e9b94] text-xs">
                      <Mail size={13} className="text-gold-400/70" />
                      <span className="truncate">{barber.user?.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#8e9b94] text-xs">
                      <Phone size={13} className="text-gold-400/70" />
                      <span>{barber.user?.phone}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className={i < Math.floor(barber.rating?.average || 0)
                          ? 'text-gold-400 fill-gold-400'
                          : 'text-[#333] fill-transparent'}
                      />
                    ))}
                    <span className="text-[#8e9b94] font-mono text-xs ml-1.5">
                      {barber.rating?.average || 0} ({barber.rating?.count || 0} reseñas)
                    </span>
                  </div>

                  {barber.specialties?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {barber.specialties.map((spec) => (
                        <span key={spec} className="inline-block px-2 py-0.5 rounded-[4px] text-[10px] font-sans bg-[#161d19] text-[#dfdbca] border border-[#222a26] uppercase">
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-[#1f2723] mb-5">
                    <div className="text-center">
                      <p className="font-mono font-bold text-white text-base">{barber.totalClients || 0}</p>
                      <p className="text-[#8e9b94] text-[10px] uppercase font-sans tracking-wider">Clientes atendidos</p>
                    </div>
                    <div className="text-center border-l border-[#1f2723]">
                      <p className="font-mono font-bold text-gold-400 text-base">{barber.rating?.average || 0}</p>
                      <p className="text-[#8e9b94] text-[10px] uppercase font-sans tracking-wider">Calificación</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleAvailable(barber._id, barber.isAvailable)}
                  className={`w-full flex items-center justify-center gap-2 py-2 rounded-[4px] text-xs font-sans uppercase tracking-wider border transition-all cursor-pointer ${
                    barber.isAvailable
                      ? 'bg-rose-950/30 hover:bg-rose-950/60 text-rose-400 border-rose-800/40'
                      : 'bg-emerald-950/30 hover:bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
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

        {/* Create Modal */}
        <Modal
          isOpen={createModal}
          onClose={() => { setCreateModal(false); setForm({ name: '', email: '', phone: '', password: '' }); }}
          title="Crear Nuevo Barbero"
        >
          <form onSubmit={handleCreate} className="p-6">
            <p className="text-[#8e9b94] text-xs font-sans mb-5 leading-relaxed">
              El profesional podrá acceder inmediatamente al dashboard de barbero con estas credenciales.
            </p>
            
            <div className="space-y-3.5 mb-6">
              <div>
                <label className="text-[#8e9b94] font-sans text-[11px] uppercase tracking-wider mb-1 block">Nombre Completo</label>
                <input
                  type="text"
                  placeholder="Ej: Nicolás Gómez"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#0e1311] border border-[#222a26] text-white focus:border-gold-400/50 rounded-[4px] p-2.5 text-xs outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-[#8e9b94] font-sans text-[11px] uppercase tracking-wider mb-1 block">Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="barbero@puntofino.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-[#0e1311] border border-[#222a26] text-white focus:border-gold-400/50 rounded-[4px] p-2.5 text-xs outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-[#8e9b94] font-sans text-[11px] uppercase tracking-wider mb-1 block">Teléfono (10 dígitos)</label>
                <input
                  type="tel"
                  placeholder="3001234567"
                  maxLength={10}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-[#0e1311] border border-[#222a26] text-white focus:border-gold-400/50 rounded-[4px] p-2.5 text-xs outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-[#8e9b94] font-sans text-[11px] uppercase tracking-wider mb-1 block">Contraseña Temporal</label>
                <input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-[#0e1311] border border-[#222a26] text-white focus:border-gold-400/50 rounded-[4px] p-2.5 text-xs outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                className="bg-[#161d19] hover:bg-[#1f2723] text-[#dfdbca] border border-[#2b3530] text-xs font-sans uppercase tracking-wider flex-1 py-2.5 rounded-[4px] transition-colors cursor-pointer"
                onClick={() => { setCreateModal(false); setForm({ name: '', email: '', phone: '', password: '' }); }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-gold-400 hover:bg-gold-300 text-[#0e1311] font-sans font-semibold text-xs uppercase tracking-wider flex-1 py-2.5 rounded-[4px] flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                disabled={creating}
              >
                {creating
                  ? <div className="w-4 h-4 border-2 border-[#0e1311] border-t-transparent rounded-full animate-spin" />
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
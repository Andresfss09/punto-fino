import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Plus, Scissors, Check, X, Phone, Mail } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
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

  const handleCreate = async () => {
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
    <div className="min-h-screen bg-dark-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-16">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="font-display text-3xl font-bold text-white">
              Gestión de <span className="gold-text">Barberos</span>
            </h1>
            <p className="text-gray-400 mt-1">{barbers.length} barberos registrados</p>
          </div>
          <button
            onClick={() => setCreateModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Nuevo barbero
          </button>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" text="Cargando barberos..." />
          </div>
        ) : barbers.length === 0 ? (
          <div className="card p-16 text-center">
            <Scissors size={48} className="text-gray-600 mx-auto mb-4 rotate-45" />
            <p className="text-gray-400 text-lg mb-2">No hay barberos registrados</p>
            <p className="text-gray-600 text-sm mb-6">Crea el primer barbero para que aparezca en la plataforma</p>
            <button
              onClick={() => setCreateModal(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus size={16} />
              Crear primer barbero
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {barbers.map((barber, index) => (
              <motion.div
                key={barber._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-gold-500 to-gold-700 rounded-2xl flex items-center justify-center shadow-lg shadow-gold-500/20">
                      <span className="text-black text-xl font-bold">
                        {barber.user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">{barber.user?.name}</p>
                      <p className="text-gray-500 text-xs">Barbero Profesional</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    barber.isAvailable
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${barber.isAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
                    {barber.isAvailable ? 'Activo' : 'Inactivo'}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Mail size={13} />
                    <span className="truncate">{barber.user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Phone size={13} />
                    <span>{barber.user?.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.floor(barber.rating?.average || 0)
                        ? 'text-gold-500 fill-gold-500'
                        : 'text-gray-600'}
                    />
                  ))}
                  <span className="text-gray-500 text-xs ml-1">
                    {barber.rating?.average || 0} ({barber.rating?.count || 0} reseñas)
                  </span>
                </div>

                {barber.specialties?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {barber.specialties.map((spec) => (
                      <span key={spec} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-dark-50 text-gray-400 border border-white/10 capitalize">
                        {spec}
                      </span>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 py-3 border-y border-white/5 mb-4">
                  <div className="text-center">
                    <p className="text-white font-bold">{barber.totalClients || 0}</p>
                    <p className="text-gray-600 text-xs">Clientes atendidos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-bold">{barber.rating?.average || 0}</p>
                    <p className="text-gray-600 text-xs">Calificación</p>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleAvailable(barber._id, barber.isAvailable)}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                    barber.isAvailable
                      ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                      : 'border-green-500/30 text-green-400 hover:bg-green-500/10'
                  }`}
                >
                  {barber.isAvailable
                    ? <><X size={14} /> Desactivar barbero</>
                    : <><Check size={14} /> Activar barbero</>
                  }
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={createModal}
        onClose={() => { setCreateModal(false); setForm({ name: '', email: '', phone: '', password: '' }); }}
        title="Crear nuevo barbero"
      >
        <p className="text-gray-400 text-sm mb-6">
          El barbero podrá acceder a su panel con estas credenciales.
        </p>
        <div className="space-y-4">
          <Input
            label="Nombre completo"
            placeholder="Emanuel Torres"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            placeholder="barbero@puntofino.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="Teléfono"
            placeholder="3001234567"
            maxLength={10}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Input
            label="Contraseña temporal"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <div className="flex gap-3 mt-6">
          <button
            className="btn-secondary flex-1"
            onClick={() => { setCreateModal(false); setForm({ name: '', email: '', phone: '', password: '' }); }}
          >
            Cancelar
          </button>
          <button
            className="btn-primary flex-1 flex items-center justify-center gap-2"
            onClick={handleCreate}
            disabled={creating}
          >
            {creating
              ? <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              : 'Crear barbero'
            }
          </button>
        </div>
      </Modal>
    </div>
  );
}
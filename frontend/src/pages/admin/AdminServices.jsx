import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Clock, Scissors } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from '../../components/ui/Modal';
import PageTransition from '../../components/ui/PageTransition';
import { serviceService } from '../../services/serviceService';
import toast from 'react-hot-toast';

const serviceSchema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  description: z.string().min(5, 'Mínimo 5 caracteres'),
  price: z.number().min(0, 'Precio inválido'),
  duration: z.number().min(5, 'Mínimo 5 min'),
  category: z.string().min(2, 'Categoría requerida'),
});

const DEFAULT_CATEGORIES = ['Corte', 'Barba', 'Facial', 'Combo', 'Color', 'Bebidas'];

export default function AdminServices() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Todos');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: async () => {
      const res = await serviceService.getAll();
      return res.services || res.data?.services || res || [];
    }
  });

  const services = Array.isArray(data) ? data : [];

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(serviceSchema)
  });

  const createMutation = useMutation({
    mutationFn: (newService) => serviceService.create(newService),
    onSuccess: () => {
      toast.success('Servicio creado exitosamente');
      queryClient.invalidateQueries(['admin-services']);
      setIsModalOpen(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error al crear servicio');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updatedService }) => serviceService.update(id, updatedService),
    onSuccess: () => {
      toast.success('Servicio actualizado exitosamente');
      queryClient.invalidateQueries(['admin-services']);
      setIsModalOpen(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error al actualizar servicio');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => serviceService.delete(id),
    onSuccess: () => {
      toast.success('Servicio eliminado');
      queryClient.invalidateQueries(['admin-services']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error al eliminar servicio');
    }
  });

  const openModal = (service = null) => {
    setEditingService(service);
    if (service) {
      reset({
        name: service.name,
        description: service.description || '',
        price: service.price,
        duration: service.duration,
        category: service.category || 'Corte',
      });
    } else {
      reset({
        name: '',
        description: '',
        price: 35000,
        duration: 45,
        category: 'Corte',
      });
    }
    setIsModalOpen(true);
  };

  const onSubmit = (formData) => {
    if (editingService) {
      updateMutation.mutate({ id: editingService._id || editingService.id, updatedService: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este servicio?')) {
      deleteMutation.mutate(id);
    }
  };

  const categories = ['Todos', ...new Set(services.map(s => s.category).filter(Boolean))];
  const filteredServices = activeCategory === 'Todos'
    ? services
    : services.filter(s => s.category === activeCategory);

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-20">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-6 border-b border-[#1e1e1e]">
          <div>
            <span className="eyebrow text-gold-400 block mb-1">Catálogo & Tarifas</span>
            <h1 className="font-sans font-medium uppercase tracking-[0.16em] text-2xl sm:text-3xl text-white">
              Gestión de <span className="text-gold-400">Servicios</span>
            </h1>
            <p className="text-[#888888] text-xs font-sans mt-1">
              Administra los cortes, combos y experiencias del menú de Triadix.
            </p>
          </div>
          <button 
            onClick={() => openModal()} 
            className="btn-ferrari-primary text-xs !py-2.5 !px-4"
          >
            <Plus size={14} /> Nuevo Servicio
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-none text-xs font-sans uppercase tracking-[0.16em] transition-all whitespace-nowrap cursor-pointer border ${
                activeCategory === cat
                  ? 'bg-white text-black border-white font-medium'
                  : 'bg-[#141414] text-[#888888] hover:text-white border-[#222222] hover:border-white/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border border-white border-t-transparent"></div>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-[#0a0a0a] border border-[#1e1e1e] rounded-none p-8">
            <Scissors size={36} className="text-[#444444] mx-auto mb-3" />
            <p className="font-sans font-medium uppercase tracking-[0.16em] text-sm text-white mb-1">No hay servicios en esta categoría</p>
            <p className="text-[#888888] text-xs font-sans mt-1">Agrega un nuevo servicio o selecciona otra categoría.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredServices.map((service) => {
              const serviceId = service._id || service.id;
              return (
                <div 
                  key={serviceId} 
                  className="bg-[#0a0a0a] border border-[#1e1e1e] hover:border-[#333333] transition-colors rounded-none p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-[#141414] text-gold-400 border border-[#222222] rounded-none">
                        {service.category}
                      </span>
                    </div>
                    
                    <h3 className="font-sans font-medium uppercase tracking-[0.14em] text-base text-white mb-1.5">{service.name}</h3>
                    <p className="text-[#888888] text-xs leading-relaxed line-clamp-2 mb-4 font-sans">
                      {service.description || 'Experiencia exclusiva de barbería tradicional y moderna.'}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center py-3 border-y border-[#1e1e1e] mb-4 text-xs font-mono">
                      <span className="flex items-center gap-1 text-white font-medium text-sm">
                        ${service.price?.toLocaleString('es-CO')}
                      </span>
                      <span className="flex items-center gap-1 text-[#888888]">
                        <Clock size={12} className="text-white" /> {service.duration} min
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openModal(service)} 
                        className="flex-1 bg-[#141414] hover:bg-[#1a1a1a] text-[#888888] hover:text-white border border-[#222222] py-2 rounded-none text-xs font-sans uppercase tracking-[0.16em] flex justify-center items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Edit2 size={13} /> Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(serviceId)} 
                        className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 p-2 rounded-none transition-colors cursor-pointer"
                        title="Eliminar servicio"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          title={editingService ? "EDITAR SERVICIO" : "NUEVO SERVICIO"}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-[#888888] font-sans text-[11px] uppercase tracking-[0.16em] mb-1 block">Nombre del Servicio</label>
              <input 
                {...register('name')} 
                placeholder="Ej: Corte Clásico de Autor"
                className="w-full bg-[#141414] border border-[#222222] text-white focus:border-white/50 rounded-none p-2.5 text-xs outline-none transition-colors"
              />
              {errors.name && <p className="text-rose-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
            
            <div>
              <label className="text-[#888888] font-sans text-[11px] uppercase tracking-[0.16em] mb-1 block">Descripción</label>
              <textarea 
                {...register('description')} 
                placeholder="Detalla lo que incluye el servicio..."
                className="w-full bg-[#141414] border border-[#222222] text-white focus:border-white/50 rounded-none p-2.5 text-xs outline-none h-20 resize-none transition-colors font-sans"
              />
              {errors.description && <p className="text-rose-400 text-xs mt-1">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[#888888] font-sans text-[11px] uppercase tracking-[0.16em] mb-1 block">Precio ($ COP)</label>
                <input 
                  type="number" 
                  {...register('price', { valueAsNumber: true })} 
                  className="w-full bg-[#141414] border border-[#222222] text-white focus:border-white/50 rounded-none p-2.5 text-xs outline-none font-mono transition-colors"
                />
                {errors.price && <p className="text-rose-400 text-xs mt-1">{errors.price.message}</p>}
              </div>
              <div>
                <label className="text-[#888888] font-sans text-[11px] uppercase tracking-[0.16em] mb-1 block">Duración (min)</label>
                <input 
                  type="number" 
                  {...register('duration', { valueAsNumber: true })} 
                  className="w-full bg-[#141414] border border-[#222222] text-white focus:border-white/50 rounded-none p-2.5 text-xs outline-none font-mono transition-colors"
                />
                {errors.duration && <p className="text-rose-400 text-xs mt-1">{errors.duration.message}</p>}
              </div>
            </div>

            <div>
              <label className="text-[#888888] font-sans text-[11px] uppercase tracking-[0.16em] mb-1 block">Categoría</label>
              <select 
                {...register('category')} 
                className="w-full bg-[#141414] border border-[#222222] text-white focus:border-white/50 rounded-none p-2.5 text-xs outline-none cursor-pointer transition-colors"
              >
                {DEFAULT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-[#1e1e1e] mt-6">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                className="bg-[#141414] hover:bg-[#1a1a1a] text-[#888888] hover:text-white border border-[#222222] px-4 py-2.5 rounded-none text-xs font-sans uppercase tracking-[0.16em] transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={createMutation.isLoading || updateMutation.isLoading}
                className="btn-ferrari-primary text-xs !py-2.5 !px-5"
              >
                {editingService ? 'Actualizar Servicio' : 'Guardar Servicio'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </PageTransition>
  );
}

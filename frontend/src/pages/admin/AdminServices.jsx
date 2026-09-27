import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Clock, DollarSign, Scissors } from 'lucide-react';
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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-6 border-b border-[#1f2723]">
          <div>
            <span className="editorial-tag text-gold-400 block mb-1">Catálogo & Tarifas</span>
            <h1 className="font-serif italic text-3xl sm:text-4xl text-white">
              Gestión de <span className="text-gold-400">Servicios</span>
            </h1>
            <p className="text-[#8e9b94] text-xs font-sans mt-1">
              Administra los cortes, combos y experiencias del menú de Punto Fino
            </p>
          </div>
          <button 
            onClick={() => openModal()} 
            className="bg-gold-400 hover:bg-gold-300 text-[#0e1311] font-sans font-semibold text-xs tracking-wider uppercase px-4 py-2.5 rounded-[4px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Plus size={16} /> Nuevo Servicio
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-[4px] text-xs font-sans uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? 'bg-gold-400 text-[#0e1311] font-semibold shadow-sm'
                  : 'bg-[#161d19] text-[#b3b3b3] hover:text-white border border-[#222a26]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-400"></div>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-[#121815] border border-[#1f2723] rounded-[4px] p-8">
            <Scissors size={40} className="text-gold-400/40 mx-auto mb-3" />
            <p className="font-serif italic text-xl text-white mb-1">No hay servicios en esta categoría</p>
            <p className="text-[#8e9b94] text-xs font-sans mt-1">Agrega un nuevo servicio o selecciona otra categoría.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredServices.map((service) => {
              const serviceId = service._id || service.id;
              return (
                <div 
                  key={serviceId} 
                  className="bg-[#121815] border border-[#1f2723] hover:border-[#2b3530] transition-colors rounded-[4px] p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="editorial-tag bg-[#161d19] text-gold-400 border border-[#222a26] px-2 py-0.5 rounded-[4px]">
                        {service.category}
                      </span>
                    </div>
                    
                    <h3 className="font-serif italic text-xl text-white mb-1.5">{service.name}</h3>
                    <p className="text-[#8e9b94] text-xs leading-relaxed line-clamp-2 mb-4">
                      {service.description || 'Experiencia exclusiva de barbería tradicional y moderna.'}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center py-3 border-y border-[#1f2723] mb-4 text-xs font-mono">
                      <span className="flex items-center gap-1 text-gold-400 font-bold text-base">
                        ${service.price?.toLocaleString('es-CO')}
                      </span>
                      <span className="flex items-center gap-1 text-[#8e9b94]">
                        <Clock size={13} className="text-gold-400/70" /> {service.duration} min
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openModal(service)} 
                        className="flex-1 bg-[#161d19] hover:bg-[#1f2723] text-[#dfdbca] border border-[#2b3530] py-2 rounded-[4px] text-xs font-sans uppercase tracking-wider flex justify-center items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Edit2 size={13} /> Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(serviceId)} 
                        className="bg-rose-950/40 hover:bg-rose-950/70 text-rose-400 border border-rose-800/40 p-2 rounded-[4px] transition-colors cursor-pointer"
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
          title={editingService ? "Editar Servicio" : "Nuevo Servicio"}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div>
              <label className="text-[#8e9b94] font-sans text-[11px] uppercase tracking-wider mb-1 block">Nombre del Servicio</label>
              <input 
                {...register('name')} 
                placeholder="Ej: Corte Clásico de Autor"
                className="w-full bg-[#0e1311] border border-[#222a26] text-white focus:border-gold-400/50 rounded-[4px] p-2.5 text-xs outline-none transition-colors"
              />
              {errors.name && <p className="text-rose-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
            
            <div>
              <label className="text-[#8e9b94] font-sans text-[11px] uppercase tracking-wider mb-1 block">Descripción</label>
              <textarea 
                {...register('description')} 
                placeholder="Detalla lo que incluye el servicio..."
                className="w-full bg-[#0e1311] border border-[#222a26] text-white focus:border-gold-400/50 rounded-[4px] p-2.5 text-xs outline-none h-20 resize-none transition-colors"
              />
              {errors.description && <p className="text-rose-400 text-xs mt-1">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[#8e9b94] font-sans text-[11px] uppercase tracking-wider mb-1 block">Precio ($ COP)</label>
                <input 
                  type="number" 
                  {...register('price', { valueAsNumber: true })} 
                  className="w-full bg-[#0e1311] border border-[#222a26] text-white focus:border-gold-400/50 rounded-[4px] p-2.5 text-xs outline-none font-mono transition-colors"
                />
                {errors.price && <p className="text-rose-400 text-xs mt-1">{errors.price.message}</p>}
              </div>
              <div>
                <label className="text-[#8e9b94] font-sans text-[11px] uppercase tracking-wider mb-1 block">Duración (min)</label>
                <input 
                  type="number" 
                  {...register('duration', { valueAsNumber: true })} 
                  className="w-full bg-[#0e1311] border border-[#222a26] text-white focus:border-gold-400/50 rounded-[4px] p-2.5 text-xs outline-none font-mono transition-colors"
                />
                {errors.duration && <p className="text-rose-400 text-xs mt-1">{errors.duration.message}</p>}
              </div>
            </div>

            <div>
              <label className="text-[#8e9b94] font-sans text-[11px] uppercase tracking-wider mb-1 block">Categoría</label>
              <select 
                {...register('category')} 
                className="w-full bg-[#0e1311] border border-[#222a26] text-white focus:border-gold-400/50 rounded-[4px] p-2.5 text-xs outline-none cursor-pointer transition-colors"
              >
                {DEFAULT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-[#1f2723] mt-6">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                className="bg-[#161d19] hover:bg-[#1f2723] text-[#dfdbca] border border-[#2b3530] px-4 py-2.5 rounded-[4px] text-xs font-sans uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={createMutation.isLoading || updateMutation.isLoading}
                className="bg-gold-400 hover:bg-gold-300 text-[#0e1311] font-sans font-semibold px-5 py-2.5 rounded-[4px] text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm disabled:opacity-50"
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

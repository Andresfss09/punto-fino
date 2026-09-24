import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Clock, DollarSign } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import BrutalCard from '../../components/ui/BrutalCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import PageTransition from '../../components/ui/PageTransition';
import toast from 'react-hot-toast';

const serviceSchema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  description: z.string().min(10, 'Mínimo 10 caracteres'),
  price: z.number().min(0, 'Precio inválido'),
  duration: z.number().min(15, 'Mínimo 15 min'),
  category: z.enum(['Corte', 'Barba', 'Facial', 'Combo', 'Color']),
  isPopular: z.boolean().default(false)
});

// Mock services until backend is connected
const MOCK_SERVICES = [
  { id: 1, name: 'Corte Clásico', description: 'Corte tradicional con tijera o máquina.', price: 25000, duration: 45, category: 'Corte', isPopular: true, active: true },
  { id: 2, name: 'Arreglo de Barba', description: 'Perfilado y rebajado de barba con toalla caliente.', price: 15000, duration: 30, category: 'Barba', isPopular: false, active: true },
];

export default function AdminServices() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(serviceSchema)
  });

  const openModal = (service = null) => {
    setEditingService(service);
    if (service) {
      reset(service);
    } else {
      reset({ category: 'Corte', isPopular: false });
    }
    setIsModalOpen(true);
  };

  const onSubmit = (data) => {
    toast.success(editingService ? 'Servicio actualizado' : 'Servicio creado');
    setIsModalOpen(false);
  };

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-3xl font-display font-bold uppercase tracking-wider text-gold-500">Servicios</h1>
          <Button onClick={() => openModal()} className="brutal-btn-primary">
            <Plus size={20} /> Nuevo Servicio
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_SERVICES.map(service => (
            <BrutalCard key={service.id} className="flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <span className="brutal-badge bg-gold-500/10 text-gold-500 border-gold-500/20">{service.category}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={service.active} />
                  <div className="w-9 h-5 bg-dark-300 border-2 border-[#333] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#333] after:border-[#333] after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-green-500 peer-checked:after:bg-dark-500"></div>
                </label>
              </div>
              
              <h3 className="text-xl font-bold mb-2 uppercase">{service.name}</h3>
              <p className="text-gray-400 text-sm mb-4 flex-grow">{service.description}</p>
              
              <div className="brutal-divider my-4"></div>
              
              <div className="flex justify-between items-center mb-4 text-sm font-mono-price">
                <span className="flex items-center gap-1 text-gold-500"><DollarSign size={16}/> ${service.price}</span>
                <span className="flex items-center gap-1 text-gray-300"><Clock size={16}/> {service.duration} min</span>
              </div>
              
              <div className="flex gap-2 mt-auto">
                <button onClick={() => openModal(service)} className="flex-1 brutal-btn bg-dark-300 border-[#333] py-2 text-sm flex justify-center items-center gap-2 hover:bg-dark-200 uppercase font-bold">
                  <Edit2 size={16} /> Editar
                </button>
                <button className="brutal-btn bg-red-500/20 text-red-500 border-red-500/50 py-2 px-4 hover:bg-red-500/30">
                  <Trash2 size={16} />
                </button>
              </div>
            </BrutalCard>
          ))}
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingService ? "Editar Servicio" : "Nuevo Servicio"}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Nombre" {...register('name')} error={errors.name?.message} />
            
            <div className="space-y-1">
              <label className="text-sm font-bold uppercase tracking-wider text-gray-400 block">Descripción</label>
              <textarea 
                {...register('description')} 
                className="w-full bg-dark-200 border-2 border-[#333] focus:border-gold-500 focus:shadow-[4px_4px_0_#d4af37] text-white p-3 h-24 resize-none outline-none"
              />
              {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input type="number" label="Precio ($)" {...register('price', { valueAsNumber: true })} error={errors.price?.message} />
              <Input type="number" label="Duración (min)" {...register('duration', { valueAsNumber: true })} error={errors.duration?.message} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold uppercase tracking-wider text-gray-400 block">Categoría</label>
              <select {...register('category')} className="w-full bg-dark-200 border-2 border-[#333] focus:border-gold-500 text-white p-3 outline-none cursor-pointer appearance-none">
                <option value="Corte">Corte</option>
                <option value="Barba">Barba</option>
                <option value="Facial">Facial</option>
                <option value="Combo">Combo</option>
                <option value="Color">Color</option>
              </select>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t-2 border-dashed border-[#333] mt-6">
              <button type="button" onClick={() => setIsModalOpen(false)} className="brutal-btn px-6 py-2 bg-dark-300 uppercase font-bold text-sm">Cancelar</button>
              <button type="submit" className="brutal-btn-primary px-6 py-2 text-sm">{editingService ? 'Actualizar' : 'Guardar'}</button>
            </div>
          </form>
        </Modal>
      </div>
    </PageTransition>
  );
}

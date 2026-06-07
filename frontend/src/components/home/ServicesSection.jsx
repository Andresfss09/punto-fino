import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, ChevronRight } from 'lucide-react';
import { serviceService } from '../../services/serviceService';

const defaultServices = [
  { _id: '1', name: 'Barba', price: 12000, duration: 10, category: 'barba', isPopular: true },
  { _id: '2', name: 'Cejas', price: 5000, duration: 5, category: 'diseño', isPopular: true },
  { _id: '3', name: 'Corte barba y cejas', price: 34000, duration: 45, category: 'combo', isPopular: true },
  { _id: '4', name: 'Corte de cabello', price: 20000, duration: 30, category: 'corte', isPopular: false },
  { _id: '5', name: 'Corte y barba', price: 30000, duration: 40, category: 'combo', isPopular: false },
  { _id: '6', name: 'Corte y ceja', price: 24000, duration: 35, category: 'combo', isPopular: false },
];

const categoryColors = {
  corte: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  barba: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  combo: 'bg-gold-500/20 text-gold-400 border-gold-500/30',
  diseño: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  tratamiento: 'bg-green-500/20 text-green-400 border-green-500/30',
};

const categoryLabels = {
  corte: 'Corte',
  barba: 'Barba',
  combo: 'Combo',
  diseño: 'Diseño',
  tratamiento: 'Tratamiento',
};

export default function ServicesSection() {
  const [services, setServices] = useState(defaultServices);
  const [activeCategory, setActiveCategory] = useState('todos');

  useEffect(() => {
    serviceService.getAll({ isActive: true })
      .then((res) => { if (res.services?.length > 0) setServices(res.services); })
      .catch(() => {});
  }, []);

  const categories = ['todos', ...new Set(services.map((s) => s.category))];
  const filtered = activeCategory === 'todos' ? services : services.filter((s) => s.category === activeCategory);

  return (
    <section id="servicios" className="py-24 bg-dark-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-gold-500 text-sm font-medium tracking-widest uppercase mb-4">
            Lo que ofrecemos
          </span>
          <h2 className="section-title mb-4">
            Nuestros <span className="gold-text">Servicios</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Desde cortes clásicos hasta diseños de tendencia. Calidad premium en cada servicio.
          </p>
        </motion.div>

        {/* Filtros */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-gold-500 text-black'
                  : 'bg-dark-50 text-gray-400 border border-white/10 hover:border-gold-500/30 hover:text-gold-400'
              }`}
            >
              {cat === 'todos' ? 'Todos' : categoryLabels[cat] || cat}
            </button>
          ))}
        </div>

        {/* Grid de servicios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((service, index) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="card-hover p-6 group"
            >
              {/* Popular badge */}
              {service.isPopular && (
                <div className="flex justify-end mb-3">
                  <span className="badge bg-gold-500/20 text-gold-400 border border-gold-500/30">
                    🔥 Popular
                  </span>
                </div>
              )}

              {/* Icono decorativo */}
              <div className="w-14 h-14 bg-dark-50 border border-white/5 rounded-xl flex items-center justify-center mb-4 group-hover:border-gold-500/30 transition-all">
                <span className="text-2xl">✂️</span>
              </div>

              {/* Info */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-semibold text-lg capitalize">{service.name}</h3>
                  <span className={`badge mt-1 border ${categoryColors[service.category] || 'bg-gray-500/20 text-gray-400'}`}>
                    {categoryLabels[service.category] || service.category}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-gold-400 font-bold text-xl">
                    ${service.price.toLocaleString('es-CO')}
                  </p>
                </div>
              </div>

              {/* Duración */}
              <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-5">
                <Clock size={14} />
                <span>{service.duration} min</span>
              </div>

              {/* CTA */}
              <Link
                to="/reservar"
                className="w-full flex items-center justify-center gap-2 bg-dark-50 border border-white/10 text-gray-300 hover:border-gold-500/30 hover:text-gold-400 rounded-xl py-2.5 text-sm font-medium transition-all group-hover:bg-gold-500/5"
              >
                Reservar
                <ChevronRight size={16} />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/reservar" className="btn-primary inline-flex items-center gap-2">
            Reservar ahora
            <ChevronRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
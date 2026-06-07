import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Scissors, ChevronRight } from 'lucide-react';
import { barberService } from '../../services/barberService';

const defaultBarbers = [
  { _id: '1', user: { name: 'Emanuel Torres', avatar: '' }, specialties: ['corte clásico', 'degradado'], rating: { average: 5, count: 7 }, totalClients: 120 },
  { _id: '2', user: { name: 'Juan David', avatar: '' }, specialties: ['diseño', 'barba'], rating: { average: 5, count: 5 }, totalClients: 98 },
  { _id: '3', user: { name: 'Barbero', avatar: '' }, specialties: ['corte clásico', 'cejas'], rating: { average: 5, count: 4 }, totalClients: 85 },
];

export default function BarbersSection() {
  const [barbers, setBarbers] = useState(defaultBarbers);

  useEffect(() => {
    barberService.getAll()
      .then((res) => { if (res.barbers?.length > 0) setBarbers(res.barbers); })
      .catch(() => {});
  }, []);

  return (
    <section id="barberos" className="py-24 bg-dark-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-gold-500 text-sm font-medium tracking-widest uppercase mb-4">
            Nuestro equipo
          </span>
          <h2 className="section-title mb-4">
            Los mejores <span className="gold-text">Barberos</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Profesionales certificados con años de experiencia. Cada uno especialista en su arte.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {barbers.map((barber, index) => (
            <motion.div
              key={barber._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card-hover p-8 text-center group"
            >
              {/* Avatar */}
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center mx-auto shadow-lg shadow-gold-500/20 group-hover:shadow-gold-500/40 transition-all">
                  {barber.user?.avatar ? (
                    <img src={barber.user.avatar} alt={barber.user.name} className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    <span className="text-black text-3xl font-bold font-display">
                      {barber.user?.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-dark-100 border border-gold-500/30 rounded-lg flex items-center justify-center">
                  <Scissors size={14} className="text-gold-500 rotate-45" />
                </div>
              </div>

              {/* Info */}
              <h3 className="text-white font-semibold text-xl mb-1 font-display">
                {barber.user?.name}
              </h3>
              <p className="text-gold-500 text-sm mb-4 tracking-wide">Barbero Profesional</p>

              {/* Rating */}
              <div className="flex items-center justify-center gap-1.5 mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(barber.rating?.average || 5) ? 'text-gold-500 fill-gold-500' : 'text-gray-600'}
                  />
                ))}
                <span className="text-gray-400 text-sm ml-1">
                  ({barber.rating?.count || 0} reseñas)
                </span>
              </div>

              {/* Especialidades */}
              {barber.specialties?.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {barber.specialties.slice(0, 3).map((spec) => (
                    <span key={spec} className="badge bg-dark-50 text-gray-400 border border-white/10 capitalize">
                      {spec}
                    </span>
                  ))}
                </div>
              )}

              {/* Stats */}
              <div className="flex justify-center gap-6 mb-6 py-4 border-y border-white/5">
                <div className="text-center">
                  <p className="text-white font-bold text-lg">{barber.rating?.average || 5}.0</p>
                  <p className="text-gray-500 text-xs">Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-lg">{barber.totalClients || 0}+</p>
                  <p className="text-gray-500 text-xs">Clientes</p>
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-lg">{barber.rating?.count || 0}</p>
                  <p className="text-gray-500 text-xs">Reseñas</p>
                </div>
              </div>

              {/* CTA */}
              <Link
                to="/reservar"
                className="w-full flex items-center justify-center gap-2 btn-secondary text-sm py-2.5"
              >
                Agendar con él
                <ChevronRight size={16} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
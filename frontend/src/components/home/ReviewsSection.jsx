import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const reviews = [
  { id: 1, name: 'Felipe Mejia', date: 'mayo 29, 2026', rating: 5, comment: 'Excelente servicio, el mejor corte que me han hecho en Cali. El ambiente es increíble y los barberos muy profesionales.' },
  { id: 2, name: 'Santiago Ospina', date: 'mayo 28, 2026', rating: 5, comment: 'Muy buena atención, precios justos y resultados de calidad. Definitivamente volvería.' },
  { id: 3, name: 'Joan Mosquera', date: 'mayo 24, 2026', rating: 5, comment: 'El lugar perfecto para los que buscan un corte premium. Ambiente relajado y trabajo impecable.' },
  { id: 4, name: 'Brayan Godoy', date: 'mayo 21, 2026', rating: 5, comment: 'Primera vez aquí y quedé encantado. El barbero fue muy detallista con lo que pedí.' },
  { id: 5, name: 'Gerson Rojas', date: 'abril 20, 2026', rating: 5, comment: 'Muy recomendado. El servicio de barba y cejas quedó perfecto.' },
  { id: 6, name: 'Alexandra Márquez', date: 'abril 14, 2026', rating: 5, comment: 'Fui con mi hijo y el resultado fue excelente. Muy amables y profesionales.' },
];

export default function ReviewsSection() {
  return (
    <section className="py-24 bg-dark-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-gold-500 text-sm font-medium tracking-widest uppercase mb-4">
            Testimonios
          </span>
          <h2 className="section-title mb-4">
            Lo que dicen nuestros <span className="gold-text">clientes</span>
          </h2>
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className="text-gold-500 fill-gold-500" />
              ))}
            </div>
            <span className="text-white font-bold text-xl">5.0</span>
            <span className="text-gray-500">· 7 reseñas verificadas</span>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="card p-6 relative"
            >
              {/* Quote icon */}
              <div className="absolute top-4 right-4 text-gold-500/20">
                <Quote size={32} />
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={14} className="text-gold-500 fill-gold-500" />
                ))}
              </div>

              {/* Comment */}
              <p className="text-gray-300 text-sm leading-relaxed mb-5">
                "{review.comment}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-700 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-black font-bold text-sm">
                    {review.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{review.name}</p>
                  <p className="text-gray-500 text-xs">{review.date} · Cali</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
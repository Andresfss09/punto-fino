import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

const REVIEWS = [
  { 
    id: 1, 
    name: 'David Moreno', 
    service: 'Experiencia Gold VIP',
    date: 'Septiembre 2026',
    rating: 5, 
    text: 'La atención de Juan es otro nivel. El diagnóstico de visagismo fue exacto y la combinación con la toalla caliente y vaporozono me dejó como nuevo. Sin duda la mejor barbería de Cali.' 
  },
  { 
    id: 2, 
    name: 'Sergio Restrepo', 
    service: 'Experiencia Black',
    date: 'Septiembre 2026',
    rating: 5, 
    text: 'Puntualidad británica, ambiente sobrio y música en el punto exacto. Llevo más de un año viniendo a cortarme con Carlos y la consistencia en el degradado es impecable.' 
  },
  { 
    id: 3, 
    name: 'Miguel Ángel Torres', 
    service: 'Perfilado de Barba a Navaja',
    date: 'Agosto 2026',
    rating: 5, 
    text: 'El ritual de barba con aceites esenciales y navaja libre es adictivo. Salgo renovado cada vez que tengo una reunión importante. Totalmente recomendado.' 
  },
];

export default function ReviewsSection() {
  return (
    <section className="py-24 bg-[#0e1311] border-b border-[#1f2723]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="editorial-tag bg-[#161d19] border-[#2b3630] text-gold-400 mb-3">
            Opiniones Reales
          </span>
          <h2 className="font-serif italic text-4xl sm:text-5xl text-white font-normal leading-tight">
            La Voz de Nuestros Clientes
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#b3b3b3] mt-3">
            Más de 2.500 clientes confían su imagen y presencia a nuestro atelier en Cali.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review, i) => (
            <motion.div 
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
              className="bg-[#121815] border border-[#222a26] hover:border-[#cfa53b]/40 rounded-[4px] p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 shadow-subtle relative"
            >
              <div>
                {/* Rating Stars (Antique Gold) */}
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(5)].map((_, idx) => (
                    <Star 
                      key={idx} 
                      size={14} 
                      className={idx < review.rating ? "text-gold-400 fill-gold-400" : "text-[#333]"} 
                    />
                  ))}
                  <span className="font-mono text-xs text-[#808080] ml-2 font-medium">5.0</span>
                </div>
                
                {/* Editorial Quote in Cormorant Garamond Italic */}
                <p className="font-serif italic text-base sm:text-lg text-white/95 leading-relaxed mb-6">
                  “{review.text}”
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="pt-4 border-t border-[#1f2723] flex items-center justify-between">
                <div>
                  <h4 className="font-sans text-xs uppercase tracking-wider font-semibold text-white">
                    {review.name}
                  </h4>
                  <p className="font-sans text-[11px] text-gold-400 mt-0.5">
                    {review.service}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-sans text-[#808080]">
                  <CheckCircle2 size={13} className="text-gold-400" />
                  <span>Verificado</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
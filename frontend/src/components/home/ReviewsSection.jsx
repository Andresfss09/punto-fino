import React from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2 } from 'lucide-react';

const REVIEWS = [
  { 
    id: 1, 
    name: 'David Moreno', 
    service: 'EXPERIENCIA PLATINIUM / GOL DE ORO',
    date: 'Septiembre 2026',
    rating: 5, 
    text: 'La atención de Juan David es de otro nivel. El diagnóstico de visagismo fue exacto y la combinación con la toalla caliente y el vapor ozono te renueva por completo. La mejor barbería de Cali.' 
  },
  { 
    id: 2, 
    name: 'Sergio Restrepo', 
    service: 'EXPERIENCIA PUNTO FINO + BARBA',
    date: 'Septiembre 2026',
    rating: 5, 
    text: 'Puntualidad rigurosa, ambiente impecable y técnica milimétrica. Llevo meses viniendo a cortarme con Juan Diego y la consistencia en el degradado y la navaja es insuperable.' 
  },
  { 
    id: 3, 
    name: 'Miguel Ángel Torres', 
    service: 'RITUAL DE BARBA',
    date: 'Agosto 2026',
    rating: 5, 
    text: 'El ritual de barba con aceites esenciales y vapor ozonizado es una verdadera experiencia. Emanuel cuidó cada contorno con precisión quirúrgica. Totalmente recomendado.' 
  },
];

export default function ReviewsSection() {
  return (
    <section id="testimonios" className="py-24 sm:py-32 bg-black border-b border-[#222222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-[11px] font-display uppercase tracking-[3px] text-[#888888] font-normal">
              OPINIONES VERIFICADAS · WEIBOOK CALI
            </span>
          </div>
          <h2 className="font-display font-medium text-3xl sm:text-4xl lg:text-5xl text-white uppercase tracking-[3px] leading-tight">
            RESEÑAS DE CLIENTES
          </h2>
          <p className="text-[#888888] font-sans text-xs sm:text-sm mt-3">
            Calificación de 4.9 ★ respaldada por clientes satisfechos en nuestra sede de Villacolombia.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {REVIEWS.map((review, i) => (
            <motion.div 
              key={review.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
              className="bg-[#111111] border border-[#262626] hover:border-white/50 rounded-none p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(5)].map((_, idx) => (
                    <Star 
                      key={idx} 
                      size={13} 
                      className={idx < review.rating ? "text-white fill-white" : "text-[#333333]"} 
                    />
                  ))}
                  <span className="font-mono text-xs text-white ml-2 font-medium">5.0</span>
                </div>
                
                {/* Quote Text */}
                <p className="text-[#cccccc] text-xs sm:text-sm font-sans font-light leading-relaxed mb-6">
                  “{review.text}”
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="pt-4 border-t border-[#222222] flex items-center justify-between">
                <div>
                  <h4 className="font-display text-xs uppercase tracking-[1.5px] font-medium text-white">
                    {review.name}
                  </h4>
                  <p className="text-[10px] font-display uppercase tracking-[1px] text-[#888888] mt-0.5">
                    {review.service}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-display uppercase tracking-wider text-[#888888]">
                  <CheckCircle2 size={12} className="text-white" />
                  <span>CITA REAL</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
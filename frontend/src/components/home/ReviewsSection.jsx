import React from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2 } from 'lucide-react';

const REVIEWS = [
  { 
    id: 1, 
    name: 'Juan David Gómez', 
    service: 'Experiencia Platinium / Gol de Oro',
    date: 'Septiembre 2026',
    rating: 5, 
    text: 'El ritual con vapor ozono frío y caliente, la mascarilla para puntos negros y el corte con visagismo es de otro nivel. Juan David entiende con exactitud lo que favorece a las facciones de tu rostro.' 
  },
  { 
    id: 2, 
    name: 'Camilo Andrés Mora', 
    service: 'Experiencia Punto Fino + Ritual de Barba',
    date: 'Septiembre 2026',
    rating: 5, 
    text: 'Puntualidad impecable y trato de primera. El ritual de barba con aceites hidratantes y navaja libre deja la piel relajada y sin irritación. Sin duda la mejor barbería de Villacolombia.' 
  },
  { 
    id: 3, 
    name: 'Felipe Benítez', 
    service: 'Experiencia Punto Fino (Corte + Cejas)',
    date: 'Agosto 2026',
    rating: 5, 
    text: 'El perfilado de cejas y el degradado milimétrico son perfectos. Ambiente sobrio, higiénico y con productos profesionales de alta gama.' 
  },
];

export default function ReviewsSection() {
  return (
    <section className="py-24 bg-[#000000] border-b border-[#1e1e1e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="eyebrow block mb-3 text-gold-400">
            Opiniones Reales · 4.9 ★ Weibook
          </span>
          <h2 className="display-hero text-2xl sm:text-3xl lg:text-4xl text-white font-medium">
            La Voz de Nuestros Clientes
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#888888] mt-3">
            Calificación 4.9 / 5.0 basada en 16 reseñas reales y verificadas en la plataforma de reservas de Punto Fino.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((review, i) => (
            <motion.div 
              key={review.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              viewport={{ once: true }}
              className="bg-[#0a0a0a] border border-[#1e1e1e] hover:border-[#383838] rounded-none p-6 sm:p-7 flex flex-col justify-between transition-all duration-200"
            >
              <div>
                {/* Rating Stars (Antique Gold) */}
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(5)].map((_, idx) => (
                    <Star 
                      key={idx} 
                      size={13} 
                      className={idx < review.rating ? "text-gold-400 fill-gold-400" : "text-[#262626]"} 
                    />
                  ))}
                  <span className="font-mono text-xs text-[#888888] ml-2 font-medium">5.0</span>
                </div>
                
                {/* Review Text */}
                <p className="font-sans text-sm text-[#d4d4d4] leading-relaxed mb-6 font-normal">
                  “{review.text}”
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="pt-4 border-t border-[#1e1e1e] flex items-center justify-between">
                <div>
                  <h4 className="font-sans text-xs uppercase tracking-[0.16em] font-medium text-white">
                    {review.name}
                  </h4>
                  <p className="font-mono text-[11px] text-gold-400 mt-0.5">
                    {review.service}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#888888]">
                  <CheckCircle2 size={13} className="text-gold-400" />
                  <span>VERIFICADO</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
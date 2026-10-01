import React from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2 } from 'lucide-react';

const REVIEWS = [
  { 
    id: 1, 
    name: 'Carlos Alberto Gómez', 
    service: 'Combo Completo Triadix',
    date: 'Septiembre 2026',
    rating: 5, 
    text: 'Excelente servicio por parte de Andrés Felipe. La toalla caliente, la mascarilla facial y el corte quedaron de 10. Muy recomendado, te atienden puntual y el lugar es impecable.' 
  },
  { 
    id: 2, 
    name: 'Camilo Andrés Mora', 
    service: 'Corte de Cabello + Arreglo de Barba',
    date: 'Septiembre 2026',
    rating: 5, 
    text: 'Puntualidad impecable y trato de primera por parte de Nicolás Chávez. El arreglo de barba con navaja y aceites deja la piel fresca y sin irritación. Sin duda la mejor barbería en Cali.' 
  },
  { 
    id: 3, 
    name: 'Felipe Benítez', 
    service: 'Corte de Cabello + Cejas',
    date: 'Agosto 2026',
    rating: 5, 
    text: 'El degradado y el perfilado de cejas realizado por Luis De Ávila quedó perfecto. Muy buena vibra, música agradable y atención de calidad desde que entras.' 
  },
];

export default function ReviewsSection() {
  return (
    <section id="resenas" className="py-24 bg-[#000000] border-b border-[#1e1e1e] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-2 h-2 bg-[#cfa53b]"></span>
            <span className="font-sans text-[11px] uppercase tracking-[0.28em] text-[#cfa53b] font-medium">
              05 · TESTIMONIOS VERIFICADOS · 4.9 ★ CLIENTES TRIADIX
            </span>
          </div>
          <h2 className="display-hero text-2xl sm:text-3xl lg:text-4xl text-white font-medium">
            La Voz de Nuestros Clientes
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#aaaaaa] mt-3">
            Calificación 4.9 / 5.0 basada en opiniones reales de clientes que se cortan en Triadix.
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
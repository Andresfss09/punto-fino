import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import BrutalCard from '../ui/BrutalCard';

const REVIEWS = [
  { id: 1, name: 'David M.', rating: 5, text: 'Excelente servicio, el fade quedó impecable. Muy puntuales y el lugar tiene mucho estilo.' },
  { id: 2, name: 'Sergio R.', rating: 5, text: 'Llevo 2 años cortándome aquí y nunca decepcionan. Carlos es un maestro con las tijeras.' },
  { id: 3, name: 'Miguel T.', rating: 4, text: 'Buena música, buena vibra. El arreglo de barba con toalla caliente es recomendado.' },
];

export default function ReviewsSection() {
  return (
    <section className="py-20 bg-dark-400">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold uppercase tracking-wider text-white">
            Lo Que Dicen
          </h2>
          <div className="w-24 h-2 bg-gold-500 mx-auto mt-4"></div>
        </div>

        <div className="flex overflow-x-auto sm:grid sm:grid-cols-2 md:grid-cols-3 gap-6 pb-8 snap-x snap-mandatory scrollbar-hide px-4 sm:px-0">
          {REVIEWS.map((review, i) => (
            <motion.div 
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="min-w-[85vw] sm:min-w-0 snap-center"
            >
              <BrutalCard className="h-full flex flex-col relative pt-10">
                <div className="absolute top-4 right-4 text-gold-500 opacity-20">
                  <Quote size={40} />
                </div>
                
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < review.rating ? "text-gold-500 fill-gold-500" : "text-gray-600"} />
                  ))}
                </div>
                
                <p className="text-gray-300 flex-grow mb-6 font-sans leading-relaxed italic">
                  "{review.text}"
                </p>
                
                <div className="brutal-divider mb-4"></div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold-500 border-2 border-dark-500 shadow-brutal-sm flex items-center justify-center font-bold text-dark-500">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold uppercase text-sm">{review.name}</p>
                    <p className="text-[10px] text-gray-500 font-mono-price uppercase tracking-wider">Cliente Verificado</p>
                  </div>
                </div>
              </BrutalCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Star, Users, Scissors } from 'lucide-react';

export default function HeroSection() {
  const stats = [
    { icon: Star, value: '5.0', label: 'Calificación' },
    { icon: Users, value: '500+', label: 'Clientes' },
    { icon: Scissors, value: '6+', label: 'Servicios' },
    { icon: Calendar, value: '3', label: 'Barberos' },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dark-400">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-dark-400"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-500/3 rounded-full blur-3xl"></div>
      </div>

      {/* Decorative scissors pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute text-gold-500/5 text-8xl select-none"
            style={{
              top: `${15 + i * 15}%`,
              left: `${5 + (i % 3) * 35}%`,
              transform: `rotate(${i * 30}deg)`,
            }}
          >
            ✂
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 rounded-full px-4 py-2 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse"></span>
            <span className="text-gold-400 text-sm font-medium">Barbería Premium · Cali, Colombia</span>
          </motion.div>

          {/* Título */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            El arte del{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-shadow-gold">
              buen corte
            </span>
          </motion.h1>

          {/* Descripción */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-400 mb-10 leading-relaxed max-w-xl"
          >
            Profesionales en asesoría de imagen. Diseños clásicos y de tendencia.
            Mascarillas faciales. La experiencia que te mereces.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <Link to="/reservar" className="btn-primary text-base flex items-center justify-center gap-2">
              <Calendar size={20} />
              Reservar ahora
            </Link>
            <Link to="/#servicios" className="btn-secondary text-base flex items-center justify-center gap-2">
              <Scissors size={20} />
              Ver servicios
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="glass rounded-xl p-4 text-center">
                <Icon size={20} className="text-gold-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-gray-600 tracking-widest uppercase">Explorar</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-0.5 h-8 bg-gradient-to-b from-gold-500 to-transparent"
        />
      </motion.div>
    </section>
  );
}
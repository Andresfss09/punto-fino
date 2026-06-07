import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/home/HeroSection';
import ServicesSection from '../components/home/ServicesSection';
import BarbersSection from '../components/home/BarbersSection';
import ReviewsSection from '../components/home/ReviewsSection';

export default function HomePage() {
  return (
    <div className="bg-dark-400">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <BarbersSection />
      <ReviewsSection />
      <footer className="bg-dark-300 border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">✂️</span>
            <span className="font-display text-xl font-bold text-white">Punto Fino</span>
          </div>
          <p className="text-gray-500 text-sm">cra 12 #53-51 Villacolombia, Cali · Abierto 09:00 - 20:30</p>
          <p className="text-gray-600 text-xs mt-4">© 2025 Punto Fino. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const LightHero: React.FC = () => {
  const { theme, colors } = useTheme();

  const heroContent = {
    gifts: {
      title: 'Elegancia Atemporal',
      subtitle: 'Regalos únicos que expresan sofisticación',
      description: 'Descubre nuestra colección exclusiva de regalos elegantes.'
    },
    tech: {
      title: 'Innovación Tecnológica',
      subtitle: 'El futuro en tus manos',
      description: 'Explora la última tecnología con productos innovadores.'
    }
  };

  const content = heroContent[theme];

  return (
    <section id="hero" className="min-h-screen flex items-center" style={{
      background: theme === 'gifts' 
        ? 'linear-gradient(135deg, #FFD300, #FFA500)'
        : 'linear-gradient(135deg, #2563EB, #1D4ED8)'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="text-white text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6">
              {content.title}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4">
              {content.subtitle}
            </p>
            <p className="text-base sm:text-lg mb-6 sm:mb-8 opacity-90">
              {content.description}
            </p>
            <div className="flex justify-center lg:justify-start">
              <button 
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base hover:bg-gray-100 transition-colors"
              >
                Explorar Catálogo
              </button>
            </div>
          </div>
          <div className="w-full h-64 sm:h-80 lg:h-96 bg-white/20 rounded-2xl flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-4xl sm:text-5xl lg:text-6xl mb-4">{theme === 'gifts' ? '🎁' : '📱'}</div>
              <p className="text-base sm:text-lg">{content.title}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LightHero;
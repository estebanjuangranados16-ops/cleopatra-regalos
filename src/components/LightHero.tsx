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
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              {content.title}
            </h1>
            <p className="text-xl md:text-2xl mb-4">
              {content.subtitle}
            </p>
            <p className="text-lg mb-8 opacity-90">
              {content.description}
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold"
              >
                Explorar Catálogo
              </button>
            </div>
          </div>
          <div className="w-full h-96 bg-white/20 rounded-2xl flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-6xl mb-4">{theme === 'gifts' ? '🎁' : '📱'}</div>
              <p className="text-lg">{content.title}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LightHero;
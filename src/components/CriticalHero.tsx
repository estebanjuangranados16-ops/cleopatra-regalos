import React from 'react';

const CriticalHero: React.FC = () => {
  return (
    <section className="hero-bg min-h-screen flex items-center justify-center text-white">
      <div className="text-center px-4">
        <img 
          src="/assets/brand/logos/cleopatra-logo-gold.png" 
          alt="Cleopatra Regalos" 
          className="w-20 h-20 mx-auto mb-6"
          width="80"
          height="80"
        />
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Cleopatra Regalos
        </h1>
        <p className="text-xl md:text-2xl mb-8">
          Regalos únicos y tecnología premium
        </p>
        <button className="bg-white text-yellow-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors">
          Explorar Productos
        </button>
      </div>
    </section>
  );
};

export default CriticalHero;
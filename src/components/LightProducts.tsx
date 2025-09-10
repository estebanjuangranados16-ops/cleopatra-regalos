import React from 'react';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useStore } from '../store/useStore';
import { products } from '../utils/constants';

const LightProducts: React.FC = () => {
  const { colors } = useTheme();
  const { addToCart } = useStore();
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <section id="products" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6" style={{ color: colors.secondary }}>
            Nuestros Productos
          </h2>
          <p className="text-xl text-gray-600">
            Descubre nuestra selección de productos premium
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.slice(0, 6).map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover"
                loading="lazy"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2" style={{ color: colors.secondary }}>
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold" style={{ color: colors.primary }}>
                    {product.price}
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold"
                    style={{ backgroundColor: colors.accent }}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/shop')}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
            style={{ backgroundColor: colors.primary }}
          >
            Ver Todos los Productos
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default LightProducts;
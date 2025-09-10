import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useTheme } from '../contexts/ThemeContext';
import SimpleNavbar from '../components/SimpleNavbar';
import WhatsAppButton from '../components/WhatsAppButton';

const CartPage: React.FC = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, getCartTotal, getCartItemsCount } = useStore();

  const formatPrice = (price: string | number) => {
    let numPrice: number;
    if (typeof price === 'string') {
      numPrice = parseFloat(price.replace(/[$.,]/g, ''));
    } else {
      numPrice = price;
    }
    if (isNaN(numPrice)) numPrice = 0;
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(numPrice);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SimpleNavbar />
        <div className="flex items-center justify-center p-4 min-h-[calc(100vh-4rem)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-200 flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold mb-4" style={{ color: colors.secondary }}>
            Tu carrito está vacío
          </h1>
          <p className="text-gray-600 mb-8">
            Agrega algunos productos para comenzar tu compra
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 rounded-lg text-white font-semibold"
            style={{ backgroundColor: colors.primary }}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Continuar comprando
          </Link>
        </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleNavbar />
      <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Continuar comprando
          </Link>
          <h1 className="text-3xl font-bold" style={{ color: colors.secondary }}>
            Carrito de Compras ({getCartItemsCount()} productos)
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {cart.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-32 sm:w-20 sm:h-20 object-cover rounded-lg"
                />
                
                <div className="flex-1 w-full sm:w-auto">
                  <h3 className="font-semibold text-base sm:text-lg" style={{ color: colors.secondary }}>
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm hidden sm:block">{item.description}</p>
                  <p className="font-bold text-base sm:text-lg mt-1 sm:mt-2" style={{ color: colors.primary }}>
                    {item.price}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg sm:ml-4"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>


              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-sm p-4 sm:p-6 sticky top-4 sm:top-8"
            >
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6" style={{ color: colors.secondary }}>
                Resumen del Pedido
              </h3>
              
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({getCartItemsCount()} productos)</span>
                  <span>{formatPrice(getCartTotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span className="text-green-600">Gratis</span>
                </div>
                <div className="border-t pt-3 sm:pt-4">
                  <div className="flex justify-between text-lg sm:text-xl font-bold">
                    <span>Total</span>
                    <span style={{ color: colors.primary }}>{formatPrice(getCartTotal())}</span>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/checkout')}
                className="w-full py-3 sm:py-4 rounded-lg text-white font-semibold text-base sm:text-lg"
                style={{ backgroundColor: colors.primary }}
              >
                Proceder al Pago
              </motion.button>

              <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-green-50 rounded-lg">
                <p className="text-xs sm:text-sm text-green-800">
                  🚚 <strong>Envío gratis</strong> en Madrid y alrededores
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      </div>
      <WhatsAppButton />
    </div>
  );
};

export default CartPage;
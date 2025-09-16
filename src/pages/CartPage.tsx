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
                onClick={() => {
                  const message = `Hola! Quiero comprar estos productos:\n\n${cart.map(item => 
                    `• ${item.name} (Cantidad: ${item.quantity}) - ${item.price}`
                  ).join('\n')}\n\nTotal: ${formatPrice(getCartTotal())}`;
                  
                  const whatsappUrl = `https://wa.me/573024547679?text=${encodeURIComponent(message)}`;
                  window.open(whatsappUrl, '_blank');
                }}
                className="w-full py-3 sm:py-4 rounded-lg text-white font-semibold text-base sm:text-lg flex items-center justify-center gap-2"
                style={{ backgroundColor: colors.primary }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                Consultar por WhatsApp
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
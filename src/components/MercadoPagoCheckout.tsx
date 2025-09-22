import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, Building2, Banknote, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useOrderStore, OrderItem, ShippingInfo } from '../store/orderStore';
import { useTheme } from '../contexts/ThemeContext';

interface MercadoPagoCheckoutProps {
  items: OrderItem[];
  shippingInfo: ShippingInfo;
  onSuccess: (orderId: string) => void;
  onError: (error: string) => void;
}

const MercadoPagoCheckout: React.FC<MercadoPagoCheckoutProps> = ({
  items,
  shippingInfo,
  onSuccess,
  onError
}) => {
  const { theme } = useTheme();
  const { createOrder } = useOrderStore();
  const [isCreatingPreference, setIsCreatingPreference] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('credit_card');

  // Crear preferencia y redirigir
  const handleCreatePreference = async () => {
    try {
      setIsCreatingPreference(true);

      // Crear orden en el store
      const orderId = createOrder(items, shippingInfo, 'mercadopago');

      // Simular creación de preferencia (para demo)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mostrar mensaje informativo
      onError('MercadoPago requiere configuración adicional. Por favor usa WhatsApp por ahora.');
      
    } catch (error) {
      console.error('Error creating preference:', error);
      onError('Error al procesar el pago. Intenta nuevamente.');
    } finally {
      setIsCreatingPreference(false);
    }
  };

  // Métodos de pago disponibles
  const paymentMethods = [
    {
      id: 'credit_card',
      name: 'Tarjeta de Crédito/Débito',
      icon: CreditCard,
      description: 'Visa, Mastercard, American Express',
      color: theme === 'gifts' ? 'from-yellow-400 to-orange-500' : 'from-blue-400 to-blue-600'
    },
    {
      id: 'pse',
      name: 'PSE',
      icon: Building2,
      description: 'Pagos Seguros en Línea',
      color: 'from-green-400 to-green-600'
    },
    {
      id: 'cash',
      name: 'Efectivo',
      icon: Banknote,
      description: 'Efecty, Baloto',
      color: 'from-purple-400 to-purple-600'
    },
    {
      id: 'digital_wallet',
      name: 'Billeteras Digitales',
      icon: Smartphone,
      description: 'Nequi, Daviplata',
      color: 'from-pink-400 to-pink-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Selección de método de pago */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Selecciona tu método de pago
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <motion.button
                key={method.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedPaymentMethod(method.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedPaymentMethod === method.id
                    ? `border-${theme === 'gifts' ? 'yellow' : 'blue'}-500 bg-${theme === 'gifts' ? 'yellow' : 'blue'}-50`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${method.color}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-800">{method.name}</div>
                    <div className="text-sm text-gray-500">{method.description}</div>
                  </div>
                  {selectedPaymentMethod === method.id && (
                    <CheckCircle className={`w-5 h-5 text-${theme === 'gifts' ? 'yellow' : 'blue'}-500 ml-auto`} />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Botón de pago */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleCreatePreference}
        disabled={isCreatingPreference}
        className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 ${
          theme === 'gifts'
            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600'
            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isCreatingPreference ? (
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Procesando...</span>
          </div>
        ) : (
          'Pagar con Mercado Pago'
        )}
      </motion.button>

      {/* Información de seguridad */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
          <div className="text-sm text-blue-700">
            <div className="font-medium mb-1">Pago 100% seguro</div>
            <div>
              Tus datos están protegidos con encriptación SSL y Mercado Pago.
              No almacenamos información de tarjetas de crédito.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MercadoPagoCheckout;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, Building2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useOrderStore, OrderItem, ShippingInfo } from '../store/orderStore';
import { paymentService, PaymentMethod, PaymentRequest } from '../services/paymentService';
import { mockPaymentService } from '../services/mockPaymentService';
import { inventoryService } from '../services/inventoryService';

// Use mock service in development
const activePaymentService = process.env.NODE_ENV === 'development' ? mockPaymentService : paymentService;

interface WompiCheckoutProps {
  items: OrderItem[];
  shippingInfo: ShippingInfo;
  onSuccess: (orderId: string) => void;
  onError: (error: string) => void;
}

const WompiCheckout: React.FC<WompiCheckoutProps> = ({
  items,
  shippingInfo,
  onSuccess,
  onError
}) => {
  const { colors } = useTheme();
  const { createOrder } = useOrderStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'CARD' | 'NEQUI' | 'PSE'>('CARD');
  const [cardData, setCardData] = useState({
    number: '',
    cvc: '',
    exp_month: '',
    exp_year: '',
    card_holder: ''
  });
  const [pseData, setPseData] = useState({
    user_type: 'NATURAL' as 'NATURAL' | 'JURIDICA',
    user_legal_id_type: 'CC' as 'CC' | 'CE' | 'NIT' | 'PP',
    user_legal_id: '',
    financial_institution_code: ''
  });

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePayment = async () => {
    try {
      setIsProcessing(true);

      // Verificar stock antes de procesar el pago
      for (const item of items) {
        const hasStock = inventoryService.isInStock(item.id, item.quantity);
        if (!hasStock) {
          const inventory = inventoryService.getProductInventory(item.id);
          const available = inventory?.available || 0;
          throw new Error(`Stock insuficiente para ${item.name}. Disponible: ${available}, Solicitado: ${item.quantity}`);
        }
      }

      const orderId = createOrder(items, shippingInfo, 'wompi');
      
      let paymentMethod: PaymentMethod;

      switch (selectedMethod) {
        case 'CARD':
          // En modo test, usar datos de prueba
          paymentMethod = {
            type: 'CARD',
            token: 'test_card_token', // En producción, tokenizar con Wompi
            installments: 1
          };
          break;
        case 'NEQUI':
          paymentMethod = {
            type: 'NEQUI'
          };
          break;
        case 'PSE':
          paymentMethod = {
            type: 'PSE',
            user_type: pseData.user_type,
            user_legal_id_type: pseData.user_legal_id_type,
            user_legal_id: pseData.user_legal_id,
            financial_institution_code: pseData.financial_institution_code
          };
          break;
      }

      const paymentRequest: PaymentRequest = {
        amount_in_cents: activePaymentService.formatAmount(total),
        currency: 'COP',
        customer_email: shippingInfo.email,
        payment_method: paymentMethod,
        reference: activePaymentService.generateReference(),
        customer_data: {
          phone_number: activePaymentService.formatPhoneNumber(shippingInfo.phone),
          full_name: shippingInfo.fullName
        },
        shipping_address: {
          address_line_1: shippingInfo.address,
          city: shippingInfo.city,
          region: shippingInfo.department,
          country: 'CO',
          postal_code: shippingInfo.zipCode
        }
      };

      const result = await activePaymentService.createPayment(paymentRequest);
      
      if (result.success) {
        onSuccess(orderId);
      } else {
        onError('Error al procesar el pago');
      }

    } catch (error) {
      console.error('Payment error:', error);
      onError(error instanceof Error ? error.message : 'Error al procesar el pago');
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    {
      id: 'CARD' as const,
      name: 'Tarjeta de Crédito/Débito',
      icon: CreditCard,
      description: 'Visa, Mastercard',
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: 'NEQUI' as const,
      name: 'Nequi',
      icon: Smartphone,
      description: 'Pago con Nequi',
      color: 'from-purple-400 to-purple-600'
    },
    {
      id: 'PSE' as const,
      name: 'PSE',
      icon: Building2,
      description: 'Débito a cuenta corriente/ahorros',
      color: 'from-green-400 to-green-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Método de pago */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Selecciona tu método de pago
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <motion.button
                key={method.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedMethod(method.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedMethod === method.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${method.color}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-800">{method.name}</div>
                    <div className="text-sm text-gray-500">{method.description}</div>
                  </div>
                  {selectedMethod === method.id && (
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Formularios específicos */}
      {selectedMethod === 'CARD' && (
        <div className="bg-gray-50 p-6 rounded-xl space-y-4">
          <h4 className="font-semibold text-gray-800">Datos de la tarjeta</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Número de tarjeta (TEST: 4242424242424242)"
                value={cardData.number}
                onChange={(e) => setCardData({...cardData, number: e.target.value})}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <input
              type="text"
              placeholder="MM/YY (TEST: 12/25)"
              value={`${cardData.exp_month}/${cardData.exp_year}`}
              onChange={(e) => {
                const [month, year] = e.target.value.split('/');
                setCardData({...cardData, exp_month: month || '', exp_year: year || ''});
              }}
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="text"
              placeholder="CVC (TEST: 123)"
              value={cardData.cvc}
              onChange={(e) => setCardData({...cardData, cvc: e.target.value})}
              className="w-full p-3 border rounded-lg"
            />
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Nombre del titular"
                value={cardData.card_holder}
                onChange={(e) => setCardData({...cardData, card_holder: e.target.value})}
                className="w-full p-3 border rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {selectedMethod === 'PSE' && (
        <div className="bg-gray-50 p-6 rounded-xl space-y-4">
          <h4 className="font-semibold text-gray-800">Información PSE</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={pseData.user_type}
              onChange={(e) => setPseData({...pseData, user_type: e.target.value as 'NATURAL' | 'JURIDICA'})}
              className="w-full p-3 border rounded-lg"
            >
              <option value="NATURAL">Persona Natural</option>
              <option value="JURIDICA">Persona Jurídica</option>
            </select>
            <select
              value={pseData.user_legal_id_type}
              onChange={(e) => setPseData({...pseData, user_legal_id_type: e.target.value as any})}
              className="w-full p-3 border rounded-lg"
            >
              <option value="CC">Cédula de Ciudadanía</option>
              <option value="CE">Cédula de Extranjería</option>
              <option value="NIT">NIT</option>
              <option value="PP">Pasaporte</option>
            </select>
            <input
              type="text"
              placeholder="Número de documento"
              value={pseData.user_legal_id}
              onChange={(e) => setPseData({...pseData, user_legal_id: e.target.value})}
              className="w-full p-3 border rounded-lg"
            />
            <select
              value={pseData.financial_institution_code}
              onChange={(e) => setPseData({...pseData, financial_institution_code: e.target.value})}
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Seleccionar banco</option>
              {activePaymentService.getPSEBanks().map(bank => (
                <option key={bank.code} value={bank.code}>{bank.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {selectedMethod === 'NEQUI' && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <Smartphone className="w-6 h-6 text-purple-600 mt-1" />
            <div>
              <h4 className="font-semibold text-purple-800 mb-2">Pago con Nequi</h4>
              <p className="text-purple-700 text-sm mb-3">
                Serás redirigido a la app de Nequi para completar el pago de forma segura.
              </p>
              <div className="text-xs text-purple-600">
                ✓ Pago instantáneo<br/>
                ✓ Sin comisiones adicionales<br/>
                ✓ 100% seguro
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botón de pago */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-50"
        style={{ backgroundColor: colors.primary }}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Procesando pago...</span>
          </div>
        ) : (
          `Pagar ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(total)}`
        )}
      </motion.button>

      {/* Información de seguridad */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
          <div className="text-sm text-blue-700">
            <div className="font-medium mb-1">
              {process.env.NODE_ENV === 'development' ? 'Modo Demo Activo' : 'Modo de Prueba Activo'}
            </div>
            <div>
              {process.env.NODE_ENV === 'development' 
                ? 'Simulación completa del flujo de pagos. Los resultados son aleatorios para demostración.'
                : 'Este es un entorno de pruebas. No se realizarán cargos reales. Usa los datos de prueba proporcionados.'
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WompiCheckout;
import React from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { XCircle, ArrowLeft, MessageCircle, RefreshCw } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SimpleNavbar from '../components/SimpleNavbar';

const PaymentFailure: React.FC = () => {
  const { colors } = useTheme();
  const [searchParams] = useSearchParams();

  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');
  const externalReference = searchParams.get('external_reference');

  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleNavbar />
      <div className="py-16">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="p-8 text-center bg-red-50 border-b border-red-200">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center"
              >
                <XCircle className="w-10 h-10 text-red-600" />
              </motion.div>
              
              <h1 className="text-3xl font-bold mb-2 text-red-600">
                Pago No Procesado
              </h1>
              <p className="text-gray-600 text-lg">
                Hubo un problema al procesar tu pago
              </p>
            </div>

            <div className="p-8">
              <div className="space-y-6">
                {/* Información del intento de pago */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-4">Detalles del Intento</h3>
                  <div className="space-y-2 text-sm">
                    {externalReference && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Referencia:</span>
                        <span className="font-medium">#{externalReference.slice(-8)}</span>
                      </div>
                    )}
                    {paymentId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">ID de Transacción:</span>
                        <span className="font-medium">#{paymentId}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fecha:</span>
                      <span className="font-medium">{new Date().toLocaleDateString('es-CO')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estado:</span>
                      <span className="font-medium text-red-600 capitalize">
                        {status === 'rejected' ? 'Rechazado' : 'Fallido'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Posibles causas */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <h3 className="font-semibold text-yellow-800 mb-3">Posibles Causas</h3>
                  <div className="space-y-2 text-sm text-yellow-700">
                    <p>• Fondos insuficientes en la tarjeta</p>
                    <p>• Datos de la tarjeta incorrectos</p>
                    <p>• Tarjeta bloqueada o vencida</p>
                    <p>• Límites de transacción excedidos</p>
                    <p>• Problemas temporales del banco</p>
                  </div>
                </div>

                {/* Qué hacer */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="font-semibold text-blue-800 mb-3">¿Qué puedes hacer?</h3>
                  <div className="space-y-2 text-sm text-blue-700">
                    <p>✓ Verificar los datos de tu tarjeta</p>
                    <p>✓ Contactar a tu banco si es necesario</p>
                    <p>✓ Intentar con otro método de pago</p>
                    <p>✓ Contactarnos por WhatsApp para ayuda</p>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/checkout"
                    className="flex-1 flex items-center justify-center px-6 py-3 text-white rounded-lg transition-colors"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Intentar Nuevamente
                  </Link>
                  
                  <a
                    href={`https://wa.me/57${process.env.REACT_APP_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                      `Hola! Tuve un problema con el pago de mi pedido. Referencia: #${externalReference?.slice(-8) || 'N/A'}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Ayuda por WhatsApp
                  </a>
                </div>

                <div className="text-center">
                  <Link
                    to="/"
                    className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver al inicio
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
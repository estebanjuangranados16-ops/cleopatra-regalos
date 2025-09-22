import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, ArrowLeft, MessageCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useOrderStore } from '../store/orderStore';
import SimpleNavbar from '../components/SimpleNavbar';

const PAYMENT_STATUS = {
  APPROVED: 'approved',
  PENDING: 'pending',
  REJECTED: 'rejected'
} as const;

const PaymentSuccess: React.FC = () => {
  const { colors } = useTheme();
  const [searchParams] = useSearchParams();
  const { updateOrderPayment } = useOrderStore();

  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');
  const externalReference = searchParams.get('external_reference');

  useEffect(() => {
    if (paymentId && status && externalReference) {
      // Actualizar el estado del pago en el store
      updateOrderPayment(
        externalReference,
        status as any,
        paymentId
      );
    }
  }, [paymentId, status, externalReference, updateOrderPayment]);

  const getStatusInfo = () => {
    switch (status) {
      case PAYMENT_STATUS.APPROVED:
        return {
          icon: CheckCircle,
          title: '¡Pago Exitoso!',
          message: 'Tu pago ha sido procesado correctamente',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case PAYMENT_STATUS.PENDING:
        return {
          icon: Package,
          title: 'Pago Pendiente',
          message: 'Tu pago está siendo procesado',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        };
      default:
        return {
          icon: CheckCircle,
          title: 'Pago Procesado',
          message: 'Tu pago ha sido recibido',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

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
            <div className={`p-8 text-center ${statusInfo.bgColor} ${statusInfo.borderColor} border-b`}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className={`w-20 h-20 mx-auto mb-4 rounded-full ${statusInfo.bgColor} flex items-center justify-center`}
              >
                <StatusIcon className={`w-10 h-10 ${statusInfo.color}`} />
              </motion.div>
              
              <h1 className={`text-3xl font-bold mb-2 ${statusInfo.color}`}>
                {statusInfo.title}
              </h1>
              <p className="text-gray-600 text-lg">
                {statusInfo.message}
              </p>
            </div>

            <div className="p-8">
              <div className="space-y-6">
                {/* Información del pedido */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-4">Detalles del Pedido</h3>
                  <div className="space-y-2 text-sm">
                    {externalReference && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Número de Pedido:</span>
                        <span className="font-medium">#{externalReference.slice(-8)}</span>
                      </div>
                    )}
                    {paymentId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">ID de Pago:</span>
                        <span className="font-medium">#{paymentId}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Modo:</span>
                      <span className="font-medium text-blue-600">
                        {process.env.NODE_ENV === 'development' ? 'Demo' : 'Prueba'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fecha:</span>
                      <span className="font-medium">{new Date().toLocaleDateString('es-CO')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estado:</span>
                      <span className={`font-medium capitalize ${statusInfo.color}`}>
                        {status === PAYMENT_STATUS.APPROVED ? 'Aprobado' : 
                         status === PAYMENT_STATUS.PENDING ? 'Pendiente' : 
                         'Procesado'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Próximos pasos */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="font-semibold text-blue-800 mb-3">¿Qué sigue?</h3>
                  <div className="space-y-2 text-sm text-blue-700">
                    {status === PAYMENT_STATUS.APPROVED ? (
                      <>
                        <p>✓ Recibirás un email de confirmación</p>
                        <p>✓ Procesaremos tu pedido en 24-48 horas</p>
                        <p>✓ Te contactaremos para coordinar la entrega</p>
                      </>
                    ) : (
                      <>
                        <p>⏳ Estamos verificando tu pago</p>
                        <p>📧 Te notificaremos cuando se confirme</p>
                        <p>📱 Puedes contactarnos por WhatsApp si tienes dudas</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/"
                    className="flex-1 flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Seguir Comprando
                  </Link>
                  
                  <a
                    href={`https://wa.me/57${process.env.REACT_APP_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                      `Hola! Tengo una consulta sobre mi pedido #${externalReference?.slice(-8) || 'N/A'}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center px-6 py-3 text-white rounded-lg transition-colors"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Contactar por WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
// Mock service para probar pagos sin backend
import { PaymentRequest, Transaction } from './paymentService';

class MockPaymentService {
  async createPayment(paymentData: PaymentRequest): Promise<{ success: boolean; transaction: Transaction }> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simular diferentes resultados basados en el método de pago
    const mockTransaction: Transaction = {
      id: `mock_${Date.now()}`,
      amount_in_cents: paymentData.amount_in_cents,
      reference: paymentData.reference,
      customer_email: paymentData.customer_email,
      currency: paymentData.currency,
      payment_method_type: paymentData.payment_method.type,
      status: this.getMockStatus(paymentData.payment_method.type),
      status_message: this.getMockStatusMessage(paymentData.payment_method.type),
      created_at: new Date().toISOString(),
      finalized_at: new Date().toISOString()
    };

    // Simular fallo ocasional para PSE
    if (paymentData.payment_method.type === 'PSE' && Math.random() < 0.3) {
      mockTransaction.status = 'DECLINED';
      mockTransaction.status_message = 'Transacción rechazada por el banco';
    }

    return {
      success: mockTransaction.status !== 'DECLINED',
      transaction: mockTransaction
    };
  }

  async getTransactionStatus(transactionId: string): Promise<{ success: boolean; transaction: Transaction }> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockTransaction: Transaction = {
      id: transactionId,
      amount_in_cents: 50000,
      reference: 'CLO-MOCK-123',
      customer_email: 'test@example.com',
      currency: 'COP',
      payment_method_type: 'CARD',
      status: 'APPROVED',
      status_message: 'Transacción aprobada',
      created_at: new Date().toISOString(),
      finalized_at: new Date().toISOString()
    };

    return {
      success: true,
      transaction: mockTransaction
    };
  }

  private getMockStatus(paymentType: string): 'PENDING' | 'APPROVED' | 'DECLINED' | 'VOIDED' {
    switch (paymentType) {
      case 'CARD':
        return Math.random() < 0.9 ? 'APPROVED' : 'DECLINED';
      case 'NEQUI':
        return Math.random() < 0.95 ? 'APPROVED' : 'PENDING';
      case 'PSE':
        return Math.random() < 0.8 ? 'APPROVED' : 'DECLINED';
      default:
        return 'APPROVED';
    }
  }

  private getMockStatusMessage(paymentType: string): string {
    const messages = {
      CARD: [
        'Transacción aprobada exitosamente',
        'Pago procesado correctamente',
        'Tarjeta autorizada'
      ],
      NEQUI: [
        'Pago Nequi exitoso',
        'Transferencia completada',
        'Dinero debitado de Nequi'
      ],
      PSE: [
        'Débito PSE aprobado',
        'Transferencia bancaria exitosa',
        'Pago autorizado por el banco'
      ]
    };

    const typeMessages = messages[paymentType as keyof typeof messages] || messages.CARD;
    return typeMessages[Math.floor(Math.random() * typeMessages.length)];
  }

  // Utility methods (same as real service)
  formatAmount(amount: number): number {
    return Math.round(amount * 100);
  }

  formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.startsWith('57') ? cleaned : `57${cleaned}`;
  }

  generateReference(): string {
    return `CLO-MOCK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  getPSEBanks() {
    return [
      { code: '1007', name: 'Bancolombia' },
      { code: '1013', name: 'BBVA Colombia' },
      { code: '1009', name: 'Citibank' },
      { code: '1006', name: 'Banco de Bogotá' },
      { code: '1012', name: 'Banco GNB Sudameris' },
      { code: '1060', name: 'Banco Pichincha S.A.' },
      { code: '1002', name: 'Banco Popular' },
      { code: '1058', name: 'Banco ProCredit Colombia' },
      { code: '1065', name: 'Banco Santander Colombia' },
      { code: '1066', name: 'Banco Serfinanza' },
      { code: '1051', name: 'Davivienda' },
      { code: '1001', name: 'Banco Agrario' },
      { code: '1030', name: 'Banco Caja Social' },
      { code: '1032', name: 'Banco Falabella' },
      { code: '1019', name: 'Scotiabank Colpatria' }
    ];
  }
}

export const mockPaymentService = new MockPaymentService();
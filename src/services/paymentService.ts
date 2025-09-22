// Servicio de pagos con Wompi
const FIREBASE_FUNCTIONS_URL = process.env.REACT_APP_FIREBASE_FUNCTIONS_URL || 'http://localhost:5001/cleopatra-regalos/us-central1';

// Wompi Test Credentials
export const WOMPI_TEST_CONFIG = {
  PUBLIC_KEY: 'pub_test_QGBWuUVmwzb5sADWqysmAfNBaPjpMoMZ',
  SANDBOX_URL: 'https://sandbox.wompi.co/v1'
};

export interface PaymentMethod {
  type: 'CARD' | 'NEQUI' | 'PSE';
  token?: string;
  installments?: number;
  user_type?: 'NATURAL' | 'JURIDICA';
  user_legal_id_type?: 'CC' | 'CE' | 'NIT' | 'PP';
  user_legal_id?: string;
  financial_institution_code?: string;
}

export interface PaymentRequest {
  amount_in_cents: number;
  currency: 'COP';
  customer_email: string;
  payment_method: PaymentMethod;
  reference: string;
  customer_data: {
    phone_number: string;
    full_name: string;
  };
  shipping_address?: {
    address_line_1: string;
    city: string;
    region: string;
    country: 'CO';
    postal_code?: string;
  };
}

export interface Transaction {
  id: string;
  amount_in_cents: number;
  reference: string;
  customer_email: string;
  currency: string;
  payment_method_type: string;
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'VOIDED';
  status_message: string;
  created_at: string;
  finalized_at?: string;
  payment_link_id?: string;
  payment_source_id?: string;
}

class PaymentService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${FIREBASE_FUNCTIONS_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async createPayment(paymentData: PaymentRequest): Promise<{ success: boolean; transaction: Transaction }> {
    return this.request<{ success: boolean; transaction: Transaction }>('/createPayment', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async getTransactionStatus(transactionId: string): Promise<{ success: boolean; transaction: Transaction }> {
    return this.request<{ success: boolean; transaction: Transaction }>(`/getTransactionStatus?id=${transactionId}`);
  }

  // Utility methods
  formatAmount(amount: number): number {
    return Math.round(amount * 100); // Convert to cents
  }

  formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.startsWith('57') ? cleaned : `57${cleaned}`;
  }

  generateReference(): string {
    return `CLO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // PSE Banks list (most common)
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

export const paymentService = new PaymentService();
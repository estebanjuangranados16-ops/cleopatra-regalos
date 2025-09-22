// Email notification service
export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface OrderEmailData {
  customerName: string;
  customerEmail: string;
  orderId: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  shippingAddress: string;
  paymentMethod: string;
}

class EmailService {
  private apiUrl = process.env.REACT_APP_EMAIL_API_URL || 'https://api.emailjs.com/api/v1.0/email/send';
  private serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID || 'service_cleopatra';
  private templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'template_order';
  private publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'your_public_key';

  // Send order confirmation email
  async sendOrderConfirmation(orderData: OrderEmailData): Promise<boolean> {
    try {
      const emailData = {
        service_id: this.serviceId,
        template_id: this.templateId,
        user_id: this.publicKey,
        template_params: {
          to_email: orderData.customerEmail,
          to_name: orderData.customerName,
          order_id: orderData.orderId,
          order_items: this.formatOrderItems(orderData.items),
          total_amount: this.formatCurrency(orderData.total),
          shipping_address: orderData.shippingAddress,
          payment_method: orderData.paymentMethod,
          order_date: new Date().toLocaleDateString('es-CO'),
          company_name: 'Cleopatra Regalos',
          company_phone: '+57 302 454 7679',
          company_email: 'info@cleopatraregalos.com'
        }
      };

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending order confirmation:', error);
      return false;
    }
  }

  // Send payment confirmation email
  async sendPaymentConfirmation(orderData: OrderEmailData, transactionId: string): Promise<boolean> {
    try {
      const emailData = {
        service_id: this.serviceId,
        template_id: 'template_payment_confirmation',
        user_id: this.publicKey,
        template_params: {
          to_email: orderData.customerEmail,
          to_name: orderData.customerName,
          order_id: orderData.orderId,
          transaction_id: transactionId,
          total_amount: this.formatCurrency(orderData.total),
          payment_date: new Date().toLocaleDateString('es-CO'),
          company_name: 'Cleopatra Regalos'
        }
      };

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending payment confirmation:', error);
      return false;
    }
  }

  // Send shipping notification
  async sendShippingNotification(orderData: OrderEmailData, trackingNumber?: string): Promise<boolean> {
    try {
      const emailData = {
        service_id: this.serviceId,
        template_id: 'template_shipping',
        user_id: this.publicKey,
        template_params: {
          to_email: orderData.customerEmail,
          to_name: orderData.customerName,
          order_id: orderData.orderId,
          tracking_number: trackingNumber || 'No disponible',
          shipping_address: orderData.shippingAddress,
          estimated_delivery: this.getEstimatedDelivery(),
          company_name: 'Cleopatra Regalos'
        }
      };

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending shipping notification:', error);
      return false;
    }
  }

  // Send low stock alert to admin
  async sendLowStockAlert(products: Array<{name: string; stock: number; threshold: number}>): Promise<boolean> {
    try {
      const emailData = {
        service_id: this.serviceId,
        template_id: 'template_low_stock',
        user_id: this.publicKey,
        template_params: {
          to_email: 'admin@cleopatraregalos.com',
          to_name: 'Administrador',
          low_stock_products: this.formatLowStockProducts(products),
          alert_date: new Date().toLocaleDateString('es-CO'),
          company_name: 'Cleopatra Regalos'
        }
      };

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending low stock alert:', error);
      return false;
    }
  }

  // Send welcome email
  async sendWelcomeEmail(customerName: string, customerEmail: string): Promise<boolean> {
    try {
      const emailData = {
        service_id: this.serviceId,
        template_id: 'template_welcome',
        user_id: this.publicKey,
        template_params: {
          to_email: customerEmail,
          to_name: customerName,
          company_name: 'Cleopatra Regalos',
          website_url: 'https://cleopatraregalos.com',
          whatsapp_number: '+57 302 454 7679'
        }
      };

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return false;
    }
  }

  // Private helper methods
  private formatOrderItems(items: OrderEmailData['items']): string {
    return items.map(item => 
      `• ${item.name} x${item.quantity} - ${this.formatCurrency(item.price * item.quantity)}`
    ).join('\n');
  }

  private formatLowStockProducts(products: Array<{name: string; stock: number; threshold: number}>): string {
    return products.map(product => 
      `• ${product.name}: ${product.stock} unidades (Mínimo: ${product.threshold})`
    ).join('\n');
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  }

  private getEstimatedDelivery(): string {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3); // 3 days from now
    return deliveryDate.toLocaleDateString('es-CO');
  }

  // Test email functionality
  async testEmail(): Promise<boolean> {
    return this.sendWelcomeEmail('Usuario de Prueba', 'test@cleopatraregalos.com');
  }
}

export const emailService = new EmailService();
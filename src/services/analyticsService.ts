// Analytics service for tracking user interactions
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

class AnalyticsService {
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = process.env.NODE_ENV === 'production';
  }

  // Track page views
  trackPageView(path: string, title?: string) {
    if (!this.isEnabled || !window.gtag) return;

    window.gtag('config', 'G-XXXXXXXXXX', {
      page_path: path,
      page_title: title
    });
  }

  // Track events
  trackEvent(action: string, category: string, label?: string, value?: number) {
    if (!this.isEnabled || !window.gtag) return;

    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }

  // E-commerce tracking
  trackPurchase(transactionId: string, items: any[], value: number) {
    if (!this.isEnabled || !window.gtag) return;

    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: 'COP',
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        category: item.category,
        quantity: item.quantity,
        price: item.price
      }))
    });
  }

  // Track add to cart
  trackAddToCart(item: any) {
    if (!this.isEnabled || !window.gtag) return;

    window.gtag('event', 'add_to_cart', {
      currency: 'COP',
      value: item.price,
      items: [{
        item_id: item.id,
        item_name: item.name,
        category: item.category,
        quantity: 1,
        price: item.price
      }]
    });
  }

  // Track remove from cart
  trackRemoveFromCart(item: any) {
    if (!this.isEnabled || !window.gtag) return;

    window.gtag('event', 'remove_from_cart', {
      currency: 'COP',
      value: item.price,
      items: [{
        item_id: item.id,
        item_name: item.name,
        category: item.category,
        quantity: item.quantity,
        price: item.price
      }]
    });
  }

  // Track begin checkout
  trackBeginCheckout(items: any[], value: number) {
    if (!this.isEnabled || !window.gtag) return;

    window.gtag('event', 'begin_checkout', {
      currency: 'COP',
      value: value,
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        category: item.category,
        quantity: item.quantity,
        price: item.price
      }))
    });
  }

  // Track search
  trackSearch(searchTerm: string) {
    if (!this.isEnabled || !window.gtag) return;

    window.gtag('event', 'search', {
      search_term: searchTerm
    });
  }

  // Track user engagement
  trackEngagement(action: string, element?: string) {
    if (!this.isEnabled || !window.gtag) return;

    window.gtag('event', 'engagement', {
      engagement_action: action,
      engagement_element: element
    });
  }

  // Track custom events
  trackCustomEvent(eventName: string, parameters: Record<string, any> = {}) {
    if (!this.isEnabled || !window.gtag) return;

    window.gtag('event', eventName, parameters);
  }

  // Track user properties
  setUserProperties(properties: Record<string, any>) {
    if (!this.isEnabled || !window.gtag) return;

    window.gtag('config', 'G-XXXXXXXXXX', {
      custom_map: properties
    });
  }

  // Track timing
  trackTiming(name: string, value: number, category?: string) {
    if (!this.isEnabled || !window.gtag) return;

    window.gtag('event', 'timing_complete', {
      name: name,
      value: value,
      event_category: category || 'Performance'
    });
  }
}

export const analyticsService = new AnalyticsService();
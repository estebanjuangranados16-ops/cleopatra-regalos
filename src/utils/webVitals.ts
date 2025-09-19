// Función simplificada para medir Web Vitals
export const measureWebVitals = () => {
  // Medir performance básico
  if ('PerformanceObserver' in window) {
    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // First Contentful Paint
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          console.log('FCP:', entry.startTime);
        }
      });
    });
    fcpObserver.observe({ entryTypes: ['paint'] });
  }
};

// Optimizaciones automáticas
export const optimizeWebVitals = () => {
  // Preload critical resources
  const preloadCriticalResources = () => {
    const criticalImages = [
      '/assets/brand/logos/cleopatra-logo-gold.png',
      '/assets/brand/hero/cleopatra-hero-gifts.jpg'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  };

  // Optimize fonts loading
  const optimizeFonts = () => {
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.as = 'font';
    fontLink.type = 'font/woff2';
    fontLink.href = 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2';
    fontLink.crossOrigin = 'anonymous';
    document.head.appendChild(fontLink);
  };

  // Reduce layout shifts
  const preventLayoutShifts = () => {
    // Add aspect ratio to images without dimensions
    const images = document.querySelectorAll('img:not([width]):not([height])');
    images.forEach(img => {
      const element = img as HTMLImageElement;
      element.style.aspectRatio = '16/9';
    });
  };

  // Execute optimizations
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      preloadCriticalResources();
      optimizeFonts();
      setTimeout(preventLayoutShifts, 100);
    });
  } else {
    preloadCriticalResources();
    optimizeFonts();
    preventLayoutShifts();
  }
};

// Performance observer para métricas adicionales
export const observePerformance = () => {
  if ('PerformanceObserver' in window) {
    // Observar recursos lentos
    const resourceObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 1000) {
          console.warn('Slow resource detected:', entry.name, entry.duration + 'ms');
        }
      });
    });
    resourceObserver.observe({ entryTypes: ['resource'] });

    // Observar long tasks
    const longTaskObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.warn('Long task detected:', entry.duration + 'ms');
      });
    });
    longTaskObserver.observe({ entryTypes: ['longtask'] });
  }
};
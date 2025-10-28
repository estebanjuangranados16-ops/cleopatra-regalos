import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Theme } from './types';
import { sanitizeForLog } from './utils/security';
import { measureWebVitals, optimizeWebVitals, observePerformance } from './utils/webVitals';
import { preloadCriticalChunks, deferNonCriticalJS } from './utils/bundleOptimization';
import ErrorBoundary from './components/ErrorBoundary';
import SEOHead from './components/SEOHead';
import SEOHelmet from './components/SEOHelmet';
import { analyticsService } from './services/analyticsService';
import { seedService } from './services/seedService';
import { inventoryFix } from './utils/inventoryFix';
// Componentes críticos - no lazy
import Toast from './components/Toast';
import WhatsAppButton from './components/WhatsAppButton';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import ThemeToggleButton from './components/ThemeToggleButton';
import ConfirmProvider from './components/ConfirmProvider';
import InventoryDebugger from './components/InventoryDebugger';


// Critical components - no lazy for LCP
import Navbar from './components/Navbar';
import CriticalHero from './components/CriticalHero';
import Footer from './components/Footer';

// Heavy components - lazy load
const Hero = lazy(() => import('./components/Hero'));

// Lazy load components - optimizado
const CategorySelector = lazy(() => import('./components/CategorySelectorFixed'));
const About = lazy(() => import('./components/About'));
const HowItWorks = lazy(() => import('./components/HowItWorks'));
const Products = lazy(() => import('./components/ProductsComplete'));
const Features = lazy(() => import('./components/Features'));
const Gallery = lazy(() => import('./components/Gallery'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const Contact = lazy(() => import('./components/Contact'));

// Pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const ShopPage = lazy(() => import('./pages/ShopPageEnhanced'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const PaymentFailure = lazy(() => import('./pages/PaymentFailure'));


// Loading component optimizado
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
    <p className="text-gray-600 text-sm">Cargando Cleopatra...</p>
  </div>
);

// Home component
const HomePage: React.FC = () => {
  const [showCategorySelector, setShowCategorySelector] = useState(() => {
    // Solo mostrar si no se ha seleccionado en esta sesión (refresh)
    return !sessionStorage.getItem('cleopatra-theme-selected');
  });

  const handleCategorySelect = (category: Theme) => {
    // Guardar que ya se seleccionó en esta sesión
    sessionStorage.setItem('cleopatra-theme-selected', 'true');
    setTimeout(() => {
      setShowCategorySelector(false);
    }, 500);
  };

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AnimatePresence>
        {showCategorySelector && (
          <CategorySelector onSelect={handleCategorySelect} />
        )}
      </AnimatePresence>

      {!showCategorySelector && (
        <>
          <Navbar />
          <Suspense fallback={<CriticalHero />}>
            <Hero />
          </Suspense>
          <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse" />}>
            <About />
          </Suspense>
          <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse" />}>
            <HowItWorks />
          </Suspense>
          <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse" />}>
            <Products />
          </Suspense>
          <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse" />}>
            <Features />
          </Suspense>
          <Suspense fallback={<div className="h-screen bg-gray-100 animate-pulse" />}>
            <Gallery />
          </Suspense>
          <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse" />}>
            <Testimonials />
          </Suspense>
          <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse" />}>
            <Contact />
          </Suspense>
          <Footer />
        </>
      )}
    </Suspense>
  );
};

const App: React.FC = () => {
  React.useEffect(() => {
    // Optimizaciones críticas de performance
    preloadCriticalChunks();
    deferNonCriticalJS();
    optimizeWebVitals();
    
    // Medir Web Vitals
    measureWebVitals();
    
    // Observar performance
    observePerformance();
    
    // Track initial page view
    analyticsService.trackPageView(window.location.pathname, document.title);
    
    // Initialize Firebase data with timeout
    const initTimeout = setTimeout(() => {
      console.log('Firebase inicialización tomando mucho tiempo - continuando en modo local');
    }, 5000);
    
    seedService.initializeData()
      .then(() => {
        clearTimeout(initTimeout);
        // Hacer disponible la utilidad de inventario en desarrollo
        if (process.env.NODE_ENV === 'development') {
          console.log('🛠️ Utilidad de inventario disponible: inventoryFix.resetInventory()');
        }
      })
      .catch(error => {
        clearTimeout(initTimeout);
        console.log('Datos inicializados en modo local:', error.message);
      });
    
    // Registrar Service Worker para PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', sanitizeForLog(String(registration)));
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', sanitizeForLog(String(registrationError)));
          });
      });
    }
  }, []);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <AuthProvider>
          <ThemeProvider>
            <ConfirmProvider>
            <Router>
              <div className="App">
                <SEOHead />
                <SEOHelmet />
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/checkout/success" element={<PaymentSuccess />} />
                    <Route path="/checkout/failure" element={<PaymentFailure />} />
                    <Route path="/checkout/pending" element={<PaymentSuccess />} />
                    <Route path="/admin" element={<AdminPage />} />

                  </Routes>
                </Suspense>
                
                <Toast />
                <WhatsAppButton />
                <ThemeToggleButton />
                <InventoryDebugger />

                <PWAInstallPrompt />
              </div>
            </Router>
            </ConfirmProvider>
          </ThemeProvider>
        </AuthProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
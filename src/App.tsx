import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Theme } from './types';
import { sanitizeForLog } from './utils/security';
import ErrorBoundary from './components/ErrorBoundary';
// Componentes críticos - no lazy
import Toast from './components/Toast';
import WhatsAppButton from './components/WhatsAppButton';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import ThemeToggleButton from './components/ThemeToggleButton';

// Lazy load components - optimizado
const CategorySelector = lazy(() => import('./components/CategorySelectorFixed'));
const Navbar = lazy(() => import('./components/Navbar'));
const Hero = lazy(() => import('./components/Hero'));
const About = lazy(() => import('./components/About'));
const HowItWorks = lazy(() => import('./components/HowItWorks'));
const Products = lazy(() => import('./components/ProductsComplete'));
const Features = lazy(() => import('./components/Features'));
const Gallery = lazy(() => import('./components/Gallery'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));

// Pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const ShopPage = lazy(() => import('./pages/ShopPageEnhanced'));

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
          <Hero />
          <About />
          <HowItWorks />
          <Products />
          <Features />
          <Gallery />
          <Testimonials />
          <Contact />
          <Footer />
        </>
      )}
    </Suspense>
  );
};

const App: React.FC = () => {
  React.useEffect(() => {
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
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <div className="App">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                </Routes>
              </Suspense>
              
              <Toast />
              <WhatsAppButton />
              <ThemeToggleButton />
              <PWAInstallPrompt />
            </div>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
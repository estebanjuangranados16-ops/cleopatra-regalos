import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Theme } from './types';

// Lazy load components
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
const Toast = lazy(() => import('./components/Toast'));
const WhatsAppButton = lazy(() => import('./components/WhatsAppButton'));
const PWAInstallPrompt = lazy(() => import('./components/PWAInstallPrompt'));
const AdminRoute = lazy(() => import('./components/AdminRoute'));

// Pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const ShopPage = lazy(() => import('./pages/ShopPageEnhanced'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

// Home component
const HomePage: React.FC = () => {
  const [showCategorySelector, setShowCategorySelector] = useState(true);

  const handleCategorySelect = (category: Theme) => {
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
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  return (
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
            
            <Suspense fallback={null}>
              <Toast />
            </Suspense>
            
            <Suspense fallback={null}>
              <WhatsAppButton />
            </Suspense>
            
            <Suspense fallback={null}>
              <PWAInstallPrompt />
            </Suspense>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
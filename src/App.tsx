import React, { useState, lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Theme } from './types';

// Lazy load components
const CategorySelector = lazy(() => import('./components/CategorySelector'));
const Navbar = lazy(() => import('./components/Navbar'));
const Hero = lazy(() => import('./components/Hero'));
const About = lazy(() => import('./components/About'));
const HowItWorks = lazy(() => import('./components/HowItWorks'));
const Products = lazy(() => import('./components/Products'));
const Features = lazy(() => import('./components/Features'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));
const Toast = lazy(() => import('./components/Toast'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

const App: React.FC = () => {
  const [showCategorySelector, setShowCategorySelector] = useState(true);

  const handleCategorySelect = (category: Theme) => {
    setTimeout(() => {
      setShowCategorySelector(false);
    }, 500);
  };

  return (
    <AuthProvider>
      <ThemeProvider>
        <div className="App">
          <AnimatePresence>
            {showCategorySelector && (
              <Suspense fallback={<LoadingSpinner />}>
                <CategorySelector onSelect={handleCategorySelect} />
              </Suspense>
            )}
          </AnimatePresence>

          {!showCategorySelector && (
            <Suspense fallback={<LoadingSpinner />}>
              <Navbar />
              <Hero />
              <About />
              <HowItWorks />
              <Products />
              <Features />
              <Testimonials />
              <Contact />
              <Footer />
            </Suspense>
          )}
          
          <Suspense fallback={null}>
            <Toast />
          </Suspense>
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
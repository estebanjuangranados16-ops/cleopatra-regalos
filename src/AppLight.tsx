import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Theme } from './types';

// Light components
import CategorySelector from './components/CategorySelector';
import Navbar from './components/Navbar';
import LightHero from './components/LightHero';
import About from './components/About';
import Products from './components/Products';
import Contact from './components/Contact';
import Footer from './components/Footer';

const AppLight: React.FC = () => {
  const [showCategorySelector, setShowCategorySelector] = useState(true);

  const handleCategorySelect = (category: Theme) => {
    setTimeout(() => {
      setShowCategorySelector(false);
    }, 300);
  };

  return (
    <AuthProvider>
      <ThemeProvider>
        <div className="App">
          {showCategorySelector && (
            <CategorySelector onSelect={handleCategorySelect} />
          )}

          {!showCategorySelector && (
            <>
              <Navbar />
              <LightHero />
              <About />
              <Products />
              <Contact />
              <Footer />
            </>
          )}
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default AppLight;
import React, { useEffect } from 'react';
import SalesPresentation from '../components/SalesPresentation';

const PresentationPage: React.FC = () => {
  useEffect(() => {
    // Prevent scrolling when presentation is active
    document.body.style.overflow = 'hidden';
    
    // Keyboard navigation
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        window.history.back();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return <SalesPresentation />;
};

export default PresentationPage;
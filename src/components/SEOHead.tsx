import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Cleopatra Regalos - Regalos Únicos y Tecnología Premium',
  description = 'Descubre regalos únicos, tecnología premium y momentos especiales en Cleopatra Regalos. Envíos a Madrid, Cundinamarca. ¡Encuentra el regalo perfecto!',
  keywords = 'regalos, tecnología, smartphones, peluches, canastas, desayunos, Madrid Cundinamarca, regalos únicos',
  image = 'https://cleopatra-7b03b.web.app/assets/brand/hero/cleopatra-hero-gifts.jpg',
  url = 'https://cleopatra-7b03b.web.app',
  type = 'website'
}) => {
  const siteName = 'Cleopatra Regalos';
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Cleopatra Regalos" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />

      {/* Open Graph (Facebook, WhatsApp) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="es_CO" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Business Info */}
      <meta name="geo.region" content="CO-CUN" />
      <meta name="geo.placename" content="Madrid, Cundinamarca" />
      <meta name="geo.position" content="4.7297;-74.2675" />
      
      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#FFD300" />
      
      {/* Preconnect for Performance */}
      <link rel="preconnect" href="https://res.cloudinary.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://firestore.googleapis.com" />
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Store",
          "name": "Cleopatra Regalos",
          "description": description,
          "url": url,
          "logo": "https://cleopatra-7b03b.web.app/assets/brand/logos/cleopatra-logo-gold.png",
          "image": image,
          "telephone": "+57-302-454-7679",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Madrid",
            "addressRegion": "Cundinamarca",
            "addressCountry": "CO"
          },
          "sameAs": [
            "https://wa.me/573024547679"
          ],
          "priceRange": "$$",
          "paymentAccepted": "Cash, Credit Card, Bank Transfer"
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;
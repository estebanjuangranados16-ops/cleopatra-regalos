import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOHelmetProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: string;
}

const SEOHelmet: React.FC<SEOHelmetProps> = ({
  title,
  description,
  keywords,
  image,
  type = 'website'
}) => {
  const location = useLocation();
  const baseUrl = 'https://cleopatraregalos.com';
  
  const seoData = {
    title: title || 'Cleopatra Regalos - Regalos Únicos y Tecnología Premium',
    description: description || 'Descubre regalos únicos, tecnología premium y productos exclusivos en Cleopatra Regalos. Envíos a toda Colombia. ¡Sorprende con estilo!',
    keywords: keywords || 'regalos, tecnología, productos premium, envíos Colombia, regalos únicos, smartwatch, peluches, canastas',
    image: image || `${baseUrl}/og-image.jpg`,
    url: `${baseUrl}${location.pathname}`
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "Cleopatra Regalos",
    "description": seoData.description,
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "image": seoData.image,
    "telephone": "+57-302-454-7679",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Madrid",
      "addressRegion": "Cundinamarca",
      "addressCountry": "CO"
    },
    "openingHours": "Mo-Su 08:00-20:00",
    "priceRange": "$$",
    "acceptsReservations": false,
    "servesCuisine": [],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Catálogo de Productos",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Regalos Únicos"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Product",
            "name": "Tecnología Premium"
          }
        }
      ]
    }
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seoData.title}</title>
      <meta name="description" content={seoData.description} />
      <meta name="keywords" content={seoData.keywords} />
      <meta name="author" content="Cleopatra Regalos" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={seoData.url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={seoData.title} />
      <meta property="og:description" content={seoData.description} />
      <meta property="og:image" content={seoData.image} />
      <meta property="og:url" content={seoData.url} />
      <meta property="og:site_name" content="Cleopatra Regalos" />
      <meta property="og:locale" content="es_CO" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoData.title} />
      <meta name="twitter:description" content={seoData.description} />
      <meta name="twitter:image" content={seoData.image} />

      {/* Additional SEO */}
      <meta name="theme-color" content="#FFD300" />
      <meta name="msapplication-TileColor" content="#FFD300" />
      <meta name="application-name" content="Cleopatra Regalos" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* Google Analytics */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XXXXXXXXXX');
        `}
      </script>
    </Helmet>
  );
};

export default SEOHelmet;
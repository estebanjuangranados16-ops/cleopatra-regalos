import { Product, Testimonial, Feature } from '../types';

export const products: Product[] = [
  {
    id: 1,
    name: 'Collar de Perlas Elegante',
    price: 150000,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400'
    ],
    videos: [
      'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
    ],
    images360: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400',
      'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400'
    ],
    category: 'regalos',
    description: 'Hermoso collar de perlas naturales, perfecto para ocasiones especiales.'
  },
  {
    id: 2,
    name: 'Reloj de Lujo Dorado',
    price: 280000,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400',
    images: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400',
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400',
      'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=400'
    ],
    category: 'regalos',
    description: 'Reloj elegante con acabado dorado y mecanismo de precisión.'
  },
  {
    id: 3,
    name: 'Smartphone Premium',
    price: 1200000,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
      'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400'
    ],
    category: 'tecnologia',
    description: 'Último modelo con cámara avanzada y procesador de alta velocidad.'
  },
  {
    id: 4,
    name: 'Auriculares Inalámbricos',
    price: 350000,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400'
    ],
    category: 'tecnologia',
    description: 'Auriculares con cancelación de ruido y sonido de alta fidelidad.'
  },
  {
    id: 5,
    name: 'Pulsera de Diamantes',
    price: 450000,
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400',
    images: [
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
      'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400'
    ],
    category: 'regalos',
    description: 'Elegante pulsera con diamantes genuinos, ideal para regalar.'
  },
  {
    id: 6,
    name: 'Tablet Profesional',
    price: 800000,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400'
    ],
    category: 'tecnologia',
    description: 'Tablet de alto rendimiento para trabajo y entretenimiento.'
  }
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'María González',
    role: 'Cliente Frecuente',
    content: 'Excelente servicio y productos de calidad. Siempre encuentro el regalo perfecto.',
    avatar: '',
    rating: 5
  },
  {
    id: 2,
    name: 'Carlos Rodríguez',
    role: 'Empresario',
    content: 'La mejor tienda de tecnología en Madrid. Productos innovadores y atención personalizada.',
    avatar: '',
    rating: 5
  },
  {
    id: 3,
    name: 'Ana Martínez',
    role: 'Diseñadora',
    content: 'Me encanta la elegancia de sus productos. Cada compra es una experiencia única.',
    avatar: '',
    rating: 5
  }
];

export const features: Feature[] = [
  {
    id: 1,
    icon: 'Shield',
    title: 'Garantía Total',
    description: 'Todos nuestros productos incluyen garantía completa'
  },
  {
    id: 2,
    icon: 'Truck',
    title: 'Envío Gratis',
    description: 'Entrega gratuita en Madrid y alrededores'
  },
  {
    id: 3,
    icon: 'Clock',
    title: 'Atención 24/7',
    description: 'Soporte técnico disponible las 24 horas'
  },
  {
    id: 4,
    icon: 'Star',
    title: 'Calidad Premium',
    description: 'Solo trabajamos con las mejores marcas'
  }
];